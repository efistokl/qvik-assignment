/* eslint-disable @typescript-eslint/no-var-requires */
const { parentPort } = require('worker_threads');
const axios = require('axios');

function handleWordCountCompleted(wordCount) {
  parentPort.postMessage({
    error: null,
    wordCount,
  });
}

function handleError(error) {
  parentPort.postMessage({
    error,
    wordCount: null,
  });
}

function calculateWordCount(htmlContent) {
  // TODO: implement html tags stripping
  // TODO: implement word counting
  return htmlContent.length;
}

async function fetchUrlContent(url) {
  return await axios({
    method: 'get',
    responseType: 'text',
    url,
  }).then((response) => {
    return response.data;
  });
}

parentPort.on('message', (url) => {
  fetchUrlContent(url)
    .then((content) => {
      const wordCount = calculateWordCount(content);
      handleWordCountCompleted(wordCount);
    })
    .catch((error) => {
      handleError(error);
    });
});
