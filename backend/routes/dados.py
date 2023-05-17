from . import app


@app.route("/data", methods=["GET"])
def data():
    return [
        {"nome": "Vágner Lenon", "sucesso": True},
        {"nome": "Tainara da Silva", "sucesso": True},
    ]
