# Deus me Livro
projeto para apresentação do trabalho de sistemas de recomendação

## Passos para rodar na sua máquina
1) Você precisa ter o Docker instalado e rodando
2) Faça um clone do projeto com o coamando ```git clone https://github.com/vagnerLenon/recomendacao-react-flask.git```\
3) Vá pelo terminal até a pasta do projeto
4) Use o comando `docker-compose up`. Na minha máquia deu alguns erros mas executando o mesmo comando mais algumas vezes deu certo. Provavelmente alguma coisa processando junto da outra
5) Depois do docker criar e configurar as imagens ele vai subir dois serviços que são servidores http:\
   - http://localhost:5000 - Servidor backend em Flask
   - http://localhost:3000 - Servidor Frontend em React

Para utilizar o sistema basta entrar no servidor frontend http://localhost:3000, inserir seu nome e ir brincando com os dados

Para parar a execução vá até o terminal onde está rodando o docker e aperte ctrl+C ou no docker pare a execução do container.