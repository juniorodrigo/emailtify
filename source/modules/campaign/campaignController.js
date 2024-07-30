const mongoose = require('mongoose');
const helpers = require('../../common/helpers/helper');
const Campaign = require('./models/campaignModel');
const { ObjectId } = mongoose.Types;

const getAllCampaignsFromWorkspace = async (req, res) => {
    try {
        let { workspaceId } = req.params;
        workspaceId = new ObjectId(workspaceId);

        if (!workspaceId) throw new Error('Missing required fields');

        // acá me quedé

        const Workspace = mongoose.model('Workspace');

        console.log(workspaceId, "workspaceId");

        const campaigns = await Workspace.findById({ _id: workspaceId }).select('-_id campaigns');

        console.log(campaigns);

        res.success("Campaigns retrieved successfully", campaigns);

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

const getCampaignInfo = async (req, res) => { };

const createCampaign = async (req, res) => {
    try {

        const { name, workspace } = req.body;
        if (!name || !workspace) throw new Error('Missing required fields');

        const Workspace = mongoose.model('Workspace');
        if (!Workspace.findById(workspace)) throw new Error('Workspace not found');

        const newCampaign = new Campaign({
            name,
            workspace,
        });

        const campaign = await newCampaign.save();
        res.success("Campaign created successfully", campaign);

        //TODO: Evaluar la respuesta que se dará cuando se confirme la creación de la campaña

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

module.exports = {
    getAllCampaignsFromWorkspace,
    getCampaignInfo,
    createCampaign,
}