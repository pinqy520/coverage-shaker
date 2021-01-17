# Coverage Shaker

```
$ npm install coverage-shaker -g
```


```
$ coverage-shaker coverage-report.json --filter=lottie_canvas.js --out=output
```


```javascript
import minify from 'coverage-shaker'
import report from './report.json'

const code = minify(report, ['lottie_canvas.js'])

// Write code to a javascript file
```