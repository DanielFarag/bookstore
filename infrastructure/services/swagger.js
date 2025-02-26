import swaggerJsDoc from 'swagger-jsdoc';

const HOST=process.env.APP_HOST
const PORT=process.env.APP_PORT

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Book Store',
            version: '1.0.0',
            description: 'API documentation',
        },
        servers: [
            {
                url: `http://${HOST}:${PORT}`,
            },
        ],
    },
    apis: ['./routes/*.js'],
};

export default swaggerJsDoc(swaggerOptions);