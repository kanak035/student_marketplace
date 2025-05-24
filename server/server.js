const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/retail", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.get('/', (req, res) => res.send('Backend running'));

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const User = require('./models/user.js');

// User.create({ name: "Kanak", email: "kanak@example.com" })
//   .then(() => console.log("User inserted"))
//   .catch((err) => console.log(err));

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));