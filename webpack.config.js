const path = require("path");
module.exports = {
  entry: "./index.ts",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  target: "node",
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
        {
          test: /\.(ts|js)?$/,
          exclude: /node_modules/,
          use: "ts-loader"
        },
      ],
  }
};
