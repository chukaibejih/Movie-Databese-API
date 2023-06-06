# Movie Databese API (Work in Progress)

This project includes server-side code written in Node.js and Express.js, along with a MongoDB database for data storage. It follows a RESTful API architecture, allowing clients to interact with various endpoints to perform different operations.

## Features

- User Registration: Allow users to register an account.
- User Login: Enable users to authenticate and log into their accounts.
- Access Token Refresh: Provide a mechanism for refreshing access tokens.
- Movie Management: Implement CRUD operations for managing movies.
- Movie Search: Allow users to search for movies based on keywords.
- User Reviews: Enable users to post reviews for movies.

## Installation

1. Clone the repository.
2. Install dependencies by running the following command:
  ```
  npm install
  ```

## Usage

1. Configure the environment variables.
2. Start the application using the following command:
  ```
  npm run start
  ```

## Routes

- `/api/users/register`: Endpoint for user registration.
- `/api/users/login`: Endpoint for user login.
- `/api/users/refresh`: Endpoint to refresh access token.
- `/api/movies/`: Endpoint to get a list of all movies.
- `/api/movies/:movieId`: Endpoint to get details of a specific movie.
- `/api/movies/search`: Endpoint to search for movies based on a keyword.
- `/api/movies/:movieId/reviews`: Endpoint to get reviews for a specific movie.
- `/api/movies/:movieId/reviews`: Endpoint to post a review for a specific movie.
- `/api/movies/:movieId/reviews/:reviewId`: Endpoint to update a review for a specific movie.

## Contributing

1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Push your changes to your branch.
5. Submit a pull request.
