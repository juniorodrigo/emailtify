
const mongoose = require('mongoose');
const Workspace = require('./models/workspaceModel');
const WorkspaceMemberRole = require('./models/workspaceMemberRoleModel');
const helpers = require('../../common/helpers/helper');


const getWorkspaceDefaultValues = async (req, res) => {


    console.log("AJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    // Code for workspaceQuery
    const { workspaceUID } = req.params;

    const workspace = await Workspace.findOne({ UID: workspaceUID })
        .select('name UID owner campaigns plan mailAccounts');

    if (!workspace) {
        return res.error('Workspace not found', 404);
    }

    res.success('Workspace found', workspace.toJSON());
    console.log(workspace, "KAAAAAAAAAAAAAAAAAAAA");

};

const getWorkspaceSchedules = async (req, res) => {
    const { workspaceUID } = req.params;
}

const getWorkspaceMailAccounts = async (req, res) => {
    const { workspaceUID } = req.params;
}

const getWorkspaceSettings = async (req, res) => {
    const { workspaceUID } = req.params;
}

// CRUD
const createWorkspaceFunction = async (creatorUserId, workspaceData) => {
    try {
        const { name, planId, settings } = workspaceData;

        // Validaciones
        if (!creatorUserId || !name || !planId) throw new Error('Missing required fields');
        if (!mongoose.Types.ObjectId.isValid(creatorUserId) || !mongoose.Types.ObjectId.isValid(planId)) throw new Error('Invalid ID format');

        const User = mongoose.model('User');
        const Plan = mongoose.model('Plan');

        // Esto valida que el usuario creador (owner) exista en los registros de mongo
        const owner = await User.findById(creatorUserId);
        if (!owner) throw new Error('Owner not found');

        console.log("PlanID type:" + typeof planId);
        const plan = await Plan.findById(planId);
        if (!plan) throw new Error('Plan not found');

        const { _id: roleId } = await WorkspaceMemberRole.findOne({ name: 'admin' }, '_id');
        if (!roleId) throw new Error('Role not found');

        const members = [{
            userId: creatorUserId,
            role: roleId,
        }];

        // Creación del objeto de workspace
        const newWorkspace = new Workspace({
            name,
            owner: creatorUserId,
            members,
            plan: planId,
            settings: settings || {},
            createdAt: Date.now(),
            modifiedAt: Date.now(),
            createdBy: creatorUserId,
            modifiedBy: creatorUserId
        });

        // Guardar el nuevo workspace en la base de datos
        await newWorkspace.save();

        return newWorkspace;
    } catch (error) {
        console.error(error);
        return false;
    }
};


module.exports = {
    getWorkspaceDefaultValues,
    getWorkspaceSchedules,
    getWorkspaceMailAccounts,
    getWorkspaceSettings,

    createWorkspaceFunction
};