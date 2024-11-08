from flask import Flask, render_template, request, g
from flask_babel import Babel, _

app = Flask(__name__)

# Configuration
class Config:
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"

app.config.from_object(Config)
babel = Babel(app)

# Mocked user data
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}

def get_user():
    """Retrieve a user by the login_as parameter."""
    user_id = request.args.get('login_as')
    if user_id and user_id.isdigit():
        return users.get(int(user_id))
    return None

@app.before_request
def before_request():
    """Set the user as a global if present."""
    g.user = get_user()

@babel.localeselector
def get_locale():
    """Determine the best match for supported languages."""
    # Check if the user has a preferred locale
    if g.user and g.user.get("locale") in app.config['LANGUAGES']:
        return g.user["locale"]
    # Check for locale parameter in request
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale
    # Fallback to the best match from the request
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@app.route('/')
def home():
    return render_template('5-index.html')

if __name__ == '__main__':
    app.run(debug=True)

