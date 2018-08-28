/** Libraries */
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						plugins: [
							// Stage 2
							['@babel/plugin-proposal-decorators', { legacy: true }],
							'@babel/plugin-proposal-function-sent',
							'@babel/plugin-proposal-export-namespace-from',
							'@babel/plugin-proposal-numeric-separator',
							'@babel/plugin-proposal-throw-expressions',

							// Stage 3
							'@babel/plugin-syntax-dynamic-import',
							'@babel/plugin-syntax-import-meta',
							['@babel/plugin-proposal-class-properties', { loose: false }],
							'@babel/plugin-proposal-json-strings',
						],
						presets: ['@babel/preset-env', '@babel/preset-react'],
						cacheDirectory: true,
					},
				},
			},
		],
	},
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};
