from . import app

@app.route('/', methods=['GET'])
def index():
  return {
    "rota": "/",
    "sucesso": True
  }