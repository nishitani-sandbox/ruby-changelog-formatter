import fs from 'fs';

export default path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err !== null && typeof err !== 'undefined') {
        reject(err);
        return;
      }
      resolve(data.toString());
    });
  });
