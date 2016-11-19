import chalk from 'chalk';
import Table from 'cli-table';

export default (title, contents) => {
  console.log(chalk.yellow(title));

  const { years, authors, commitData } = contents;
  const yearsAry = Array.from(years).sort();

  const empty = [''];
  const head = empty.concat(yearsAry);

  const table = new Table({ head });

  authors
    .forEach((_, author) => {
      const commits = yearsAry
        .map((year) => {
          const commitNum = commitData[year][author];
          if (typeof commitNum === 'undefined') return 0;
          return commitNum;
        });

      table.push({
        [author]: commits,
      });
    });

  console.log(table.toString());
};
