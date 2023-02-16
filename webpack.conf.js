
module.exports = {
	entry: './src/home.jsx',
	output: {
		path: __dirname + '/compiled/',
		filename: 'app.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
						],
						exclude: /node_modules/,
					},
				},
				
			},
			{
                test: /\.(css|sass|scss)/,
                use: [
					{
						loader:"style-loader"
					},
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            }
		],
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	}
};
