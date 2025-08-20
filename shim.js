// Add global File class for Node.js compatibility
if (typeof File === 'undefined') {
  global.File = class File {
    constructor() {
      throw new Error('File class is not available in this environment');
    }
  };
}

// Add other browser globals that might be missing
if (typeof window === 'undefined') {
  global.window = {};
  global.document = {};
}
