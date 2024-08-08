const csv = require('csv-parser');
const stream = require('stream');

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

const uploadAndProcessCSV = async (req, res) => {
    try {
        if (!req.file) throw new Error('No se ha subido ningún archivo');

        const fileBuffer = req.file.buffer;
        const readStream = new stream.PassThrough();
        readStream.end(fileBuffer);

        const results = [];

        readStream.pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                console.log(results); // Aquí puedes manejar los datos como desees
                res.success('Archivo CSV procesado correctamente', results[0]);
            })
            .on('error', (error) => {
                throw new Error(error);
            });
    }
    catch (error) {
        console.log(error);
        res.error(error.message);
    }

}

module.exports = {
    findLeadsByFilter,
    uploadAndProcessCSV
}