import io from 'socket.io-client';

BASE_URL = 'http://192.168.1.7:3300';
let socket;

const initiateSocket = userId => {
  socket = io(BASE_URL, {
    path: '',
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

const removeMessageSocket = receiverId => {
  if (socket) {
    socket.emit('removeMessage', receiverId);
  }
};

const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

const updateGroup = (conversation, receiverId, message) => {
  if (socket) {
    socket.emit('updateGroup', conversation, receiverId, message);
  }
};

const newGroup = (conversation, receiverId) => {
  if (socket) {
    socket.emit('newGroup', conversation, receiverId);
  }
};

export {
  socket,
  disconnectSocket,
  sendMessageSocket,
  initiateSocket,
  newConversationSocket,
  removeMessageSocket,
  newGroup,
  updateGroup,
};
