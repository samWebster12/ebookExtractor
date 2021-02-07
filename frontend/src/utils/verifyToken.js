async function verifyToken(token) {
  if (!token) return false;
  let response = await fetch('http://localhost:8080/api/verify', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  response = await response.json();

  if (response.passed === 'true') {
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

export default verifyToken;
