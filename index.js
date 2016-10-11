import path from 'path';
import {
  format,
  getContents,
  getFiles,
  parse,
} from './utils';

const start = async () => {
  const dirPath = path.join(__dirname, './changelog');
  const files = await getFiles(dirPath);
  files.forEach(async (fileName) => {
    const filePath = path.join(__dirname, `./changelog/${fileName}`);
    const contents = await getContents(filePath);
    const formatedContents = format(contents);
    parse(fileName, formatedContents);
  });
};

start().catch(err => console.log(err));
