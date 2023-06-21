import pandas as pd

# Biblioteca de Similaridade por cosseno https://pt.wikipedia.org/wiki/Similaridade_por_cosseno
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from flask import request
from . import app
from datetime import date, datetime


def recomendations(idade: int = None, pais: str = None):
    pass


@app.route("/paises", methods=["GET"])
def get_locations():
    locations = pd.read_parquet("data/paises.parquet").COUNTRY.unique().tolist()
    return locations


@app.route("/books_list", methods=["GET"])
def get_books_list():
    livros = (
        pd.read_parquet(r"data\livros_lista.parquert")
        .sort_values("TITLE")
        .drop_duplicates("TITLE")
        .to_dict("records")
    )
    return livros


@app.route("/popularity", methods=["POST"])
def get_popularity():
    dados = request.json

    livros_df = pd.read_parquet("data/books.parquet")
    avaliacoes_df = pd.read_parquet("data/ratings.parquet")

    if dados.get("nascimento") is not None or dados.get("pais") is not None:
        users_df = pd.read_parquet("data/users.parquet")
        if dados.get("nascimento") is not None:
            nascimento = datetime.strptime(dados.get("nascimento"), "%Y-%m-%d")

            # Calcular idade com base em data de nascimento
            hoje = date.today()
            idade = (
                hoje.year
                - nascimento.year
                - ((hoje.month, hoje.day) < (nascimento.month, nascimento.day))
            )

            users_df.dropna(subset="AGE", inplace=True)
            users_df["AGE"] = users_df["AGE"].astype("int32")
            users_df = users_df[
                users_df.AGE.isin([i for i in range(idade - 2, idade + 3)])
            ]

        if dados.get("pais") is not None:
            users_df = users_df[users_df.COUNTRY == dados.get("pais")]

        avaliacoes_df = avaliacoes_df[avaliacoes_df.USER_ID.isin(users_df.ID)]

    # Juntando a informação de avaliação com os detalhes do livro
    avaliacoes_com_info_df = avaliacoes_df.merge(livros_df, on="ISBN")

    # Dataframe com a quantidade de avaliações de cada livro
    qtd_avaliacoes_df = (
        avaliacoes_com_info_df.groupby("TITLE").count()["RATING"].reset_index()
    )
    qtd_avaliacoes_df.rename(columns={"RATING": "QTD_AVALIACOES"}, inplace=True)

    # Dataframe com a média das avaliações
    media_avaliacoes_df = (
        avaliacoes_com_info_df[["TITLE", "RATING"]]
        .groupby("TITLE")
        .mean()["RATING"]
        .reset_index()
    )
    media_avaliacoes_df.rename(columns={"RATING": "MEDIA_AVALIACOES"}, inplace=True)

    # Dataframe com as médias ponderadas
    # Como a avaliação vai de 0 a 10, diminuo 5 da avaliação
    # Neste caso, as notas 10 viram 5, as 5 viram 0 e as 0 viram -5
    # Isso para somar essas avaliações e verificar quem teve mais avaliações positivas
    # Isso vai medir a popularidade na quantidade de avaliações e nas avaliações mais positivas

    correcao_avaliacoes_df = avaliacoes_com_info_df[["TITLE", "RATING"]]
    correcao_avaliacoes_df["RATING"] = correcao_avaliacoes_df["RATING"].apply(
        lambda x: x - 5
    )
    correcao_avaliacoes_df.rename(
        columns={"RATING": "AVALIACAO_ACUMULADA"}, inplace=True
    )
    correcao_avaliacoes_df = (
        correcao_avaliacoes_df.groupby("TITLE")
        .sum()
        .sort_values("AVALIACAO_ACUMULADA", ascending=False)
        .reset_index()
    )

    # Junto os três dataframes em um só
    popular_df = qtd_avaliacoes_df.merge(media_avaliacoes_df, on="TITLE")
    popular_df = popular_df.merge(correcao_avaliacoes_df, on="TITLE")

    # Faço o merge das avaliações com o dataframe de livros para pegar mais detalhes do s livros
    popular_df = popular_df.merge(livros_df, on="TITLE").drop_duplicates("TITLE")[
        [
            "TITLE",
            "AUTHOR",
            "IMAGE_S",
            "IMAGE_M",
            "IMAGE_L",
            "QTD_AVALIACOES",
            "MEDIA_AVALIACOES",
            "AVALIACAO_ACUMULADA",
        ]
    ]

    # Como exemplo, os 10 Livros mais populares por avaliação acumulada
    recomendados_df = popular_df.sort_values(
        "AVALIACAO_ACUMULADA", ascending=False
    ).head(10)

    # 10 livros a conhecer (com maiores médias de avaliações e que não estão nos recomendados)
    conhecer_df = (
        popular_df[~popular_df.TITLE.isin(recomendados_df.TITLE)]
        .sort_values(["MEDIA_AVALIACOES", "QTD_AVALIACOES"], ascending=False)
        .head(10)
    )

    return {
        "success": True,
        "popular": recomendados_df.to_dict("records"),
        "conhecer": conhecer_df.to_dict("records"),
    }


@app.route("/similaridade", methods=["GET"])
def get_similarity():
    title = request.args.get("title")

    def livros_recomendados_similaridade(title: str, quant: int = 5):
        books_df = pd.read_parquet(r"data\books.parquet")
        pivot_table_df = pd.read_parquet(r"data\pivot.parquet")
        similaridade_cosseno = cosine_similarity(pivot_table_df)

        try:
            if not title in pivot_table_df.index:
                return {
                    "Success": False,
                    "Message": f'O livro "{title}" não consta em nossa lista.',
                }

            index = np.where(pivot_table_df.index == title)[0][0]

            # Lista os items similares ao informado (começando do segundo índice para não pegar o próprio livro)
            similar_items = sorted(
                enumerate(similaridade_cosseno[index]), key=lambda x: x[1], reverse=True
            )[1 : quant + 1]

            data = []
            for i in similar_items:
                item = {}
                temp_df = books_df[books_df["TITLE"] == pivot_table_df.index[i[0]]]
                item["TITLE"] = list(temp_df.drop_duplicates("TITLE")["TITLE"].values)[
                    0
                ]
                item["AUTHOR"] = list(
                    temp_df.drop_duplicates("TITLE")["AUTHOR"].values
                )[0]
                item["IMAGE_S"] = list(
                    temp_df.drop_duplicates("TITLE")["IMAGE_S"].values
                )[0]
                item["IMAGE_M"] = list(
                    temp_df.drop_duplicates("TITLE")["IMAGE_M"].values
                )[0]
                item["IMAGE_L"] = list(
                    temp_df.drop_duplicates("TITLE")["IMAGE_L"].values
                )[0]
                data.append(item)

            return {"success": True, "livros": data}
        except Exception as ex:
            return {"success": False, "Message": ex}

    return livros_recomendados_similaridade(title)
