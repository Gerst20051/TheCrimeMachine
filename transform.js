const csvtojson = require('csvtojson');
const fs = require('fs');

(async function () {
    const data = await csvtojson().fromFile('./data/safety.csv');
    const mapping = await csvtojson().fromFile('./data/mapping.csv');
    const lookupTable = mapping.reduce((output, item) => {
        output[item['NPA #']] = item['NSA Name'];
        return output;
    }, {});
    data.map(item => {
        Object.keys(item).forEach(key => {
            if (!item[key] || key.includes('_Rate_') || key.includes('_Violations_2')) {
                delete item[key];
            }
        });
        item['Name'] = lookupTable[item['NPA']] || `NPA ${item['NPA']}`;
        return item;
    });
    fs.writeFileSync('./public/data.json', JSON.stringify(data, null, 2));
})();
