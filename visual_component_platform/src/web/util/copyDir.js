/*
 * @Descripttion: 
 * @Author: zhangzhiyong
 * @Date: 2021-06-29 11:31:30
 * @LastEditors: zhangzhiyong
 * @LastEditTime: 2021-07-27 10:42:24
 */
const fs = require('fs')
const path = require('path')



function copyFile(from, to) {
  fs.copyFileSync(from, to)
}

module.exports =  function copyDir(from, to) {
  const fromPath = path.resolve(from);
  const toPath = path.resolve(to);
  if (!fs.existsSync(toPath)) {
    fs.mkdirSync(toPath)
  }
  const paths = fs.readdirSync(fromPath);
  paths.forEach(function (item) {
    const newFromPath = fromPath + '/' + item
    const newToPath = path.resolve(toPath + '/' + item)

    const stat = fs.statSync(newFromPath);
    if (stat) {
      if (stat.isFile()) {
        copyFile(newFromPath, newToPath)
      }
      if (stat.isDirectory()) {
        copyDir(newFromPath, newToPath)
      }
    }
  })
}
