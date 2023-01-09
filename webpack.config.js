const path = require("path");
module.exports = {
  entry: "./app.ts",
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "build"),
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
