# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from descope import (
    REFRESH_SESSION_TOKEN_NAME,
    SESSION_TOKEN_NAME,
    DescopeClient,
)

# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
CORS(app)

# The route() function of the Flask class is a decorator,
# which tells the application which URL should call
# the associated function.
@app.route('/un-protected')
# ‘/’ URL is bound with hello_world() function.
def public_assets():
    return 'public assets'

@app.route('/protected', methods=['GET'])
def protected_assets():
    # check the session token validity and if not valid, then return 403 else return assets
    
    session_token = request.headers["Authorization"].split(" ")[1]
    
    try:
        descope_client = DescopeClient(project_id='__ProjectId__')
        jwt_response = descope_client.validate_session(session_token=session_token)
        print ("Successfully validated user session:")
        # print (jwt_response)
        response = make_response(
        jsonify(
            {"message": str("Secret Code: Descope Rocks!"), "severity": "danger"}
        ),
        200,
        )
        response.headers["Content-Type"] = "application/json"
        return response

    except Exception as error:
        print ("Could not validate user session. Error:")
        print (error)
        response = make_response(
                jsonify(
                    {"message": str("not allowed"), "severity": "danger"}
                ),
                401,
            )
        response.headers["Content-Type"] = "application/json"
        return response

# main driver function
if __name__ == '__main__':
 
    # run() method of Flask class runs the application
    # on the local development server.
    app.run(port=8080)