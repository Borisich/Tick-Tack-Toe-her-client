var io = require('socket.io-client');
var socket = io('http://ttt-server.herokuapp.com');

module.exports = socket;
