// Health check endpoint for API testing
export default function handler(req, res) {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: process.env.MONGODB_URI ? 'connected' : 'disconnected',
    version: '1.0.0'
  };

  try {
    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error.message
    });
  }
}
