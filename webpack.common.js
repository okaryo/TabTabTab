const path = require("path");

module.exports = {
  entry: {
    index: path.join(__dirname, "src/popup/index.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?/,
        use: "ts-loader"
      },
      {
        exclude: /node_modules/,
        test: /\.css/,
        use: [
          "style-loader",
          "css-loader"
        ]
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
