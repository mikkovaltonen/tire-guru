const config = {
  development: {
    enableLogging: true,
    firebaseCache: {
      sizeBytes: 50 * 1024 * 1024
    }
  },
  production: {
    enableLogging: false,
    firebaseCache: {
      sizeBytes: 100 * 1024 * 1024
    }
  }
};

export default config[process.env.NODE_ENV || 'development']; 