import fs from 'fs';
import fetch from 'isomorphic-fetch';
import path from 'path';
import uuid from 'uuid';

export default class {
  constructor(baseUrl, titles) {
    this.baseUrl = baseUrl;
    this.titles = titles;
    this.fetchingUnit = 100;
  }

  /* eslint class-methods-use-this: 0 */
  toJson() {
    return { error: new Error('this should be inherited') };
  }

  load() {
    return { error: new Error('this should be inherited') };
  }

  async fetchData(url) {
    await fetch(url)
      .res(res => res.text())
      .then(text => this.toJson(text))
      .then(data => ({ data }))
      .catch(error => ({ error }));
  }

  * numsToFetchFrom() {
    let i = 0;
    /* eslint no-constant-condition: 0 */
    while (true) {
      yield i;
      i += this.fetchingUnit;
    }
  }

  generateBulkFile() {
    const { titles, index, type, fetchingUnit } = this;
    titles.forEach(async (title) => {
      let totalNum = 0;
      for (const num of this.numsToFetchFrom()) {
        /* eslint no-console: 0 */
        console.log(`start to fetch data on ${title} from ${num} to ${num + fetchingUnit} ... 🍺`);

        // fetch data
        const data = await this.load(title, num);
        if (data.length === 0) {
          console.log(`finish fetching *ALL* data on ${title}. The number of data is ${totalNum}✨🍻✨`);
          return;
        }
        // convert data to bulk that elasticsearch can read
        const bulk = data.reduce((preBulk, d) => {
          const action = {
            create: {
              _index: index,
              _type: type,
              _id: uuid.v4(),
            },
          };
          return `${preBulk}${JSON.stringify(action)}\n${JSON.stringify(d)}\n`;
        }, '');
        // write bulk to json file
        const output = path.join(__dirname, `../../dist/${type}-${title}.json`);
        fs.appendFileSync(output, bulk);

        totalNum += data.length;
        console.log(`finish fetching mail data on ${title} from ${num} to ${num + fetchingUnit} ... 🍺.`);
      }
    });
  }
}
