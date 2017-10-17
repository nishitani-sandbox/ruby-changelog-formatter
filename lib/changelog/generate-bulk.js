import fs from 'fs';
import path from 'path';
import uuid from 'uuid';
import titles from './config';
import fetchCommits from './fetch-commits';

titles.forEach(async (title) => {
  console.log(`start to fetch commit data on ${title} ... 🍺`);

  // fetch commit data
  const { commits, error } = await fetchCommits(title);
  if (typeof error !== 'undefined' || commits.length === 0) return;
  // convert commit data to bulk that elasticsearch can read
  const bulk = commits.reduce((preBulk, commit) => {
    const action = {
      create: {
        _index: 'ruby-info',
        _type: 'commit',
        _id: uuid.v4(),
      },
    };
    return `${preBulk}${JSON.stringify(action)}\n${JSON.stringify(commit)}\n`;
  }, '');
  // write bulk to json file
  const output = path.join(__dirname, `../../dist/changelog-${title}.json`);
  fs.appendFileSync(output, bulk);

  console.log(`finish fetching *ALL* data on ${title} ✨ 🍻 ✨`);
});
