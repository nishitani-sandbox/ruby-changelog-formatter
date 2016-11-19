const generateCommitData = (year, author, oldData) => {
  if (typeof oldData[year] === 'undefined') {
    return Object.assign({}, oldData, {
      [year]: {
        [author]: 1,
      },
    });
  }
  return Object.assign({}, oldData, {
    [year]: Object.assign({}, oldData[year], {
      [author]: oldData[year][author] ? oldData[year][author] + 1 : 1,
    }),
  });
};

const trimTrailingWhiteSpace = author => (author.slice(-1) === ' ' ? author.substr(0, author.length - 1) : author);

export default (contents) => {
  /* eslint max-len: 0 */
  const pattern = /([a-zA-Z]{3})(\s)([a-zA-Z]{3})(\s+)([0-9]+)(\s)([0-9]+:[0-9]+:[0-9]+)(\s)([0-9]{4})(\s+)(.+)(\s+)([\(<]*.+[\)>]*)/;
  return contents
    .split('\n')
    .reduce((data, line) => {
      const result = line.match(pattern);
      if (result === null) return data;

      const [year, author] = [result[9], result[11]];
      const parsedYear = parseInt(year, 10);
      const checkedAuthor = trimTrailingWhiteSpace(author);

      const { years, authors, commitData: oldCommitData } = data;
      if (!years.has(parsedYear)) years.add(parsedYear);
      if (!authors.has(checkedAuthor)) authors.add(checkedAuthor);
      const newCommitData = generateCommitData(year, checkedAuthor, oldCommitData);

      return {
        years,
        authors,
        commitData: newCommitData,
      };
    }, {
      years: new Set(),
      authors: new Set(),
      commitData: {},
    });
};
