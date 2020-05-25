#!/usr/bin/env bash

usage="
usage: deploy.sh [target]

targets:
  web       : deploy web
  server    : deploy server
  dispatch  : deploy dispatch
  all       : deploy all services
"

function prepare() {
  cd web
  yarn build
  cd ..
}

function deploy() {
  gcloud app deploy \
    "$@" \
    --configuration=bangdangi \
    --project=bangdangi-project
}

case "$1" in
  "web")
    prepare
    deploy "web/app.yaml"
  ;;
  "server")
    deploy "server/app.yaml"
  ;;
  "dispatch")
    deploy "dispatch.yaml"
  ;;
  "all")
    prepare
    deploy "web/app.yaml" \
      "server/app.yaml" \
      "dispatch.yaml"
  ;;
  *)
    echo "${usage}"
  ;;
esac