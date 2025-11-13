const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/add', verifyToken, isAdmin, async (req, res) => {
    try {
        const { title, author, description } = req.body;
        if (!title) return res.status(400).json({ message: 'Title required' });
        const book = new Book({ title, author, description, createdBy: req.user.id });
        await book.save();
        res.status(201).json({ message: 'Book added', book });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const books = await Book.find().populate('createdBy', 'name email');
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
