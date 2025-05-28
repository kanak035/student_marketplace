const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  console.log('Send message body:', req.body);
  const { recipient, content } = req.body;
  try {
    if (!recipient || !content) {
      return res.status(400).json({ msg: 'Recipient and content are required' });
    }
    const message = new Message({
      sender: req.user,
      recipient,
      content,
    });
    await message.save();
    res.json(message);
  } catch (err) {
    console.log('Send message error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user },
      ],
    })
      .sort({ createdAt: 1 })
      .populate('sender', 'name email')
      .populate('recipient', 'name email');
    res.json(messages);
  } catch (err) {
    console.log('Get messages error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;