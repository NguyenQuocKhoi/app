import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, TextInput, Modal} from 'react-native';
import {
  AddFriendImg1,
  CrossImg,
  Header,
  PlusImg,
  QrImg,
  SearchImg,
} from './styles1';
import {useDispatch, useSelector} from 'react-redux';
import {initiateSocket, socket} from '../../utils/socket';
import {handleGetUsersOnline} from '../../redux/userSlice';
import {
  getAllConversations,
  handleNewConversation,
  selectConversation,
  setNotification,
} from '../../redux/conversationsSlice';
import {getUserId} from '../../utils';
import CardChat from '../Conservation/CardChat';
import {
  handleSetCurrentMessage,
  getCurrentMessage,
} from '../../redux/messageSlice';
import {ScrollView} from 'react-native';
function Home(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const allConversations = useSelector(
    state => state.conversationReducer.allConversation,
  );
  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  const dispatch = useDispatch();
  const onPressItem = option => {
    setModalVisible(false);
    if (option === 'Create group') {
      props.navigation.navigate('GroupScreen');
    } else if (option === 'Add friend') {
      props.navigation.navigate('Friend_timkiem');
    }
  };

  useEffect(() => {
    getInitiateSocket();
  }, []);

  const getInitiateSocket = async () => {
    const userId = await getUserId();
    if (userId) {
      initiateSocket(userId);
    }
  };

  useEffect(() => {
    console.log('socket', socket);
    if (!socket) return;
    socket.on('receiveMessage', res => {
      dispatch(handleSetCurrentMessage(res));
    });
    socket.on('usersOnline', res => {
      dispatch(handleGetUsersOnline(res));
    });
    socket.on('receiveNewConversation', res => {
      console.log(res);
      dispatch(handleNewConversation(res));
    });
    socket.on('receiveRemoveMessage', res => {
      dispatch(getCurrentMessage(res.conversationId));
    });
    socket.on('receiveUpdateGroup', res => {
      getConversations();
      dispatch(selectConversation(res.conversation));
      dispatch(setNotification(res.message))
    });
    socket.on('receiveNewGroup', res => {
      dispatch(handleNewConversation(res));
      
    });
    getConversations();
    // getAllContacts();
    return () => {
      socket.off('receiveMessage');
      socket.off('usersOnline');
      socket.off('receiveNewConversation');
      socket.off('receiveUpdateGroup');
      socket.off('receiveNewGroup');
    };
  }, [socket]);

  const getConversations = async () => {
    try {
      const userId = await getUserId();
      await dispatch(getAllConversations(userId));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{marginBottom: 50}}>
      <Header>
        <TouchableOpacity>
          <SearchImg
            source={require('../../images/icons8-search-50.png')}></SearchImg>
        </TouchableOpacity>
        <TextInput
          style={{
            // borderWidth: 0.5,
            borderRadius: 20,
            width: 200,
            height: 45,
            // borderColor: 'white',
            fontSize: 20,
            marginRight: 10,
          }}
          placeholderTextColor="white"
          placeholder="   Search"
          onPressIn={() =>
            props.navigation.navigate('Friend_timkiem')
          }></TextInput>

        <TouchableOpacity>
          <QrImg source={require('../../images/icons8-qr-24.png')}></QrImg>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.005)',
              alignItems: 'flex-end',
              justifyContent: 'flex-start',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                alignItems: 'flex-end',
                width: 130,
                marginTop: 10,
                marginRight: 10,
                borderRadius: 5,
              }}>
              <TouchableOpacity
                onPress={() => onPressItem('Add friend')}
                style={{flexDirection: 'row', margin: 10}}>
                <AddFriendImg1
                  source={require('../../images/icons8-add-friend-24.png')}></AddFriendImg1>
                <Text>Add friend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPressItem('Create group')}
                style={{flexDirection: 'row', margin: 10}}>
                <AddFriendImg1
                  source={require('../../images/icons8-group-24.png')}></AddFriendImg1>
                <Text>Create group</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{flexDirection: 'row', margin: 10}}>
                <CrossImg
                  source={require('../../images/icons8-cross-30.png')}></CrossImg>
                <Text style={{marginRight: 35}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <PlusImg
            source={require('../../images/icons8-plus-24.png')}></PlusImg>
        </TouchableOpacity>
      </Header>
      {allConversations !== null && allConversations.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {allConversations?.map((item, index) => (
            <CardChat key={index} data={item} />
          ))}
        </ScrollView>
      ) : (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={{marginTop: 200}}>
            <Text
              style={{
                fontSize: 50,
                color: '#3399ff',
                fontWeight: 'bold',
                alignSelf: 'center',
              }}>
              Chat App
            </Text>
            <Text style={{fontSize: 30, color: '#3399ff'}}>
              Make friends to text
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}
export default Home;
