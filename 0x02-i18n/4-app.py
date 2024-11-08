from flask import Flask, render_template, request
from flask_babel import Babel, _

app = Flask(__name__)

class Config:
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app.config.from_object(Config)

babel = Babel(app)

@babel.localeselector
def get_locale():
    # Check if 'locale' is in the request arguments
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    # Fallback to the best match from the request
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def home():
    return render_template('4-index.html')

if __name__ == '__main__':
    app.run(debug=True)

