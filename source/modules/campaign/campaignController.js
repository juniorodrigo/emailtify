const mongoose = require('mongoose');
const helpers = require('../../common/helpers/helper');
const Campaign = require('./models/campaignModel');
const { ObjectId } = mongoose.Types;

const getAllCampaignsFromWorkspace = async (req, res) => {
    try {
        let { workspaceId } = req.params;
        workspaceId = new ObjectId(workspaceId);

        if (!workspaceId) throw new Error('Missing required fields');

        const Workspace = mongoose.model('Workspace');

        const campaigns = await Workspace.findById({ _id: workspaceId })
            .select('-_id campaigns')
            .populate({
                path: 'campaigns',
                select: 'name status progress sent click replied opportunities'  // Selecciona solo los campos que necesitas
            });

        console.log(campaigns);

        res.success("Campaigns retrieved", campaigns);

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

const getCampaignInfo = async (req, res) => {
    console.log("xd");
};

const createCampaign = async (req, res) => {
    try {

        const { name, workspaceId } = req.body;
        if (!name || !workspaceId) throw new Error('Missing required fields');

        const Workspace = mongoose.model('Workspace');
        if (!Workspace.findById(workspaceId)) throw new Error('Workspace not found');

        const newCampaign = new Campaign({
            name,
            workspace,
        });

        const campaign = await newCampaign.save();

        const updateCampaignsInWorkspace = await Workspace.findByIdAndUpdate(workspaceId, { $push: { campaigns: campaign._id } });
        res.success("Campaign created successfully", campaign);

        //TODO: Evaluar la respuesta que se dará cuando se confirme la creación de la campaña

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

const addMailAccountToCampaign = async (req, res) => {
    try {
        const { campaignId, mailAccountId } = req.body;
        if (!campaignId || !mailAccountId) throw new Error('Missing required fields');

        const MailAccount = mongoose.model('MailAccount');


        const campaign = await Campaign.findById(campaignId);
        if (!campaign) throw new Error('Campaign not found');

        // TODO: Validar que no se ingrese un mismo mail account a una misma campaña
        if (campaign.mailAccounts.includes(mailAccountId)) throw new Error('Mail account already added to campaign');

        const account = await MailAccount.findById(mailAccountId);
        if (!account) throw new Error('Mail account not found');

        const updatedCampaign = await Campaign.findByIdAndUpdate(campaignId, { $push: { mailAccounts: mailAccountId } });

        console.log(updatedCampaign, '__________________________________________________');

        res.success("Mail account added to campaign", updatedCampaign);

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

const getCampaignMailAccounts = async (req, res) => {
    try {
        const { campaignId } = req.params;
        if (!campaignId) throw new Error('Missing required fields');

        const campaign = await Campaign.findById(campaignId).select(' -_id mailAccounts').populate({
            path: 'mailAccounts',
            select: 'email'  // Selecciona solo los campos que necesitas
        });

        console.log(campaign)

        if (!campaign) throw new Error('Campaign not found');

        res.success("Mail accounts retrieved", campaign);

    }
    catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

module.exports = {
    getAllCampaignsFromWorkspace,
    getCampaignInfo,
    createCampaign,
    addMailAccountToCampaign,

    getCampaignMailAccounts
}