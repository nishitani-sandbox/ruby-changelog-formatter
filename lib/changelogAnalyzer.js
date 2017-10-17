import BaseAnalyzer from './baseAnalyzer';
import moment from 'moment';

export default class extends BaseAnalyzer {
  toJson(version, text) {
  /* eslint max-len: 0 */
  // this pattern does't fit to YARV
  const pattern = /([a-zA-Z]{3})(\s)([a-zA-Z]{3}\s+[0-9]+\s[0-9]+:[0-9]+:[0-9]+\s[0-9]{4})(\s+)(.+)(\s+)([(<]*.+[)>]*)/;
  return text
    .split('\n')
    .reduce((data, line) => {
      const result = line.match(pattern);
      if (result === null) return data;

      const [date, author] = [result[3], result[5]];
      const timestamp = moment(date, 'MMM D HH:mm:ss YYYY').format('YYYY-MM-DD HH:mm:ss');
      const checkedAuthor = trimTrailingWhiteSpace(author);

      return data.concat({
        version,
        timestamp,
        author: checkedAuthor,
      });
    }, []);
  }

  load() {

  }
}
