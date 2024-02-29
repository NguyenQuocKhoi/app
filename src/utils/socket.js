import {io} from 'socket.io-client';

BASE_URL = 'http://192.168.1.8:3300';
let socket;

const initiateSocket = userId => {
  socket = io(BASE_URL, {
    transports: ['websocket'],
    query: {userId},
  });
  return () => {
    socket.disconnect();
  };
};

// const initiateConversationsocket= (conversationId)=>{
//   socket = io(BASE_URL, {
//     transports: ["websocket"],
//     query: { conversationId },
//   });
//   return () => {
//     socket.disconnect();
//   };
// }
const newConversationSocket = (conversation, message) => {
  if (socket) {
    socket.emit('newConversation', conversation, message);
  }
};

const getReceiveNewConverstionsoket = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on('receiveNewConversation', res => {
        resolve(res);
      });
    } else {
      reject(new Error('Socket is not available.'));
    }
    return () => {
      socket.off('receiveNewConversation');
    };
  });
};

const getUsersOnline = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on("usersOnline", (res) => {
        resolve(res);
      });
    } else {
      reject(new Error('Socket is not available.'));
    }
  });
};

const sendMessageSocket = message => {
  if (socket) {
    socket.emit('sendMessage', message);
  }
};

const getMessageSocket = () => {
  return new Promise((resolve, reject) => {
    if (socket) {
      socket.on('receiveMessage', res => {
        resolve(res);
      });
    } else {
      reject(new Error('Socket is not available.'));
    }
    return () => {
      socket.off('receiveMessage');
    };
  });
};
const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
export {
  socket,
  disconnectSocket,
  getMessageSocket,
  sendMessageSocket,
  getUsersOnline,
  initiateSocket,
  // initiateConversationsocket,
  getReceiveNewConverstionsoket,
  newConversationSocket,
};
