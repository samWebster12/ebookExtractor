const getProxies = require('get-free-https-proxy');

const proxyGenerator = async () => {
  const proxies = await getProxies();
  //Generate random number for random ip address
  const maxNumber = proxies.length - 1;
  const minNumber = 0;
  const randomNumber =
    Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

  let proxy = proxies[randomNumber];
  return proxy;
};

module.exports = proxyGenerator;
