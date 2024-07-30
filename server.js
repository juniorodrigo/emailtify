require('dotenv').config();
const express = require('express');

const authnRouter = require('./source/modules/auth/routers/authnRouter');
const authzRouter = require('./source/modules/auth/routers/authzRouter');
const workspaceRouter = require('./source/modules/workspace/workspaceRouter');
const mailRouter = require('./source/modules/mail/routers/mailRouter')
const campaignRouter = require('./source/modules/campaign/campaignRouter');

const responseMiddleware = require('./source/common/middlewares/response');
const { connectMongo } = require('./source/database/connections/mongoConn');

// Definición de constantes de servicio
const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        // Conectar a MongoDB
        await connectMongo();

        // Inicializar la aplicación Express
        const app = express();

        // Middlewares
        app.use(express.json());
        app.use(responseMiddleware);

        // Rutas
        app.use('/authn', authnRouter);
        app.use('/authz', authzRouter);
        app.use('/workspace', workspaceRouter);
        app.use('/mail', mailRouter);
        app.use('/campaign', campaignRouter);

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`La aplicación está escuchando en el puerto ${PORT}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1); // Exit process with failure
    }
};

// Iniciar el servidor
startServer();
