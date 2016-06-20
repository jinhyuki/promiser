#!/bin/bash
if [ "$1" = "hello" ]; then
    echo "Action: Hello"
elif [ "$1" = "serve" ]; then
    (cd ../; sproutcore server --allow-from-ips='*.*.*.*')
elif [ "$1" = "build" ]; then
    (cd ../; sproutcore build --buildroot=./build --languages=en)
else
    echo "Usage:"
    echo "- serve: Serve"
    echo "- build: Build"
fi
