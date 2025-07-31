// OpenAPI spec
export const apiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'EVM Gas Prediction API',
      version: '1.0.0',
      description: 'API for predicting and tracking gas prices across EVM blockchains'
    },
    servers: [{ url: '/api' }],
    paths: {
      '/gas/current/{chain}': {
        get: {
          tags: ['Gas Prices'],
          summary: 'Get current gas prices',
          parameters: [{
            name: 'chain',
            in: 'path',
            required: true,
            schema: { type: 'string', enum: ['ethereum', 'polygon', 'bsc'] }
          }],
          responses: {
            200: {
              description: 'Current gas prices',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      chain: { type: 'string' },
                      safe: { type: 'number' },
                      standard: { type: 'number' },
                      fast: { type: 'number' },
                      timestamp: { type: 'string', format: 'date-time' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/gas/history/{chain}': {
        get: {
          tags: ['Gas Prices'],
          summary: 'Get historical gas data',
          parameters: [
            { name: 'chain', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'days', in: 'query', schema: { type: 'integer', default: 7 } }
          ],
          responses: {
            200: {
              description: 'Historical gas data',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        chain: { type: 'string' },
                        date: { type: 'string', format: 'date' },
                        avgGasPrice: { type: 'number' },
                        minGasPrice: { type: 'number' },
                        maxGasPrice: { type: 'number' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/gas/estimate': {
        get: {
          tags: ['Gas Prices'],
          summary: 'Estimate transaction cost',
          parameters: [
            { name: 'chain', in: 'query', schema: { type: 'string', default: 'ethereum' } },
            { name: 'gasLimit', in: 'query', required: true, schema: { type: 'integer' } },
            { name: 'gasPrice', in: 'query', schema: { type: 'integer' } }
          ],
          responses: {
            200: {
              description: 'Transaction cost estimate',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      estimatedCost: { type: 'number' },
                      currency: { type: 'string' },
                      gasPrice: { type: 'number' },
                      gasLimit: { type: 'number' },
                      chain: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/gas/chains': {
        get: {
          tags: ['Gas Prices'],
          summary: 'Get supported chains',
          responses: {
            200: {
              description: 'List of supported chains',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        name: { type: 'string' },
                        symbol: { type: 'string' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };
  