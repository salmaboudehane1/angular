// server.ts
import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 5000;
const uri = 'mongodb://localhost:27017'; // Adjust if necessary
const client = new MongoClient(uri);

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1); // Exit the application if the connection fails
    }
}

// Define a function to get the database
const getDatabase = () => {
    return client.db('booksDB'); // Use your desired database name
};

// Routes
app.post('/api/books', async (req, res) => {
    const { title, author, numberOfPages, status, price, pagesRead, format, suggestedBy } = req.body;
    const finished = pagesRead === numberOfPages;

    const newBook = {
        title,
        author,
        numberOfPages,
        status,
        price,
        pagesRead,
        format,
        suggestedBy,
        finished,
    };

    try {
        const db = getDatabase();
        const result = await db.collection('books').insertOne(newBook); // Insert into 'books' collection

        // Retrieve the inserted book using the insertedId
        const insertedBook = await db.collection('books').findOne({ _id: result.insertedId });

        res.status(201).json(insertedBook); // Return the newly created book
    } catch (error) {
        console.error('Error inserting book:', error);
        res.status(500).json({ error: 'Failed to add book' });
    }
});


// Fetch all books
app.get('/api/books', async (req, res) => {
    try {
        const db = getDatabase();
        const books = await db.collection('books').find().toArray(); // Get all books
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// Start the server and connect to the database
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB(); // Connect to MongoDB after starting the server
});
