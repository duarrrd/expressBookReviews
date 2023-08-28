const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

// Assuming you have a secret key for JWT
const secretKey = 'your-secret-key';

// Create an object to store book reviews, indexed by ISBN and username
const bookReviews = {};

const isValid = (username) => {
  // Write code to check if the username is valid (e.g., length constraints, character restrictions, etc.)
  // Return true if valid, false otherwise
}

const authenticatedUser = (username, password) => {
  // Write code to check if the provided username and password match the one we have in records.
  // Return true if authenticated, false otherwise
  // This function should be implemented according to your user authentication mechanism
}

// Login endpoint
regd_users.post("/login", (req, res) => {
  // Write your code here to authenticate the user
  // If authentication is successful, generate a JWT token
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username exists and the password matches
  if (authenticatedUser(username, password)) {
    // Generate a JWT token and send it as a response
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // You can also store the token in a cookie or local storage for the client to use in subsequent requests

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if a user is authenticated and get the username from the JWT token
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const decodedToken = jwt.verify(token, secretKey);
  const username = decodedToken.username;

  // Check if the book exists
  if (!books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for this ISBN
  if (bookReviews[isbn] && bookReviews[isbn][username]) {
    // Modify the existing review
    bookReviews[isbn][username] = review;
    return res.status(200).json({ message: "Review modified successfully" });
  } else {
    // Add a new review
    if (!bookReviews[isbn]) {
      bookReviews[isbn] = {};
    }
    bookReviews[isbn][username] = review;
    return res.status(201).json({ message: "Review added successfully" });
  }
});

// Delete a book review
regd_users.delete("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
  
    // Check if a user is authenticated and get the username from the JWT token
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const decodedToken = jwt.verify(token, secretKey);
    const username = decodedToken.username;
  
    // Check if the book exists
    if (!books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Check if the user has posted a review for this ISBN
    if (bookReviews[isbn] && bookReviews[isbn][username]) {
      // Delete the user's review
      delete bookReviews[isbn][username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
