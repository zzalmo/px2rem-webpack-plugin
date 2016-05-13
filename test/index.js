import expect from 'expect'
import webpack from 'webpack'
import fs from 'fs'
import path from 'path'
import webpackConfig from './sample/webpack.config'
import px2remWebpackPlugin from '../dist'

const REGEX = /\/\*\*2w351r5q1rq2ekok\*\*\/([\s\S]*?)\/\*\*aiij34jri2rj24iji/
const distAppFile = path.resolve(__dirname, './sample/dist/app.js')

describe('compile ./sample with my plugin', () => {
  let cssSource

  before((done) => {
    webpack(webpackConfig, (err, stats) => {
      expect(err).toNotExist()
      const jsSource = fs.readFileSync(distAppFile, 'utf-8')
      cssSource = jsSource.match(REGEX)[1]
      done()
    })
  })

  it('should compile px to rem in normal rule', () => {
    expect(cssSource).toInclude('width: 6.4rem;')
  })

  it('should not compile border-* property', () => {
    expect(cssSource).toInclude('border-radius: 15px;')
  })

  it('should not compile px in MediaQuery condtion', () => {
    expect(cssSource).toInclude('@media (min-width: 480px)')
  })

  it('should compile px to rem in keyframe rule', () => {
    expect(cssSource).toInclude('top: 3.2rem;')
  })

  it('should not compile 0, which do not have unit', () => {
    expect(cssSource).toInclude('top: 0;')
  })

  it('should compile px to rem both under MediaQuery and keframe', () => {
    expect(cssSource).toMatch(/left:\s+1.3866666\d+rem;/)
  })

})

describe('compile ./sample with my plugin using option border', () => {

  let cssSource

  before((done) => {
    webpackConfig.plugins[1] = new px2remWebpackPlugin({
      originScreenWidth: 750, border: true
    })

    webpack(webpackConfig, (err, stats) => {
      expect(err).toNotExist()
      const jsSource = fs.readFileSync(distAppFile, 'utf-8')
      cssSource = jsSource.match(REGEX)[1]
      done()
    })
  })

  it('should compile border-* property with border option true', () => {
    expect(cssSource).toInclude('border-radius: 0.064rem;')
    expect(cssSource).toInclude('border: 0.128rem soild white;')
  })
})
