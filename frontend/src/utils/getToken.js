import code from '../code';
async function getToken(credentials) {
  return fetch('http://192.168.1.15:8080/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...credentials, code }),
  }).then((data) => data.json());
}

export default getToken;
