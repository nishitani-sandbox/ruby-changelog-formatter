const add = (year, author, origin) => {
  if (typeof origin[year] === 'undefined') {
    return Object.assign({}, origin, {
      [year]: {
        [author]: 1,
      },
    });
  }
  return Object.assign({}, origin, {
    [year]: Object.assign({}, origin[year], {
      [author]: origin[year][author] ? origin[year][author] + 1 : 1,
    }),
  });
};

const check = author => (author.slice(-1) === ' ' ? author.substr(0, author.length - 1) : author);

export default (contents) => {
  /* eslint max-len: 0 */
  const pattern = /([a-zA-Z]{3})(\s)([a-zA-Z]{3})(\s+)([0-9]+)(\s)([0-9]+:[0-9]+:[0-9]+)(\s)([0-9]{4})(\s+)(.+)(\s+)([\(<]*.+[\)>]*)/;
  return contents
    .split('\n')
    .reduce((origin, line) => {
      const result = line.match(pattern);
      if (result === null) return origin;
      const [year, author] = [result[9], result[11]];
      const parsedYear = parseInt(year, 10);
      const checkedAuthor = check(author);
      const { years, authors, commitData } = origin;

      if (!years.has(parsedYear)) years.add(parsedYear);
      if (!authors.has(checkedAuthor)) authors.add(checkedAuthor);
      const newCommitData = add(year, checkedAuthor, commitData);

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
