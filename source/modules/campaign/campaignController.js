const mongoose = require('mongoose');
const helpers = require('../../common/helpers/helper');
const Campaign = require('./models/campaignModel');

const getCampaignDefaultValues = async (req, res) => { };

const createCampaign = async (req, res) => {
    try {

        const { name, workspace } = req.body;

        if (!name || !workspace) throw new Error('Missing required fields');
        // if ()

        const newCampaign = new Campaign({
            name,
            workspace,
        });

        const campaign = await newCampaign.save();
        res.success("Campaign created successfully", campaign);

    } catch (error) {
        console.log(error)
        return res.error(error.message);
    }
};

module.exports = {
    getCampaignDefaultValues,
    createCampaign,
}