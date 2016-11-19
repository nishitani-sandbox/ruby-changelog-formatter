import path from 'path';
import {
  formatContents,
  getContents,
  getFiles,
  parseContents,
} from './utils';

/* eslint no-console: 0 */

const start = async () => {
  const dirPath = path.join(__dirname, './changelog');
  const files = await getFiles(dirPath);
  files.forEach(async (fileName) => {
    const filePath = path.join(__dirname, `./changelog/${fileName}`);
    const contents = await getContents(filePath);
    const formatedContents = formatContents(contents);
    parseContents(fileName, formatedContents);
  });
};

start().catch(err => console.log(err));
