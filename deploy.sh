#!/usr/bin/env sh

set -e

# 构建

echo "\033[32m 开始构建。。。。。。。。。 \033[0m" 
npm run build

cd dist

ssh root@159.75.121.194 'rm -rf /usr/share/nginx/html/v3dmap/*'
echo "\033[32m 清空服务器旧文件完成。。。。。。。。。 \033[0m" 


echo "\033[32m 开始上传至服务器。。。。。。。。。 \033[0m" 
scp -r * root@159.75.121.194:/usr/share/nginx/html/v3dmap

echo "\033[32m 上传成功。。。。。。。。。 \033[0m" 


cd -