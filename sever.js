const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

const users = new Set();

io.on('connection', (socket) => {
    console.log('New user connected');
    socket.on('join', (userName) => {
        users.add(userName);
        socket.userName = userName;
        io.emit('user-joined', userName);
        io.emit('userList', Array.from(users));
    });

    socket.on('chatMessage', (message) => {
        io.emit('chatMessage', message);
    });

    socket.on('disconnect', () => {

        console.log('User disconnected');
        users.forEach(user => {
            if (user === socket.userName) {
                users.delete(user);
                io.emit('userLeft', user);
                io.emit('userList', Array.from(users));
            }
        });
    });
});

const PORT = 3000;
// Thay đổi từ app.listen sang server.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});