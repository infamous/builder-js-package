module.exports = {
    babelrc: false,
    plugins: [

        // this has to go before transform-es2015-classes.
        // makes super() calls to native constructors work properly. We
        // must explicitly specify the classes we extend.
        ['transform-builtin-classes', { globals: [ 'HTMLElement', 'Map' ] }],

        '@babel/plugin-proposal-export-namespace-from',
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-transform-classes',
        '@babel/plugin-transform-object-super',
        '@babel/plugin-proposal-object-rest-spread',
        'babel-plugin-array-includes',

        ['@babel/plugin-transform-runtime', {
            helpers: true,
            polyfill: true,
            // we don't need regenerator, we write Promises, or
            // transpile to Promises, and we're not currently using any
            // generator functions.
            regenerator: false,
        }],

        ['module:fast-async', {

            //// broken in Meteor, see https://github.com/MatAtBread/nodent/issues/102
            //compiler: {
            //    promises: false,
            //    noRuntime: false,
            //},
            //// similar to Babel transform-runtime to prevent duplication.
            //useRuntimeModule: true,

            // we'll use this for now until the above works in Meteor.  The
            // previous config leads to better performance I think.
            compiler: {
                promises: true,
                noRuntime: true,
            },
        }],

    ],
}
