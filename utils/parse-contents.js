import chalk from 'chalk';
import Table from 'cli-table';

/* eslint no-console: 0 */

export default (title, contents) => {
  console.log(chalk.yellow(title));

  const { years, authors, commitData } = contents;
  const yearsArray = Array.from(years).sort();

  const initialHeadData = [''];
  const head = initialHeadData.concat(yearsArray);

  const table = new Table({ head });

  const commitNumPerYear = years
    .reduce((prevData, year) => {
      const commitNumInYear = Object.keys(commitData[year])
        .reduce((prevNum, author) => {
          const commitNumOfAuthor = commitData[year][author];
          if (typeof commitNumOfAuthor === 'undefined' || commitNumOfAuthor === null) {
            return prevNum;
          }
          return prevNum + commitNumOfAuthor;
        }, 0);
      return Object.assign({}, prevData, {
        [year]: commitNumInYear,
      });
    }, {});

  authors
    .forEach((_, author) => {
      const commitNumArray = yearsArray
        .map((year) => {
          const commitNum = commitData[year][author];
          if (typeof commitNum === 'undefined') return 0;
          const totalCommitNum = commitNumPerYear[year];
          const commitRatio = Math.floor(((commitNum / totalCommitNum) * 10000)) / 100;
          return `${commitNum}(${commitRatio}%)`;
        });

      table.push({
        [author]: commitNumArray,
      });
    });

  console.log(table.toString());
};
