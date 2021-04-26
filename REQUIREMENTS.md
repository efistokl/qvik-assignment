## Setting

The mobile app will allow users to browse news articles under different channels e.g. Science channel. News articles are sourced from external sources such as CNN. The backend will need to store the URL of the news article as well as the word count of the article.

## Task

Your task is to implement the backend service ("Application") for this app. The Application should expose a REST API that accepts and returns JSON. Implementation language/platform can be in: Node.js, Python or Golang.

## Requirements:
- Able to manage channels.
- Able to manage articles for a channel.
- When adding articles, only the URL is required. The Application will fetch the URL and calculate the word count (HTML tags stripped).
- Fetching the URLs and counting the words is to be done in the background after the article URL has been received.
- Can search articles within word count ranges e.g. 0-100, 100-500, 0-501.

## Technical requirements:
- All functionality should be implemented in one application.
- REST API that accepts and returns JSON.
- In memory database for persistence layer, e.g. SQLite.
- Usage and deployment instructions/scripts/etc. should be included.
- Application must be able to be run locally as a standalone application

## Desired

- Browsable API-UI

  Embedding a browsable API UI within the application is highly appreciated as a simple way for us to assess the application. Examples are Swagger UI, Redoc etc.
