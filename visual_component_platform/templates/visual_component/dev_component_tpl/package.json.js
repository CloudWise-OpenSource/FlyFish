module.exports = (component_mark) => `{
  "name": "${component_mark}",
  "version": "v1.0.0",
  "description": "",
  "dependencies": {},
  "devDependencies": {},
  "scripts": {
    "build-dev": "NODE_ENV=dev ../../node_modules/.bin/webpack --config ./build/webpack.config.dev.js",
    "build-production": "NODE_ENV=production ../../node_modules/.bin/webpack --config ./build/webpack.config.production.js"
  }
}
`
