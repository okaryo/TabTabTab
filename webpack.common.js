const path = require("path");

module.exports = {
  entry: {
    extension: path.join(__dirname, "src/view/extension/index.tsx"),
    setting: path.join(__dirname, "src/view/setting/index.tsx"),
    background: path.join(__dirname, "src/background/index.ts"),
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
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  }
};
