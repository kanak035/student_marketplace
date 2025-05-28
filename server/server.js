const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/messages', require('./routes/messages')); 
app.use('/uploads', express.static('uploads'));
app.use(express.static('.'));

mongoose.connect('mongodb://localhost:27017/retail', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Backend running'));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  socket.on('sendMessage', async (message) => {
    try {
      const { sender, recipient, content } = message;
      const newMessage = new Message({ sender, recipient, content });
      await newMessage.save();
      io.to(recipient).emit('receiveMessage', newMessage);
      socket.emit('receiveMessage', newMessage);
    } catch (err) {
      console.log('Socket.io message error:', err.message);
    }
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));