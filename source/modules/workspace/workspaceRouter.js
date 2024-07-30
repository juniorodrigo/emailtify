const router = require('express').Router();
const workspaceController = require('./workspaceController');

// Devuelve los datos generales del workspace, settings, campañas, correos, schedules, 
router.get('/:workspaceId', workspaceController.getWorkspaceDefaultValues);
router.get('/:workspaceUID/schedules', workspaceController.getWorkspaceSchedules);
router.get('/:workspaceUID/mail-accounts', workspaceController.getWorkspaceMailAccounts);
router.get('/:workspaceUID/settings/:level', workspaceController.getWorkspaceSettings);
// TODO: añadir más rutas para obtener datos de los workspaces

router.get('/:workspaceId/campaigns', workspaceController.getAllCampaignsFromWorkspace);
router.get('/:workspaceId/emails', workspaceController.getAllEmailsFromWorkspace);

module.exports = router;