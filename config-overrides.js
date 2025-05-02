const webpack = require('webpack');

module.exports = function override(config, env) {
  // Add fallback for Node.js core modules
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: false,
    fs: false,
    util: false,
    crypto: false,
    stream: false,
    buffer: false,
    os: false,
  };

  // Ignore SQLite-related modules
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^(better-sqlite3|sqlite3|bindings)$/,
    })
  );

  return config;
}; 