import io from 'socket.io-client';

BASE_URL = 'http://192.168.1.16:3300';
let socket;

const initiateSocket = userId => {
  socket = io(BASE_URL, {
    path: "",
    transports: ['websocket'],
    query: {userId},
  });
};

const newConversationSocket = (conversation, message) => {
  if (socket) {
    socket.emit('newConversation', conversation, message);
  }
};

const sendMessageSocket = message => {
  if (socket) {
    socket.emit('sendMessage', message);
  }
};

const removeMessageSocket = (receiverId) => {
  if (socket) {
    socket.emit("removeMessage", receiverId);
  }
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};



export {
  socket,
  disconnectSocket,
  sendMessageSocket,
  initiateSocket,
  newConversationSocket,
  removeMessageSocket,
};
