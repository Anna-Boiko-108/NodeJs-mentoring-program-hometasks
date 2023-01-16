const fs = require('node:fs');
const path = require('node:path');
const { pipeline } = require('node:stream');
const csvtojson = require('csvtojson');

const FILE_PATH = path.resolve(__dirname, './csv/nodejs-hw1-ex1');

const readFileStream = fs.createReadStream(`${FILE_PATH}.csv`);
const fileConverter = csvtojson({ ignoreColumns: /Amount/ });
const writeFileStream = fs.createWriteStream(`${FILE_PATH}.txt`);
const errorCallback = (err) => {
    if (err) {
        console.error('Pipeline failed.', err);
    } else {
        console.log('Pipeline succeeded.');
    }
}

pipeline(
    readFileStream,
    fileConverter,
    writeFileStream,
    errorCallback
);