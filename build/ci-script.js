/**
 * @author luxueyan
 * @description for dev-wdy ci set ENV Values
 */

const path = require('path')
const glob = require('glob')
const fs = require('fs')
const chalk = require('chalk')

const files = glob.sync(path.posix.resolve(__dirname, '../config/**/*'))
let ENV = process.env
let envFile = path.posix.resolve(__dirname, '../../wdy-frontend.env.js')
if (fs.existsSync(envFile)) ENV = require(envFile)

files.forEach(f => {
  const stat = fs.lstatSync(f)
  if (stat.isFile()) {
    const data = fs.readFileSync(f, 'utf8')
    let matched = false
    const result = data.replace(/(\${tag-begin-(\w+)}\s+\2:\s['"]+)([^'",]+)(['",]+\s+\/{2}\${tag-end-\2})/g, function(match, g1, g2, g3, g4) {
      matched = true
      return `${g1}${ENV[g2] || g3}${g4}`
    })

    if (!matched) return
    fs.writeFile(f, result, 'utf8', function(err) {
      if (err) return console.log(chalk.red(err))
      console.log(f, chalk.green('ENV SET SUCESSS'))
    })
  }
})
