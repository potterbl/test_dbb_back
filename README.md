<details>
  <summary>API Structure</summary>

  <table>
    <thead>
      <tr>
        <th>Route</th>
        <th>Description</th>
        <th>Methods</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>/authors/{id}/books</td>
        <td>Get books by author ID</td>
        <td>GET</td>
      </tr>
      <tr>
        <td>/authors</td>
        <td>Create a new author</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/books</td>
        <td>Create a new book</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/books/{id}/history</td>
        <td>Get borrowing history for a book</td>
        <td>GET</td>
      </tr>
      <tr>
        <td>/books/borrow</td>
        <td>Borrow a book</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/books/return</td>
        <td>Return a borrowed book</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/auth/sign</td>
        <td>Sign up a new user</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/auth/login</td>
        <td>Log in user</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/genres</td>
        <td>Create a new genre</td>
        <td>POST</td>
      </tr>
      <tr>
        <td>/publishers</td>
        <td>Create/Get a publisher</td>
        <td>POST/GET</td>
      </tr>
    </tbody>
  </table>

Additional Information:
- OpenAPI Version: 3.0.0
- Title: Advanced Library Management System API
- Version: 1.0
- Schemas:
  - AuthorDto
  - UserEntity
  - BookDto
  - UserDto
  - GenreDto
  - PublisherDto

</details>

### Prerequisites

Before you proceed, make sure you have the following prerequisites installed:

- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
- [PostgreSQL](https://www.postgresql.org/) installed and running.

### Configuration (.env file)

You need to provide configuration settings in a `.env` file. Below are the required environment variables and approximate filling:

```plaintext
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=potter
DB_PASSWORD=vladvador08
DB_NAME=test_dbb
JWT_KEY=key
BORROWING_LIMIT=10
```


## Schema Design and Relationship Management

### AuthorEntity
- **id**: Primary key auto-generated ID for each author.
- **name**: Name of the author.
- **birthday**: Birthday of the author.
- **books**: Many-to-many relationship with BookEntity.

### BookEntity
- **id**: Primary key auto-generated ID for each book.
- **title**: Title of the book.
- **isbn**: International Standard Book Number of the book.
- **authors**: Many-to-many relationship with AuthorEntity.
- **publisher**: Many-to-one relationship with PublisherEntity.
- **genres**: Many-to-many relationship with GenreEntity.
- **currentUser**: Many-to-one relationship with UserEntity representing the current user who has borrowed the book.
- **history**: JSON field storing the borrowing history of the book.
- **publishDate**: Publishing date of the book.

### GenreEntity
- **id**: Primary key auto-generated ID for each genre.
- **title**: Title of the genre.

### PublisherEntity
- **id**: Primary key auto-generated ID for each publisher.
- **title**: Title of the publisher.
- **establishedYear**: Year the publisher was established.
- **books**: One-to-many relationship with BookEntity representing the books published by the publisher.

### UserEntity
- **id**: Primary key auto-generated ID for each user.
- **books**: One-to-many relationship with BookEntity representing the books borrowed by the user.
- **role**: Role of the user (e.g., admin, user).
- **login**: Login username of the user.
- **password**: Encrypted password of the user.

## Installation and Setup

1. **Clone the repository:**

`git clone https://github.com/potterbl/test_dbb_back`


2. **Install dependencies:**

```

cd test_dbb_back

npm install

```

## Running the Project

1. **Start the server:**

`npm run start`

### * Also you can see web-documentation while server is running by url `localhost:3000/api`
