// TODO: el locations es un filtro complejo (city)
// añadir lógica de skip owned leads
const findLeadsByFilter = async (req, res) => {
    try {
        const { jobTitlesFilter, locationsFilter, industriesFilter, companyWebDomainsFilter, companySizesFilter } = req.body;

        const leads = await Lead.find({
            jobTitle: { $in: jobTitlesFilter },
        });

        if (!leads) {
            return res.error('No se encontraron leads con los filtros especificados');
        }
        res.success('Leads encontrados', leads);

    } catch (error) {
        console.log(error);
        res.error(error.message);
    }
}
module.exports = {
    findLeadsByFilter
}