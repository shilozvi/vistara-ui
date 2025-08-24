const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');

const packageJson = require('./package.json');

module.exports = {
  input: 'lib.js',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx'],
      presets: [
        ['@babel/preset-react', { runtime: 'automatic' }], 
        ['@babel/preset-env', { 
          targets: { browsers: ['> 1%', 'last 2 versions'] }
        }]
      ],
      babelHelpers: 'bundled'
    }),
    resolve({
      browser: true,
      preferBuiltins: false,
      extensions: ['.js', '.jsx']
    }),
    commonjs(),
    postcss({
      extract: true,
      minimize: true
    }),
    terser()
  ],
  external: ['react', 'react-dom', 'lucide-react']
};