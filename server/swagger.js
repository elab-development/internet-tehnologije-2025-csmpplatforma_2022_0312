const swaggerJsdoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSMP API Dokumentacija',
      version: '1.0.0',
      description: 'Specifikacija ruta za CSMP platformu',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./index.js', './routes/*.js'], 
};

const specs = swaggerJsdoc(options);
module.exports = specs;