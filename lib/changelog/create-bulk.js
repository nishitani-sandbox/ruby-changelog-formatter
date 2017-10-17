import fs from 'fs';
import path from 'path';
import commits from '../../dist/changelog.json';

const bulk = commits.reduce((preBulk, commit, index) => {
  const action = {
    create: {
      _index: 'ruby-info',
      _type: 'commit',
      _id: index + 1,
    },
  };
  return `${preBulk}${JSON.stringify(action)}\n${JSON.stringify(commit)}\n`;
}, '');

const output = path.join(__dirname, '../../dist/changelog-bulk.json');
fs.writeFileSync(output, bulk);
