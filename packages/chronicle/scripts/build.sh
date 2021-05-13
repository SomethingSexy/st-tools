#!/usr/bin/env bash
find ./modules/ -name "*.js" -exec bash -c 'mv "$1" "${1%.ts}".js' - '{}' \;