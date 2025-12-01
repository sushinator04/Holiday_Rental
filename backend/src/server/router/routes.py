from flask_restful import Api
import server.resources as res


def add_routes(app):
    api = Api(app)
    return api
