#!/bin/bash

CUR_DIR=`pwd`
WEB_DIR="$CUR_DIR/www/solution-platform-web"
WEB_APP="$CUR_DIR/webapp"
STATIC_DIR="$CUR_DIR/www/static/solution_platform_web"
WORKSPACE_DIR="$CUR_DIR/www/static/dev_visual_component/dev_workspace"

cd $WEB_DIR
npm install
npm run publish $WEB_APP "/static/solution_platform_web/"
cd $WEB_APP
rsync -a platform $STATIC_DIR
echo "静态文件已移至$STATIC_DIR"
cd $CUR_DIR
npm install
npm run dev
cd WORKSPACE_DIR
npm install > /dev/null