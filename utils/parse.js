import chalk from 'chalk';
import Table from 'cli-table';

export default (title, contents) => {
  console.log(chalk.yellow(title));

  const { years, authors, commitData } = contents;
  const yearsAry = Array.from(years).sort();

  const empty = [''];
  const head = empty.concat(yearsAry);

  const table = new Table({ head });

  const commitsPerYear = Object.keys(commitData)
    .reduce((prevData, year) => {
      const yearCommits = Object.keys(commitData[year])
        .reduce((totalNum, author) => {
          if (typeof commitData[year][author] === 'undefined' || commitData[year][author] === null) {
            return totalNum;
          }
          return totalNum + commitData[year][author];
        }, 0);
      return Object.assign({}, prevData, {
        [year]: yearCommits,
      });
    }, {});

  authors
    .forEach((_, author) => {
      const commits = yearsAry
        .map((year) => {
          const commitNum = commitData[year][author];
          if (typeof commitNum === 'undefined') return 0;

          const totalCommits = commitsPerYear[year];
          const commitRatio = Math.floor(((commitNum / totalCommits) * 10000)) / 100;
          return `${commitNum}(${commitRatio}%)`;
        });

      table.push({
        [author]: commits,
      });
    });

  console.log(table.toString());
};
