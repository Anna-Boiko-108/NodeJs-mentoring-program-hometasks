import { createReadStream, createWriteStream } from 'node:fs';
import { resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import csvtojson from 'csvtojson';


const FILE_PATH = resolve(__dirname, './csv/nodejs-hw1-ex1');

const readFileStream = createReadStream(`${FILE_PATH}.csv`);
const fileConverter = csvtojson({ ignoreColumns: /Amount/ });
const writeFileStream = createWriteStream(`${FILE_PATH}.txt`);
const errorCallback = (err) => {
    if (err) {
        console.error('Pipeline failed.', err);
    }
}

async function run() {
    await pipeline(
        readFileStream,
        fileConverter,
        writeFileStream
    );

    console.log('Pipeline succeeded.');
  }
  
  run().catch(errorCallback);
