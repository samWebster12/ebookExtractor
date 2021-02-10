import code from '../code';

async function getAuthData(token) {
  if (!token) {
    return false;
  }

  let response = await fetch('http://192.168.1.15:8080/api/authdata', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({ code }),
  });

  response = await response.json();

  if (response.error === '') {
    return {
      passed: true,
      userData: response.authData.user,
    };
  } else {
    return {
      passed: false,
      userData: null,
    };
  }
}

export default getAuthData;
