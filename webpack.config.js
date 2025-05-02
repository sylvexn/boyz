const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      // Provide polyfills for Node.js core modules used by dependencies
      "path": false,
      "fs": false,
      "util": false,
      // Add other Node.js built-ins as needed
      "crypto": false,
      "stream": false,
      "buffer": false,
      "os": false
    }
  }
}; 