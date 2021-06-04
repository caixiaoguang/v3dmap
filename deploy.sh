#!/usr/bin/env sh

set -e

# 构建
npm run build


cd dist

ssh root@159.75.121.194 'rm -rf /usr/share/nginx/v3dmap/*'

scp -r * root@159.75.121.194:/usr/share/nginx/html/v3dmap

cd -