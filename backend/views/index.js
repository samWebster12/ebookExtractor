//Add event listener to search button
document.querySelector('#search-btn').addEventListener('click', async () => {
  try {
    //Change text to "loading" and set form data
    document.querySelector('#loading').innerText = 'loading';
    let loading = true;

    document.querySelector('#stream-data').innerHTML = '';
    const formData = { searchbox: document.querySelector('#searchbox').value };

    //Send request and init reader from response stream
    const response = await fetch('http://192.168.1.7:8080/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    const reader = response.body.getReader();

    //Check for incoming chunks
    while (true) {
      //Check whether stream is "done" or a "value" has been sent
      const { value, done } = await reader.read();
      if (done) {
        if (loading) {
          document.querySelector('#loading').innerText = '';
          loading = false;
        }
        break;
      }

      const link = processChunk(value);

      //Change HTML and insert new info

      const links = link.split('<-->');
      if (links[links.length - 1] === '') links.pop();
      console.log(links);
      links.forEach((link) => {
        let li = document.createElement('LI');
        let element = document.createElement('A');
        let text = document.createTextNode(link);
        element.appendChild(text);
        element.setAttribute('href', link);
        li.appendChild(element);
        document.querySelector('#stream-data').appendChild(li);
      });
    }
  } catch (error) {
    throw error;
  }
});

//Decode and process incoming chunks
function processChunk(chunk) {
  console.log(chunk);
  let result = new TextDecoder('utf-8').decode(chunk);
  return result;
}
