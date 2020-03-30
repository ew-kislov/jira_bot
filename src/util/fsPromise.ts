import fs from 'fs';

export function readJSON(fileName) {
    return new Promise((resolve, reject) => {
        fs.readFile(fileName, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
    });
}

export function writeFile(fileName, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fileName, data, (err) => err ? reject(err) : resolve(true));
    });
}
