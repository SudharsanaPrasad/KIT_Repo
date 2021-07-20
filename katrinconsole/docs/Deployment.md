# Deployment

## Environment Variables

| Name                | Description                                                                           |
| ------------------- | ------------------------------------------------------------------------------------- |
| `DEBUG`             | Debugging environment flag (set to `True` in development deployment)                  |
| `ALLOWED_HOSTS`     | A comma-separated list of hosts e.g. `localhost,0.0.0.0`                              |
| `CELERY_BROKER_URL` | RabbitMQ broker URL e.g. `amqp://katrinconsole:$ipepdv$@localhost:5672/katrinconsole` |


## Build Docker container

### To run the container in development

1. Run mysql and rabbitmq instances. Refer to [FirstLanding §Running an RabbitMQ instance and §Running a MySQL database server for testing](FirstLanding.md)
2. python manage.py loaddata fixtures/oauth-apps.yaml
3. Build container: `docker build -t jalalmostafa/katrinconsole --build-arg OAUTH_CLIENT_ID=xwRDhl0ErCwqk7fP3zFeIeRQnMNiVpCHumPQbjcL --build-arg OAUTH_CLIENT_SECRET=pdJyMxtTcXhiBV0pN78SBVQOAmf8yOphAltvNdEr0r4pg0UTavVruanfnTAuZpunYfVWl9Zv7drI72ePzpWBmnZPzA5vb3j2On9TOXgxClTCMLZmxXYy4q8VWfpvKYEe .
4. run docker on host network `mkdir /tmp/nginx && docker run --name some-console -v /tmp/nginx:/var/lib/nginx/ -e DEBUG=True --network host jalalmostafa/katrinconsole`

### To run container in Kubernetes production

1. Create RabbitMQ DeploymentConfig: `oc create -n epics -f k8s/rabbitmq-deploymentconfig.yaml`
2. Create RabbitMQ vhost: `rabbitmqctl add_vhost katrinconsole && rabbitmqctl set_permissions -p katrinconsole katrinconsole '.*' '.*' '.*'`
3. `oc expose dc/rabbitmq`
4. Create ImageStream: `oc create -n epics is katrinconsole`
5. Create ImageStreamTag: `oc create -n epics istag katrinconsole:latest`
6. Create BuildConfig: `oc create -n epics bc k8s/katrinconsole-buildconfig.yaml`
7. Start Build: `oc start-build -n epics katrinconsole`
8. Wait the build to finish
9. Create DeploymentConfig: `oc create -n epics -f k8s/katrinconsole-deploymentconfig.yaml`
10. Rollout: `oc rollout -n epics latest dc/katrinconsole`
11. Create Service: `oc expose dc/katrinconsole`
12. Create Route: `oc expose svc/katrinconsole --hostname=katrin-console.kaas.kit.edu`
