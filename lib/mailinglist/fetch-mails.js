import fetch from 'isomorphic-fetch';
import toJson from './to-json';

const fetchMail = async (title, url) =>
  await fetch(url)
      .then(res => res.text())
      .then(text => toJson(title, text))
      .then(mail => ({ mail }))
      .catch(error => ({ error }));

function* naturalNumsFrom(num) {
  let i = num;
  while (true) {
    if (i === num + 100) break;
    yield i += 1;
  }
}

export default async (title, from) => {
  const baseUrl = `http://blade.nagaokaut.ac.jp/cgi-bin/scat.rb/ruby/${title}`;
  const mails = [];
  for (const num of naturalNumsFrom(from)) {
    const { mail, error } = await fetchMail(title, `${baseUrl}/${num}`);
    if (typeof error === 'undefined') {
      mails.push(mail);
    }
  }
  return mails;
};
