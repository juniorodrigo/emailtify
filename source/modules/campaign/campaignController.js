const mongoose = require('mongoose');
const helpers = require('../../common/helpers/helper');
const Campaign = require('./models/campaignModel');
const { ObjectId } = mongoose.Types;

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
            workspace: workspaceId,
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

// TODO: Probar settings
const updateBasicSettings = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const update = req.body; // Solo la modificación específica

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { basicSettings: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("Basic settings updated successfully", campaign);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const updateSendingPattern = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const update = req.body; // Solo la modificación específica

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { sendingPattern: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("Sending pattern updated successfully", campaign);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const updateCcAndBcc = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const update = req.body; // Solo la modificación específica

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { ccAndBcc: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("CC and BCC settings updated successfully", campaign);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const createSchedule = async (req, res) => {
    try {
        const { campaignId } = req.params;
        const { name, timing } = req.body;

        if (!name || !timing) throw new Error('Missing required fields');

        const newSchedule = new Schedule({
            name,
            timing,
        });

        const schedule = await newSchedule.save();

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $push: { schedule: schedule._id } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("Schedule created successfully", { campaign, schedule });
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

module.exports = {
    getCampaignInfo,
    createCampaign,
    addMailAccountToCampaign,

    getCampaignMailAccounts,

    updateBasicSettings,
    updateSendingPattern,
    updateCcAndBcc,
    createSchedule
}