import type { CoverageEntry } from "puppeteer-core";
import { transformSync } from "@babel/core";
import { minify } from 'uglify-js'

export function shake(coverage: CoverageEntry) {
  let cursor = 0
  const result = transformSync(coverage.text, {
    minified: true,
    comments: false,
    plugins: [{
      name: "coverage-shaker",
      visitor: {
        BlockStatement(path) {
          const { start, end } = path.node
          if (!start || !end) {
            // 异常情况不处理
            return
          }
          while (cursor < coverage.ranges.length) {
            const range = coverage.ranges[cursor]
            if (range.end <= start) {
              // 说明range还没跟上本代码片段的脚步
              // 需要看看下一个range是否有交叉了
              cursor++
              continue
            }
            if (range.start >= end) {
              // 说明代码已经执行到后面去了，本block没有执行过
              path.node.body = []
              // 函数里都没内容了，函数参数留着也没用了
              const parent: any = path.parent
              if (parent.params) {
                parent.params = []
              }
            }
            // 剩下的情况都说明中间的代码执行过了，不能删除
            return
          }
        },
      }
    }]
  })
  if (result && result.code) {
    // 不知道为啥要两次才能压缩干净
    return minify(minify(result.code).code).code
  }
  return ''
}

export interface ShakeResult {
  code: string,
  url: string,
}

export default function parse(coverages: CoverageEntry[], files: string[] = []) {
  const shaked_code: ShakeResult[] = [];
  const sources = files.length > 0 ? files : coverages.map(c => c.url)
  for (let coverage of coverages) {
    for (let file of sources) {
      if (coverage.url.endsWith(file)) {
        shaked_code.push({
          url: coverage.url,
          code: shake(coverage)
        });
      }
    }
  }
  return shaked_code;
}
