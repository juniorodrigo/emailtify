// En este archivo se definen las funciones que interactúan con otros módulos.
// Se ponen acá porque para refactorizar, es más fácil cambiar una función que cambiar todas las rutas en los archivos que las usan.

const workspaceController = require('../../workspace/workspaceController');

const createWorkspace = async (creatorUserId, workspaceSettings) => {
    return await workspaceController.createWorkspaceFunction(creatorUserId, workspaceSettings);
}

module.exports = {
    createWorkspace
}