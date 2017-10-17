import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import titles from './config';
import fetchMails from './fetch-mails';

function* fetchingUnit() {
  let i = 0;
  while (true) {
    yield i;
    i += 100;
  }
}

titles.forEach(async (title) => {
  let totalMailNum = 0;
  for (const from of fetchingUnit()) {
    console.log(`start to fetch mail data on ${title} from ${from} to ${from + 100} ... 🍺`);

    // fetch mail data
    const mails = await fetchMails(title, from);
    if (mails.length === 0) {
      console.log(`finish fetching ALL mail data on ${title}. The number of mail is ${totalMailNum}`);
      break;
    }
    // convert mail data to bulk that elasticsearch can read
    const bulk = mails.reduce((preBulk, mail) => {
      const action = {
        create: {
          _index: 'ruby-info',
          _type: 'mail',
          _id: uuid.v4(),
        },
      };
      return `${preBulk}${JSON.stringify(action)}\n${JSON.stringify(mail)}\n`;
    }, '');
    // write bulk to json file
    const output = path.join(__dirname, `../../dist/${title}.json`);
    fs.appendFileSync(output, bulk);

    totalMailNum += mails.length;
    console.log(`finish fetching mail data on ${title} from ${from} to ${from + 100} ... 🍺.`);
  }
});
