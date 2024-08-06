# Library-Application

# Book Borrowing System

## Introduction

This project is a system for managing book borrowing, including tracking currently borrowed books and historical borrowing records.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [MySQL](https://www.mysql.com/) on your machine.

## Environment Variables

An example environment file (`.env.example`) has been provided. You should create a `.env` file in the root directory of the project and fill it with your own configuration based on the example file.

## Setting Up the Project

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Set up the database:

    - Ensure your MySQL server is running.
    - You need to create a database called library.
    - Update your `.env` file with the database credentials.

4. Run the following command to create the tables and apply the migrations:

    ```bash
    npx prisma migrate dev --name init
    ```

## API Endpoints

The API endpoints are structured as follows:

- `POST /users` - Create a user ex: body:{name}. 
- `GET /users` - Get all users ex: body:{name}.
- `POST /books` - Create a book. 
- `GET /books` - Get all books.
- `POST /users/:userId/borrow/:bookId` - Borrow a book.
- `POST /users/:userId/return/:bookId` - Return a borrowed book with a score.
- `GET /books/:bookId` - Retrieve book details including the average score.
- `GET /users/:userId` - Retrieve user details including borrowed books (past and present).

Refer to the attached documentation for detailed information on each endpoint.

## Conclusion

Thank you for using the Library System. Have a great day!

