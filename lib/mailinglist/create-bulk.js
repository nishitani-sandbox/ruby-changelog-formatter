import fs from 'fs';
import path from 'path';
import titles from './config';

let index = 1;
titles.forEach((title) => {
  const input = path.join(__dirname, `../../dist/${title}`);
  const mails = require(input);

  console.log(`create bulk file of ${title} ... 🍺`);
  const bulk = mails.reduce((preBulk, mail) => {
    const action = {
      create: {
        _index: 'ruby-info',
        _type: 'mail',
        _id: index,
      },
    };
    index += 1;
    return `${preBulk}${JSON.stringify(action)}\n${JSON.stringify(mail)}\n`;
  }, '');

  const output = path.join(__dirname, `../../dist/${title}-bulk.json`);
  fs.writeFileSync(output, bulk);
  console.log(`finish creating bulk file of ${title} ... 🍺`);
});
