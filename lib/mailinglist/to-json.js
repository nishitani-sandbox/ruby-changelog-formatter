import jsdom from 'jsdom';
import moment from 'moment';

export default (mailingList, text) =>
  new Promise((resolve, reject) => {
    jsdom.env(text, (err, window) => {
      if (err !== null) reject(err);
      const header = window.document.getElementById('header');

      if (header === null) {
        reject(new Error('File not found'));
      } else {
        try {
          const author = header.getElementsByTagName('strong')[2].textContent;
          const body = window.document.getElementsByTagName('pre')[0].textContent;
          const dateInfo = Array.from(header.childNodes)
            .filter(child => child.textContent.match(/^\nDate/))[0]
            .textContent
            .split(' ');
          const [time, day, month, year] = [dateInfo[5], dateInfo[2], dateInfo[3], dateInfo[4]];
          const checkedYear = year.length === 2 ? `19${year}` : year;
          const date = `${month} ${day} ${time} ${checkedYear}`;
          const timestamp = moment(date, 'MMM D HH:mm:ss YYYY').format('YYYY-MM-DD HH:mm:ss');

          resolve({
            mailingList,
            author,
            body,
            timestamp,
          });
        } catch (error) {
          reject(error);
        }
      }
    });
  });
