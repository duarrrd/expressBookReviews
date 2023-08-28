const express = require('express');
let books = require("./booksdb.js"); // Assuming you have a books database or data source
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const general = express.Router();
const axios = require('axios');


// Middleware to parse JSON request body
public_users.use(express.json());

// Registration endpoint
public_users.post("/register", (req, res) => {
    // Extract username and password from query parameters
    const { username, password } = req.query;
  
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if the username already exists
    if (users.hasOwnProperty(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }
  
    // If username is unique, add the user to the 'users' object (assuming 'users' is an object where usernames are keys)
    users[username] = { username, password };
  
    // You may want to hash and store the password securely in a real application
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Assuming that 'books' is an array of book objects
  const bookList = JSON.stringify(books, null, 2); // Pretty print with 2 spaces indentation
  return res.status(200).json({ books: JSON.parse(bookList) });
});
const booksApiUrl = 'https://api.example.com/books';

// GET the list of books available in the shop using Promise callbacks
general.get('/books-promise-callbacks', (req, res) => {
  // You can directly use the 'books' data from your local source
  const bookList = Object.values(books);
  return res.status(200).json({ books: bookList });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbnToSearch = req.params.isbn; // Retrieve ISBN from request parameters
  
    // Find the book with the matching ISBN in the 'books' object
    const book = Object.values(books).find((b) => b.isbn === isbnToSearch);
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});
  
// GET book details based on ISBN using Promise callbacks
general.get('/book-details-promise-callbacks/:isbn', (req, res) => {
    const isbnToSearch = req.params.isbn;
  
    // You can directly use the 'books' data from your local source
    const book = Object.values(books).find((b) => b.isbn === isbnToSearch);
  
    if (book) {
      return res.status(200).json({ book });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const authorToSearch = req.params.author; // Retrieve author from request parameters
    const matchingBooks = [];
    // Iterate through the books array
    for (const key in books) {
      if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book.author === authorToSearch) {
          matchingBooks.push(book);
        }
      }
    }
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found for the author" });
    }
});
  
// GET book details based on author using Promise callbacks
general.get('/book-details-by-author-promise-callbacks/:author', (req, res) => {
    const authorToSearch = req.params.author;
  
    // You can directly use the 'books' data from your local source
    const matchingBooks = Object.values(books).filter((book) => book.author === authorToSearch);
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found for the author" });
    }
  });
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
    const titleToSearch = req.params.title; // Retrieve title from request parameters
    const matchingBooks = [];
    // Iterate through the books array
    for (const key in books) {
      if (books.hasOwnProperty(key)) {
        const book = books[key];
        if (book.title === titleToSearch) {
          matchingBooks.push(book);
        }
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found with the title" });
    }
});
// GET book details based on title using Promise callbacks
general.get('/book-details-by-title-promise-callbacks/:title', (req, res) => {
    const titleToSearch = req.params.title;
  
    // You can directly use the 'books' data from your local source
    const matchingBooks = Object.values(books).filter((book) => book.title === titleToSearch);
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found with the title" });
    }
});
// Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbnToSearch = req.params.isbn; // Retrieve ISBN from request parameters
    //Find the book with the matching ISBN in the 'books' object
    const book = Object.values(books).find((b) => b.isbn === isbnToSearch);
    if (book) {
      const reviews = book.reviews;
      //Check if the book has reviews
      if (Object.keys(reviews).length > 0) {
        return res.status(200).json({ reviews });
      } else {
        return res.status(404).json({ message: "No reviews found for the book" });
      }
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
}); 
module.exports.general = public_users;
