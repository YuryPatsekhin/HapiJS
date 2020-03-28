
const api = {
  getData: (url) => fetch(url).then(data => data.json()),
  submitForm: (obj) => fetch('http://127.0.0.1:3000', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: obj,
  }).then(data => data.json()),
};

export { api };
