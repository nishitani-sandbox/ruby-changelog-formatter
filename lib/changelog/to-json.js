import moment from 'moment';

const trimTrailingWhiteSpace = author => (author.slice(-1) === ' ' ? author.substr(0, author.length - 1) : author);

export default (version, text) => {
  /* eslint max-len: 0 */
  // this pattern does't fit to YARV
  const headerPattern = (version === 'YARV')
    ? /([0-9]{4}-[0-9]{2}-[0-9]{2}\([a-zA-Z]{3}\)\s[0-9]{2}:[0-9]{2}:[0-9]{2})(\s\+[0-9]{4}\s+)(.+)(\s{2}<.+>)/
    : /([a-zA-Z]{3})(\s)([a-zA-Z]{3}\s+[0-9]+\s[0-9]+:[0-9]+:[0-9]+\s[0-9]{4})(\s+)(.+)(\s+)([(<]*.+[)>]*)/;
  // const bodyPattern = /\t(\*\s.+|(\s+)(.+))/;
  return text
    .split('\n')
    .reduce((data, line) => {
      const result = line.match(headerPattern);
      console.log(result);
      if (result === null) return data;

      const [date, author] = (version === 'YARV')
        ? [result[1], result[3]]
        : [result[3], result[5]];
      const preFormat = (version === 'YARV')
        ? 'YYYY-MM-DD(ddd) HH:mm:ss'
        : 'MMM D HH:mm:ss YYYY';
      const timestamp = moment(date, preFormat).format('YYYY-MM-DD HH:mm:ss');
      const checkedAuthor = trimTrailingWhiteSpace(author);

      return data.concat({
        version,
        timestamp,
        author: checkedAuthor,
      });
    }, []);
};
