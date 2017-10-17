import fs from 'fs';
import path from 'path';
import fetch from 'isomorphic-fetch';
import titles from './config';

const url = 'http://localhost:9200/_bulk';
titles.forEach((title) => {
  const distPath = path.join(__dirname, '../../dist');
  const contents = fs.readFileSync(`${distPath}/ruby-${title}.json`);
  fetch(url, {
    method: 'POST',
    body: contents,
  })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log(err));
});
