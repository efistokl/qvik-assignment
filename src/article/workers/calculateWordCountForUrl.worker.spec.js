/* eslint-disable @typescript-eslint/no-var-requires */
const {
  calculateWordCountHtml,
  calculateWordCount,
  getBodyInnerHtml,
  removeScriptTags,
  replaceHtmlTagsWithSpaces,
} = require('./calculateWordCountForUrl.worker');

describe('calculateWordCountForUrl worker', () => {
  test('getBodyInnerHtml', () => {
    const htmlContent = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Test Content</title>
        <meta name="description" content="Test Content">
        <meta name="author" content="SitePoint">
        <link rel="stylesheet" href="css/styles.css?v=1.0">
      </head>
      <body>
        <h1>Test Content here</h1>
        <p>Lorem ipsum</p>
        <script src="js/scripts.js"></script>
      </body>
      </html>
    `;

    const bodyContent = `
        <h1>Test Content here</h1>
        <p>Lorem ipsum</p>
        <script src="js/scripts.js"></script>
    `;

    expect(getBodyInnerHtml(htmlContent).trim()).toBe(bodyContent.trim());
  });

  test('removeScriptTags', () => {
    const input = `
      <h1>Test Content here</h1>
      <script>Some Content here</script>
      <p>Lorem ipsum</p>
      <script src="js/scripts.js"></script>
    `;

    const expectedResult = `
      <h1>Test Content here</h1>
      
      <p>Lorem ipsum</p>
      
    `;

    expect(removeScriptTags(input)).toBe(expectedResult);
  });

  test('replaceHtmlTagsWithSpaces', () => {
    const tests = [
      {
        html: `<div style="font-size: 10px">TestHtml</div>`,
        content: 'TestHtml',
      },
      {
        html: `
          <meta charset="utf-8">
          <meta name="description" content="Test Content">
          <meta name="author" content="SitePoint">
          <link rel="stylesheet" href="css/styles.css?v=1.0">
        `,
        content: '',
      },
      {
        html: `
          <h1>Test Content here</h1><p>Test</p>
          <script src="js/scripts.js"></script>
        `,
        content: 'Test Content here  Test',
      },
    ];

    tests.forEach((test) => {
      expect(replaceHtmlTagsWithSpaces(test.html).trim()).toBe(
        test.content.trim(),
      );
    });
  });

  test('calculateWordCount', () => {
    const text = `
      beginnings of poetry —
      the rice planting songs
      of the Interior
    `;
    expect(calculateWordCount(text)).toBe(10);
  });

  test('calculateWordCountHtml', () => {
    const htmlContent = `
      <!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>Test Content</title>
      </head>
      <body>
        <h1>Test Content here</h1>
        <p>Lorem ipsum</p>
        <script src="js/scripts.js"></script>
        <script>Words here!</script>
      </body>
      </html>
    `;

    expect(calculateWordCountHtml(htmlContent)).toBe(5);
  });
});
