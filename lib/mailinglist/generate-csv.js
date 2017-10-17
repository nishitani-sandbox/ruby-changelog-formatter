import fs from 'fs';
import path from 'path';
import moment from 'moment';
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
      console.log(`finish fetching *ALL* data on ${title}. The number of data is ${totalMailNum}✨🍻✨`);
      break;
    }
    // convert mail data to csv format
    const header = 'mailingList,author,body,timestamp\n';
    const formatedMails = mails.reduce((preMails, mail) => {
      const { mailingList, author, body, timestamp } = mail;
      const formatedBody = body.replace(/\n|,/g, '');
      return `${preMails}${mailingList},${author},${formatedBody},${timestamp}\n`;
    }, header);
    // write formated mail data to csv file
    const output = path.join(__dirname, `../../dist/mailinglist-${title}-${moment().format('YYYY-MM-DD')}.csv`);
    fs.appendFileSync(output, formatedMails);

    totalMailNum += mails.length;
    console.log(`finish fetching mail data on ${title} from ${from} to ${from + 100} ... 🍺.`);
  }
});
