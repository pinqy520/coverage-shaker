#!/usr/bin/env node
if (require.main !== module) {
  throw new Error('Executable-only module should not be required');
}

import * as yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import minify from './shake'

const argv = yargs(hideBin(process.argv))
  .scriptName('coverage-shaker')
  .usage('Usage: $0 [file]')
  .option('file', {
    type: 'array',
    alias: 'f',
    describe: 'files you want to minify, sg: lottie_canvas.js'
  })
  .option('output', {
    type: 'string',
    alias: 'o',
    describe: 'output dir, eg: ./output'
  })
  .demandCommand(1, 'You need specify a coverage file first')
  .help()
  .argv

// console.log(argv)
// console.log(process.cwd())

const [source] = argv._
const { file = [], output = '' } = argv

const cwd = process.cwd()
const sourcePath = resolve(cwd, source as string)
const outputPath = resolve(cwd, output)

const sourceStr = readFileSync(sourcePath, { encoding: 'utf-8' })
const sourceData = JSON.parse(sourceStr)
const results = minify(sourceData, file as string[])

results.forEach(r => {
  const filename = r.url.replace(/[^\\\/]*[\\\/]+/g, '')
  const filepath = resolve(outputPath, filename)
  writeFileSync(filepath, r.code)
})