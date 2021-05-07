/* eslint-disable @typescript-eslint/no-var-requires */
const { parentPort, isMainThread } = require('worker_threads');
const axios = require('axios');
const { wordsCount } = require('words-count');

if (!isMainThread) {
  parentPort.on('message', (url) => {
    fetchUrlContent(url)
      .then((htmlContent) => {
        const wordCount = calculateWordCountHtml(htmlContent);
        handleWordCountCompleted(wordCount);
      })
      .catch((error) => {
        handleError(error);
      });
  });
}

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

async function fetchUrlContent(url) {
  return await axios({
    method: 'get',
    responseType: 'text',
    url,
  }).then((response) => {
    return response.data;
  });
}

function calculateWordCountHtml(htmlContent) {
  const body = getBodyInnerHtml(htmlContent);
  const bodyWithScriptsAndStylesRemoved = removeStyleTags(
    removeScriptTags(body),
  );
  const content = replaceHtmlTagsWithSpaces(bodyWithScriptsAndStylesRemoved);
  return calculateWordCount(content);
}

function calculateWordCount(content) {
  return wordsCount(content);
}

function getBodyInnerHtml(htmlContent) {
  return /<body.*?>([\s\S]*)<\/body>/.exec(htmlContent)[1];
}

function removeStyleTags(htmlContent) {
  return htmlContent.replace(
    /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
    '',
  );
}

// https://stackoverflow.com/a/6660315/5801858
function removeScriptTags(htmlContent) {
  return htmlContent.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    '',
  );
}

function replaceHtmlTagsWithSpaces(htmlContent) {
  return htmlContent.replace(/(<([^>]+)>)/gi, ' ');
}

module.exports = {
  calculateWordCountHtml,
  calculateWordCount,
  getBodyInnerHtml,
  removeStyleTags,
  removeScriptTags,
  replaceHtmlTagsWithSpaces,
};
