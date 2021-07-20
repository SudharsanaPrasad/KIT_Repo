# First Landing

## How to build and run

### Development Environment

#### IDE

Recommended Editor: Visual Studio Code with the recommended extensions (available in file [vscode-extensions](vscode-extensions)).
You can install them in a bunch using `cat vscode-extensions | xargs -L 1 echo code --install-extension`

#### Python Virtual Environment

1. `pip3 install virtualenv`
2. `virtualenv venv`
3. `source venv/bin/activate` to activate the virtual env.

Note in debugging you need to setup your own database and your own rabbitmq instance.
Refer to the sections `Running a MySQL database server for testing` and to `Running an RabbitMQ instance`

#### Running a MySQL database server for testing

1. `mkdir ~/mysqldata` then `docker pull mysql:latest`
2. `docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -v ~/mysqldata:/var/lib/mysql -d mysql`
3. Create testing database: 
    a. `docker exec -it some-mysql /bin/bash`
    b. In docker's bash shell: `mysql -p` to login to mysql shell with root password
    c. In mysql shell: `CREATE DATABASE katrinconsole CHARACTER SET UTF8;`
4. `python3 manage.py migrate`
5. Create superuser: `python3 manage.py createsuperuser`

#### Running an RabbitMQ instance

1. `docker pull rabbitmq:latest`
2. `docker run -d --name some-rabbit -p 5672:5672 -e RABBITMQ_DEFAULT_USER=katrinconsole -e RABBITMQ_DEFAULT_PASS='$ipepdv$' rabbitmq`
3. `docker exec -t some-rabbit rabbitmqctl add_vhost katrinconsole`
4. `docker exec -t some-rabbit rabbitmqctl set_permissions -p katrinconsole katrinconsole ".*" ".*" ".*"`

### Backend

Stack: Python + Django + Django REST Framework + Celery (for background tasks) + RabbitMQ
+ Swagger (for API documentation)

1. `pip3 install -r requirements.txt`
2. Set env. variable `DEBUG` to `True`: `export DEBUG=True` and define necessary environment variables check [Deployment §Environment Variables](Deployment.md)
3. Check if you miss any settings using `python3 manage.py check`
4. Create superuser: `python3 manage.py createsuperuser`
5. `python3 manage.py runserver`

### Frontend

Stack: Typescript + ReactJS + Webpack + eslint + npm + Ant Design

1. Install NodeJS: `sudo apt install -y nodejs`
2. run `npm install`
3. create dotenv file: `touch .env` and add the following variables with their corresponding values:

```bash
OAUTH_CLIENT_ID=<oauth_client_id_here>
OAUTH_CLIENT_SECRET=<oauth_client_secret_here>
```
The values can be obtained from `localhost:8000/o/applications/`.
Refer to question `Q3. How to add a new OAuth application?` in [FAQ page](FAQ.md).
3. run `npm start`
x. Make sure the edits you made confirm with the app style: `npm run lint` or check with editor `eslint` plugin

## Adding a new application

KATRIN Console features are managed by different Django Applications e.g. core
api are in application `katrinconsole.core` folder 'core'. Each student who is
responsible for a specific feature has to implement it in a distinct application.
The process is as follows:

1. Creating a git branch for your feature: `git checkout -b feature-<feature_name_here>`
e.g. `git checkout -b feature-core` ('core' is the name of the feature)
2. Create subdirectory for your new app: `mkdir katrinconsole/<feature_name_here>` e.g. `mkdir katrinconsole/core` 
3. Start new app in the created directory: `python3 manage.py startapp <feature_name_here> <feature_directory>` e.g.
`python3 manage.py startapp core katrinconsole/core`
4. Go to `katrinconsole/<feature_name>/apps.py` and change line 6 from:

```python
...
    name = '<feature_name>' 
```

to

```python
...
    name = 'katrinconsole.<feature_name>' 
```

e.g. 


```python
...
    name = 'katrinconsole.core' # it was: name = 'core'
```

5. Add django urls to your new app: In your application folder `katrinconsole/<feature_name>`,
create new a python file for your urls: `touch urls.py` then add a `urlpatterns` list in this file.
Here you add your urls for this specific application. E.g. Create file `katrinconsole/core/urls.py`
and add the following:

```python
urlpatterns = [
    # here you add your application django url setup e.g. path('/all', view)
]
```

6. Add your application to `INSTALLED_APPS` in `katrinconsole/settings.py`: 

e.g. 

```python
INSTALLED_APPS = [
    ...,
    # add your apps below this line
    'katrinconsole.core',
    ....
]
```
7. Add your application urls (of step 5) to  the main `urlpatterns` list in root
urls file: `katrinconsole/urls.py`, All apps URLs should start with `api/`.
To do so, we use the `path('api/', include([]))` entry: add your application
URLs file to the list of `include` e.g. for `core` application, we add 
`path('', include('katrinconsole.core.urls')),` to the list (use root of 'api/'
to add core URLs), for other apps: add 
`path('<feature_name>', include('katrinconsole.<feature_name>.urls')),`

Note: Applicatione `core` uses `api/` root URL but other applications use
`api/feature_name`.

```python
urlpatterns = [
    # server side routing including API endpoints
    path('admin/', admin.site.urls),
    path('accounts/', include('rest_framework.urls')),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('api/', include([
        path('swagger/', schema_view.with_ui('swagger',
                                             cache_timeout=0), name='schema-swagger-ui'),
        # APPLICATIONS HERE: add your application urls BELOW this line
        path('', include('katrinconsole.core.urls')),
        # e.g. path('<feature_name>', include('katrinconsole.<feature_name>.urls'))
        # APPLICATIONS END: add your application urls ABOVE this line
    ])),
    # map to client side routing
    re_path(r'^.*$', home),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
```

Now, you can test your url endpoints using Swagger: `http://localhost:8000/api/swagger/`
