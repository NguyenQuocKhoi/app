import React, { useEffect, useId, useState } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  TextInput,
  Modal,
  Button
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AddFriendImg, AddFriendImg1, CrossImg, Header, PlusImg, QrImg, SearchImg } from './styles1';
import Chat from '../Conservation/Chat';
import { useDispatch, useSelector } from 'react-redux';
import {
  disconnectSocket,
  getMessageSocket,
  getReceiveNewConverstionsoket,
  getUsersOnline,
  initiateSocket,
  socket,
} from '../../utils/socket';
import { getContacts, handleGetUsersOnline } from '../../redux/userSlice';
import {
  getAllConversations,
  handleNewConversation,
  selectConversation,
} from '../../redux/conversationsSlice';
import { getUserId } from '../../utils';
import CardChat from '../Conservation/CardChat';
import { handleSetCurrentMessage } from '../../redux/messageSlice';
import { ScrollView } from 'react-native';
import { ModalPicker } from '../../components/Modal/ModalPicker';
function Home(props) {
  const [userData, setUserData] = React.useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [notiAddMember, setNotiAddMember] = useState("");
  const allConversations = useSelector(
    state => state.conversationReducer.allConversation,
  );
  const dispatch = useDispatch();
  const onPressItem = (option) => {
    setModalVisible(false);
    if (option === 'Tạo nhóm') {
      props.navigation.navigate('GroupScreen');
    } else if (option === 'Thêm bạn') {
      props.navigation.navigate('Friend_timkiem');
    }
  };

  const handleNotiAddMember = (noti) => {
    setNotiAddMember(noti);
  };

  useEffect(() => {
    const getdata = async () => {
      const userId = await getUserId();
      // console.log(userId);
      if (userId) {
        initiateSocket(userId);
        handleUserOnline();
        handleGetMessageSocket();
        handleNewConverstionsocket();
      }
      return () => {
        disconnectSocket();
      };
    };
    getdata();
  }, []);

  const handleUserOnline = async () => {
    await getUsersOnline()
      .then(result => {
        dispatch(handleGetUsersOnline(result));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleNewConverstionsocket = async () => {
    await getReceiveNewConverstionsoket()
      .then(result => {
        dispatch(handleNewConversation(result));
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handleGetMessageSocket = async () => {
    await getMessageSocket()
      .then(result => {
        dispatch(handleSetCurrentMessage(result));
      })
      .catch(error => {
        console.log(error);
      });
  };

  useEffect(() => {
    getConversations();
    // getAllContacts();
  }, []);

  const getConversations = async () => {
    try {
      const userId = await getUserId();
      await dispatch(getAllConversations(userId));
    } catch (error) {
      console.log(error);
    }
  };
  
  // const getAllContacts = async () => {
  //   const userId = await getUserId();
  //   try {
  //     await dispatch(getContacts(userId));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <View style={{ marginBottom: 50 }}>
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
          placeholder="   Tìm kiếm"
          onPressIn={() =>
            props.navigation.navigate('Friend_timkiem')
          }></TextInput>

        <TouchableOpacity
        >
          <QrImg source={require('../../images/icons8-qr-24.png')}></QrImg>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.005)', alignItems: 'flex-end', justifyContent: 'flex-start'}}>
            <View style={{ backgroundColor: 'white', alignItems: 'flex-end', width: 110, marginTop: 10, marginRight: 10, borderRadius: 5}}>
            <TouchableOpacity
                onPress={() => onPressItem('Thêm bạn')}
                style={{flexDirection: 'row', margin: 10}}
              >
                <AddFriendImg1
                  source={require('../../images/icons8-add-friend-24.png')}></AddFriendImg1>
                <Text>Thêm bạn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onPressItem('Tạo nhóm')}
                style={{flexDirection: 'row', margin: 10}}
              >
                <AddFriendImg1
                  source={require('../../images/icons8-group-24.png')}></AddFriendImg1>
                <Text>Tạo nhóm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>setModalVisible(false)}
                style={{flexDirection: 'row', margin: 10}}
              >
                <CrossImg
                  source={require('../../images/icons8-cross-30.png')}></CrossImg>
                <Text style={{marginRight: 35}}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
        >
          <PlusImg
            source={require('../../images/icons8-plus-24.png')}></PlusImg>
        </TouchableOpacity>
      </Header>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        {allConversations?.map((item, index) => (
          <CardChat key={index} data={item} />
        ))}
      </ScrollView>

      <View>{/* <Chat/> */}</View>
    </View>
  );
}
export default Home;
