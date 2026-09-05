# Static site served by nginx on Cloud Run.
# Cloud Run injects $PORT (8080 by default); the nginx image renders
# /etc/nginx/templates/*.template through envsubst at container start.
FROM nginx:1.27-alpine

# Only PORT is substituted, so nginx variables like $uri survive envsubst.
ENV NGINX_ENVSUBST_FILTER=^PORT$
ENV PORT=8080

COPY deploy/nginx.conf.template /etc/nginx/templates/default.conf.template

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY index.html style.css script.js sw.js site.webmanifest browserconfig.xml ./
COPY robots.txt sitemap.xml favicon.ico ./
COPY assets ./assets

EXPOSE 8080
