// src/server.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Book } from './Book';

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/booksDB', {
});

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    numberOfPages: Number,
    status: String,
    price: Number,
    pagesRead: Number,
    format: String,
    suggestedBy: String,
    finished: Boolean
});

const BookModel = mongoose.model('Book', bookSchema);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// API to add a new book
app.post('/api/books', async (req, res) => {
    const { title, author, numberOfPages, status, price, pagesRead, format, suggestedBy } = req.body;
    const book = new BookModel({ title, author, numberOfPages, status, price, pagesRead, format, suggestedBy, finished: pagesRead >= numberOfPages });
    await book.save();
    res.json(book);
});

// API to get all books
app.get('/api/books', async (req, res) => {
    const books = await BookModel.find();
    res.json(books);
});

// API to delete a book
app.delete('/api/books/:id', async (req, res) => {
    await BookModel.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
