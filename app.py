from flask import Flask,send_from_directory

app=Flask(__name__,static_folder="./assets",template_folder="")


@app.route("/")
def index():
    return send_from_directory(app.template_folder, 'index.html')

@app.route('/assets/<path:path>')
def send_asset(path):
    return send_from_directory(app.static_folder, path)


 

if __name__ == '__main__':
    app.run(debug=True)