const config = {
  nodeEnv: process.env['NODE_ENV'] ?? 'development',
  port: process.env['PORT'] ?? 4000,
  
  clientOrigins: {
      'development': process.env['DEV_ORIGIN'] ?? '*',
      'production': process.env['PROD_ORIGIN'] ?? 'none'
  }
}

export default config;

