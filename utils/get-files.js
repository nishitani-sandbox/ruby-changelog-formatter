import fs from 'fs';

export default path =>
  new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => {
      if (err !== null && typeof err != 'undefined') {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
