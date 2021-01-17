# Coverage Shaker

[![npm version](https://badge.fury.io/js/coverage-shaker.svg)](https://badge.fury.io/js/coverage-shaker)

```
$ npm install coverage-shaker -g
$ coverage-shaker
Usage: coverage-shaker [file]

选项：
      --version  显示版本号
  -f, --file     files you want to minify, sg: lottie_canvas.js
  -o, --output   output dir, eg: ./output
      --help     显示帮助信息        
```

## Command line

```
$ coverage-shaker example/coverage-puppeteer.json -f=lottie_canvas.js -o=example
```

## Library

```javascript
import minify from 'coverage-shaker'
import report from './report.json'

const result = minify(report, ['lottie_canvas.js'])

console.log(result[0].code)
// Write code to a javascript file
```