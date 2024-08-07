require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authnRouter = require('./source/modules/auth/routers/authnRouter');
const authzRouter = require('./source/modules/auth/routers/authzRouter');
const workspaceRouter = require('./source/modules/workspace/workspaceRouter');
const mailRouter = require('./source/modules/mail/routers/mailRouter')
const campaignRouter = require('./source/modules/campaign/campaignRouter');
const leadRouter = require('./source/modules/lead/leadRouter');

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
        app.use(cors());

        // TODO: Todas las rutas deben validarse con token y con dato dentro del token para saber si tiene permisos sobre el recurso
        // Rutas
        app.use('/authn', authnRouter);
        app.use('/authz', authzRouter);
        app.use('/workspace', workspaceRouter);
        app.use('/mail', mailRouter);
        app.use('/campaign', campaignRouter);
        app.use('/lead', leadRouter);

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
