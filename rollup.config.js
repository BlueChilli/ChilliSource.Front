import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';
import buble from 'rollup-plugin-buble';
import sizes from 'rollup-plugin-sizes';

const rollupConfig =  {
  input: './src/index.js',
  output: {
    file: './lib/bundle.js',
    format: 'cjs',
  },
  external: [
    'react',
    'react-redux',
    'react-router',
    'react-router-config',
    'react-router-dom',
    'react-router-redux',
    'redux',
    'history',
    'lodash-es',
    'createBrowserHistory',
    'prop-types',
    'object.map',
    'createBrowserHistory'
  ],

  plugins: [
    resolve([
      {
        extensions: ['.jsx'],
      },
    ]),
    babel({
      exclude: '**/node_modules/**',
    }),
    commonjs({
      include: [
        'node_modules/**',
      ],
      exclude: [
        'node_modules/process-es6/**',
      ],
      globals: {
        react: 'React',
      },

    }),
    buble(),
    sizes(),
  ],

};


if (process.env.NODE_ENV === 'production') {
  rollupConfig.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
};

export default rollupConfig;
