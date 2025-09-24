// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",

  // Your files live under /src
  context: path.join(__dirname, "src"),

  // Your actual entry file is src/js/main.js
  entry: "./js/main.js",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "main.js",
    clean: true,
    assetModuleFilename: "assets/[name][ext]", // keep asset names/paths
  },

  devServer: {
    static: path.resolve(__dirname, "dist"),
    open: true,
    host: "localhost",
    watchFiles: ["src/**/*"], // rebuild when anything in src changes
  },

  module: {
    rules: [
      // Parse HTML so <img src="..."> and <source src="..."> are resolved
      {
        test: /\.html$/i,
        loader: "html-loader",
        options: {
          sources: {
            list: [
              "...", // default rules
              { tag: "source", attribute: "src", type: "src" }, // for <video><source>
            ],
          },
        },
      },

      // SCSS pipeline (you already have main.scss)
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },

      // Static assets — include jpeg and mp4
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|eot|ttf|woff2?)$/i,
        type: "asset/resource",
        generator: { filename: "assets/[name][ext]" },
      },

      // (Optional) Babel for JS if you need it
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },

  plugins: [
    // Use your src/index.html as the template
    new HtmlWebpackPlugin({
      template: "index.html",
      filename: "index.html",
      inject: "body",
    }),
  ],

  resolve: {
    extensions: [".js", ".jsx"],
  },
};
