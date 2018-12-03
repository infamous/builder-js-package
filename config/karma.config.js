
const CWD = process.cwd()
const glob = require('globby')
const fs = require('fs')
const mkdirp = require('mkdirp')
const r = require('regexr')

const testFiles = glob.sync([
    CWD+'/src/**/*.test.js',
    CWD+'/tests/**/*.js',
])

const config = fs.existsSync(CWD+'/builder.config.js') ? require(CWD+'/builder.config.js') : {}

testFiles.forEach(file => {
    const relativeFile = file.replace(CWD, '')
    const relativePath = dirname(relativeFile)

    mkdirp.sync( CWD + '/.karma-test-build' + relativePath )

    const nodeModulesToCompile = config.nodeModulesToCompile

    fs.writeFileSync( CWD + '/.karma-test-build' + relativeFile, `
        require('@babel/register')({
            presets: [ ['@babel/preset-env', { targets: { node: 9 } }] ],
            sourceMap: 'inline',
            ${config.nodeModulesToCompile ? `
                ignore: [
                    // don't compile node_modules except for ones specified in the config
                    ${nodeModulesToCompile.map(moduleName => {
                        return r`/node_modules(?!\/${r.escape(moduleName)}\/)/`
                    })}
                ],
            ` : ''}
        })

        require( '${ file }' )
    ` )
})

module.exports = function(config) {

    config.set({

        frameworks: ['jasmine', 'stacktrace'],
        reporters: ['spec'],
        port: 9876,  // karma web server port
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        // singleRun: false,
        concurrency: Infinity,

        basePath: CWD,

        browsers: ['Electron'],
        files: [
            '.karma-test-build/**/*.js',
        ],
        preprocessors: {
            '.karma-test-build/**/*.js': ['electron'],
        },
        client: {
            // otherwise "require is not defined"
            useIframe: false,
            loadScriptsViaRequire: true,
        },

    })

}

function dirname(fullname) {
    if (typeof fullname !== 'string') throw new TypeError('expected a string')
    const parts = fullname.split('/')
    parts.pop()
    return parts.join('/')
}
