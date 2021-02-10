async function getResults(bodyData, documentObj, setState, state) {
  try {
    //SEND REQUEST TO SERVER TO GET EBOOKS
    const token = localStorage.getItem('token');
    const response = await fetch('http://192.168.1.15:8080/api/ebooks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(bodyData),
    });

    const functionKey = state.searchKey;
    const reader = response.body.getReader();
    //Check for incoming chunks
    while (true) {
      //Check whether stream is "done" or a "value" has been sent
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const resource = processChunk(value);

      //Change HTML and insert new info

      //Split incoming traffic because two books might have come as one
      const resources = resource.split('<-->');
      //Cut of end if there is no there book there
      if (resources[resources.length - 1] === '') resources.pop();
      resources.forEach((resource) => {
        //split data and store it
        const resourceDataArr = resource.split('---');
        const resourceData = {
          link: resourceDataArr[0],
          fileFormat: resourceDataArr[1],
          source: resourceDataArr[2],
          title: resourceDataArr[3],
          author: resourceDataArr[4],
          pageCount: resourceDataArr[5],
          key: state.currentResultKey,
        };

        if (resourceData.pageCount === '-1') {
          resourceData.pageCount = 'UNKNOWN';
        }

        //Limit title letter count
        const maxLetterCount = Math.round(window.screen.width / 13);
        if (resourceData.title.length > maxLetterCount) {
          resourceData.title =
            resourceData.title.slice(0, maxLetterCount - 1) + '...';
        }

        //Set are results class and see-more button
        const resultsEle = documentObj.querySelector('#results');
        if (!resultsEle.classList.contains('are-results')) {
          resultsEle.classList.add('are-results');
          documentObj.querySelector('.see-more').style.display = 'block';
        }

        //MAKE
        if (state.searchKey != functionKey) {
          return;
        }

        //Set the state of the key and the new result
        setState((prevState) => {
          return {
            ...prevState,
            currentResultKey: prevState.currentResultKey + 1,
            results: [...prevState.results, resourceData],
          };
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export default getResults;

function processChunk(chunk) {
  let result = new TextDecoder('utf-8').decode(chunk);
  return result;
}
