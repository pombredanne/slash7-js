#!/bin/bash
# This script requires proper set up of s3cmd.

set -e
./grunt
s3cmd put -P dist/slash7{,.min}.js s3://slash-7-cdn/v1/
