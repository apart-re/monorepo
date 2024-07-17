#!/bin/bash

# Default values for parameters
BUILD_CONTEXT=$PWD

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --build-context) BUILD_CONTEXT="$2"; shift ;;
        *) echo "Unknown parameter passed: $1"; exit 1 ;;
    esac
    shift
done

REGISTRY='ghcr.io'
OWNER='apart-re'
VERSION=$(node -p "require('./package.json').version")
IMAGE_NAME=$(node -p "require('./package.json').name.replace('@', '')")

docker build -f $PWD/Dockerfile -t $REGISTRY/$IMAGE_NAME:latest -t $REGISTRY/$IMAGE_NAME:$VERSION --target prod-server $BUILD_CONTEXT

echo $GITHUB_TOKEN | docker login $REGISTRY -u $OWNER --password-stdin

docker push $REGISTRY/$IMAGE_NAME:$VERSION 