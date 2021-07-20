FROM python:3.9.6-buster

# Install tools
ENV DEBIAN_FRONTEND=noninteractive
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get update && apt-get install nginx nodejs -q -y --no-install-recommends

# Configure nginx
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/nginx.default /etc/nginx/sites-available/default
RUN ln -sf /dev/stdout /var/log/nginx/access.log && ln -sf /dev/stderr /var/log/nginx/error.log
RUN mkdir -p /var/lib/nginx
RUN mkdir -p /var/lib/nginx/body
RUN mkdir -p /var/lib/nginx/fastcgi
RUN chown -R www-data:www-data /var/lib/nginx
VOLUME "/var/lib/nginx"

# Copy files
RUN mkdir -p /opt/app/pip_cache
RUN mkdir -p /opt/app/katrinconsole/static/
WORKDIR /opt/app/katrinconsole/

COPY docker/start-server.sh /opt/app/
COPY katrinconsole /opt/app/katrinconsole/katrinconsole/
COPY manage.py /opt/app/katrinconsole/manage.py
COPY staticfiles /opt/app/katrinconsole/staticfiles/
COPY requirements.txt /opt/app/katrinconsole/requirements.txt
COPY fixtures/ /opt/app/katrinconsole/fixtures/

COPY katrinconsole-web /opt/app/katrinconsole/katrinconsole-web
COPY package.json /opt/app/katrinconsole/package.json
COPY package-lock.json /opt/app/katrinconsole/package-lock.json
COPY tsconfig.json /opt/app/katrinconsole/tsconfig.json
COPY webpack.config.js /opt/app/katrinconsole/webpack.config.js

# Build
ARG OAUTH_CLIENT_ID_ARG
ARG OAUTH_CLIENT_SECRET_ARG
ENV OAUTH_CLIENT_ID=${OAUTH_CLIENT_ID_ARG}
ENV OAUTH_CLIENT_SECRET=${OAUTH_CLIENT_SECRET_ARG}
RUN npm install --quiet --no-progress
RUN npm run build
RUN pip install -r requirements.txt --cache-dir /opt/app/pip_cache
RUN python manage.py collectstatic --no-input

# Config
RUN chown -R www-data:www-data /opt/app/katrinconsole/
EXPOSE 8080

# Run
CMD ["/opt/app/start-server.sh"]
