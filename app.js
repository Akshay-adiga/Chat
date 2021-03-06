const express = require('express');
const app = express();
const compression = require('compression');
app.use(compression());
app.set("view engine", 'ejs');
app.use(express.static('public'));
const port = process.env.PORT || 8080;

app.get('/*', (req, res) => {
    res.render('index')
})

let server = app.listen(port)

const io = require('socket.io')(server)
io.on('connection', (socket) => {
    console.log("new user connected");
    socket.username = "Anonymous";
    socket.on('change_username', data => {
        socket.username = data.username;
    })
    socket.on('new_message', data => {
        io.sockets.emit('new_message', {message: data.message, username: socket.username})
    })
    socket.on('typing', data => {
        socket.broadcast.emit('typing', {username: socket.username})
    })
})