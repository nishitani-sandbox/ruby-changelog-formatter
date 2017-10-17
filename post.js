import fs from 'fs';
import fetch from 'isomorphic-fetch';

const url = 'http://localhost:9200';
const contents = fs.readFileSync('./dist/ruby-core.json');

fetch(url, {
  method: 'POST',
  body: contents,
})
  .then(res => res.text())
  .then(text => console.log(text, typeof text))
  .catch(err => console.log(err));
