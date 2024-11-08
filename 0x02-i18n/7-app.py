from flask import Flask, render_template, request, g
from flask_babel import Babel, _
import pytz
from pytz.exceptions import UnknownTimeZoneError

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
    """Determine the best match for supported languages in order of priority."""
    # 1. Locale from URL parameters
    locale = request.args.get('locale')
    if locale in app.config['LANGUAGES']:
        return locale

    # 2. Locale from user settings
    if g.user and g.user.get("locale") in app.config['LANGUAGES']:
        return g.user["locale"]

    # 3. Locale from request header
    return request.accept_languages.best_match(app.config['LANGUAGES'])

@babel.timezoneselector
def get_timezone():
    """Determine the best match for time zone in order of priority:
    1. Timezone from URL parameters
    2. Timezone from user settings
    3. Default to UTC
    """
    # 1. Timezone from URL parameters
    timezone = request.args.get('timezone')
    if timezone:
        try:
            # Validate the timezone
            pytz.timezone(timezone)
            return timezone
        except UnknownTimeZoneError:
            pass  # Invalid timezone, fall back to the next option

    # 2. Timezone from user settings
    if g.user and g.user.get("timezone"):
        try:
            pytz.timezone(g.user["timezone"])
            return g.user["timezone"]
        except UnknownTimeZoneError:
            pass  # Invalid user timezone, fall back to default

    # 3. Default timezone (UTC)
    return app.config['BABEL_DEFAULT_TIMEZONE']

@app.route('/')
def home():
    return render_template('7-index.html')

if __name__ == '__main__':
    app.run(debug=True)

