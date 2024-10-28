from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-0=ac7xxn=uswnz566l%j8*9y5c77#-e9*v_o42qa7^c-rhow!0'

DEBUG = True

ALLOWED_HOSTS = [    
    '213.194.141.204',
    'localhost',
    '192.168.1.137',
    '192.168.56.1',
    '172.28.240.1:5173',
]

BASE_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

LOCAL_APPS =[
    'Apps.default_note_app',
] 

THIRDS_APPS=[
    'corsheaders', #Allow specific external domains to communicate with our API, particularly to enable Frontend-Backend communication across different addresses.
    'rest_framework',

]

INSTALLED_APPS = BASE_APPS + LOCAL_APPS + THIRDS_APPS

MIDDLEWARE = [    
    #----------CorsHeaders----------
    'corsheaders.middleware.CorsMiddleware',
    #----------CorsHeaders----------

    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'CoreApp.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'CoreApp.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'es-es'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allows requests from all domains (for development)
CORS_ALLOW_ALL_ORIGINS = True

# For production, use a specific list of domains
CORS_ALLOWED_ORIGINS = [
#    "https://frontend-domain.com",
#    'http://localhost:5173',	
#    "https://another-domain.com",

]