const mongoose = require('mongoose');
const Campaign = require('./models/campaignModel');
const Schedule = require('./models/scheduleModel');

const getCampaignInfo = async (req, res) => {
    console.log("xd");
};

const createCampaign = async (req, res) => {
    try {
        const { name, workspaceId } = req.body;

        if (!name || !workspaceId) throw new Error('Missing required fields');

        const Workspace = mongoose.model('Workspace');
        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) throw new Error('Workspace not found');

        const newCampaign = new Campaign({
            name,
            workspace: workspaceId,
            basicSettings: {
                stopSendingOnReply: {
                    enabled: true,
                    stopOnAutoReply: true
                },
                openTracking: {
                    enabled: true,
                    linkTracking: false
                },
                deliveryOptimization: false,
                dailyLimit: 1000000
            },
            sendingPattern: {
                timeGapBetweenEmails: {
                    fixed: 7,
                    random: 0
                },
                maxNewLeads: 1000000,
                allowRiskyEmails: {
                    enabled: false,
                    disableBounceProtect: false
                }
            },
            ccAndBcc: {
                cc: [],
                bcc: []
            }
        });

        let campaign = await newCampaign.save();

        await Workspace.findByIdAndUpdate(workspaceId, { $push: { campaigns: campaign._id } });
        if (!campaign) throw new Error('Failed to create campaign');

        let result = await createScheduleFunction(campaign._id, 'Default Schedule');
        if (!result) throw new Error('Failed to create default schedule');

        campaign = await Campaign.findById(campaign._id).populate('schedules');

        res.success("Campaign created successfully", campaign);

        //TODO: Evaluar la respuesta que se dará cuando se confirme la creación de la campaña

    } catch (error) {
        console.log(error);
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
            select: 'email'
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
// TODO: añadir validaciones cuando no hay cambios
const updateBasicSettings = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const { update } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { basicSettings: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("Basic settings updated successfully", campaign.basicSettings);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const updateSendingPattern = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const { update } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { sendingPattern: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("Sending pattern updated successfully", campaign.sendingPattern);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const updateCcAndBcc = async (req, res) => {
    try {
        const { campaignId } = req.body;
        const { update } = req.body; // Solo la modificación específica

        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $set: { ccAndBcc: update } },
            { new: true }
        );
        if (!campaign) throw new Error('Campaign not found');

        res.success("CC and BCC settings updated successfully", campaign.ccAndBcc);
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const createSchedule = async (req, res) => {
    try {
        const { campaignId, name, timing = {} } = req.body;

        // Validar campaña
        const campaign = await Campaign.findById(campaignId);
        if (!campaign) {
            return res.error('Campaign not found');
        }

        // Crear el schedule
        const schedule = await createScheduleFunction(campaignId, name, timing);

        if (schedule) {
            return res.success("Schedule created successfully", schedule);
        } else {
            return res.error("Failed to create schedule");
        }
    } catch (error) {
        console.log(error);
        return res.error(error.message);
    }
};

const updateSchedule = async (req, res) => {
    try {
        const { scheduleId, updateData } = req.body;

        if (!scheduleId) throw new Error('Missing scheduleId');
        if (!updateData || (typeof updateData !== 'object' || Array.isArray(updateData))) throw new Error('Invalid update data');


        // Actualizar el schedule con los datos proporcionados
        const schedule = await Schedule.findByIdAndUpdate(
            scheduleId,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!schedule) throw new Error('Schedule not found');

        console.log('Updated schedule:', schedule);

        return res.success('Schedule updated successfully', schedule);
    } catch (error) {
        console.log('Error updating schedule:', error);
        return res.error(error.message);
    }
};

const createScheduleFunction = async (campaignId, name, timing = {}) => {
    if (!campaignId) {
        console.log('Missing campaignId');
        return null;
    }

    if (!name) {
        console.log('Missing required field name');
        return null;
    }

    try {
        // Crear el nuevo schedule
        const newSchedule = new Schedule({ name, timing });
        const schedule = await newSchedule.save();

        // Actualizar la campaña con el nuevo schedule
        const campaign = await Campaign.findByIdAndUpdate(
            campaignId,
            { $push: { schedules: schedule._id } },
            { new: true }
        );

        if (!campaign) {
            console.log('Campaign not found');
            return null;
        }

        console.log(campaign, "__________---")

        return schedule;
    } catch (error) {
        console.log('Error creating schedule:', error);
        return null;
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