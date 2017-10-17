import fetch from 'isomorphic-fetch';
import toJson from './to-json';

export default async (title) => {
  const url = `https://raw.githubusercontent.com/ruby/ruby/trunk/doc/ChangeLog-${title}`;
  return await fetch(url)
    .then(res => res.text())
    .then(text => ({ commits: toJson(title, text) }))
    .catch(error => ({ error }));
};
