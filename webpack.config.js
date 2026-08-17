const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const MiniCSSExtractPlugin = require("mini-css-extract-plugin");

// RtlCssPlugin is dropped as well: `output.path` is the plugin root, so it writes
// its `-rtl.css` beside the PHP files instead of into dist/, and nothing enqueues
// an RTL stylesheet (no `wp_style_add_data( ..., 'rtl', ... )` anywhere).
const plugins = defaultConfig.plugins.filter(
	(plugin) =>
		plugin.constructor.name != "MiniCssExtractPlugin" &&
		plugin.constructor.name != "CleanWebpackPlugin" &&
		plugin.constructor.name != "RtlCssPlugin"
);

let allEntries = {
	dist: "./src/index.js",
	"dist/frontend": "./src/frontend.js",
};

const config = {
	...defaultConfig,
	entry: allEntries,
	output: {
		path: path.resolve(__dirname),
		filename: "[name]/index.js",
	},
	plugins: [
		...plugins,
		new MiniCSSExtractPlugin({
			filename: "dist/style.css",
		}),
	],
};

module.exports = config;
