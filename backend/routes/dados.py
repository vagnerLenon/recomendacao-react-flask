import pandas as pd

from . import app


@app.route("/get_locations", methods=["GET"])
def get_locations():
    locations = pd.read_parquet("data/users.parquet").LOCATION.unique().tolist()
    return locations
