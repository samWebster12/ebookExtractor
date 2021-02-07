async function getToken(credentials) {
  return fetch('http://localhost:8080/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then((data) => data.json());
}

export default getToken;
