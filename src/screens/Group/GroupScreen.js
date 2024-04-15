import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import {
  ArrowRightImg,
  BackImg,
  CameraImg,
  CrossImg,
  Header,
  SearchImg,
} from './styles';
import {useNavigation} from '@react-navigation/native';
import {useEffect,  useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL, getToken, getUserId} from '../../utils';
import axios from 'axios';
import {
  getAllConversations,
  selectConversation,
} from '../../redux/conversationsSlice';
import {getContacts} from '../../redux/userSlice';
import {RadioButton} from 'react-native-paper';
import {newGroup} from '../../utils/socket';

export default function GroupScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const contacts = useSelector(state => state.userReducer.contacts);
  const [inputNameGroup, setInputNameGroup] = useState('');
  const [selectContacts, setSelectContacts] = useState([]);
  const [isClick, setIsClick] = useState(false);

  const handleSelectContacts = item => {
    if (selectContacts.includes(item)) {
      const update = selectContacts.filter(i => i !== item);
      setSelectContacts(update);
    } else {
      setSelectContacts([...selectContacts, item]);
    }
  };
  const handleNewGroup = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const dt = {
      adminId: userId,
      groupName: inputNameGroup,
      userIds: selectContacts,
    };
    try {
      const result = await axios.post(
        `${BASE_URL}/conversation/createGroup`,
        dt,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      if (result.status === 200) {
        await dispatch(getAllConversations(userId));
        await dispatch(selectConversation(result.data._id));
        newGroup(
          result.data,
          result.data.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        );
        navigation.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);
  const getAllContacts = async () => {
    const userId = await getUserId();
    try {
      await dispatch(getContacts(userId));
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(contacts);
  return (
    <View>
      <Header>
        <TouchableOpacity onPress={navigation.goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 20, color: 'white', marginLeft: 10}}>
            Nhóm mới
          </Text>
        </View>
      </Header>
      <View style={{height: 50, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity>
          <CameraImg
            source={require('../../images/icons8-camera-24.png')}></CameraImg>
        </TouchableOpacity>
        <TextInput
          style={{
            width: 250,
            height: 45,
            fontSize: 20,
            marginLeft: 10,
            marginTop: 10,
          }}
          placeholder="  Đặt tên nhóm"
          value={inputNameGroup}
          onChangeText={setInputNameGroup}></TextInput>
      </View>
      <View style={{height: 70, justifyContent: 'center'}}>
        <View
          style={{
            backgroundColor: '#E0E0E0',
            height: 50,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity>
            <SearchImg
              source={require('../../images/icons8-search-50.png')}></SearchImg>
          </TouchableOpacity>
          <TextInput
            style={{width: 250, height: 45, fontSize: 20, marginLeft: 10}}
            placeholder="Tìm số điện thoại"></TextInput>
        </View>
      </View>

      <View style={{height: 520}}>
        <FlatList
          data={contacts}
          renderItem={({item}) => {
            return (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    handleSelectContacts(item);
                    setIsClick(!isClick);
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      borderColor: 'gray',
                    }}>
                    <View
                      style={{
                        width: 290,
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: 10,
                      }}>
                      <Image
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 50,
                          // marginLeft: 5,
                          // marginBottom: 20,
                        }}
                        src={
                          item.avatar
                            ? item.avatar
                            : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
                        }
                      />
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          marginLeft: 10,
                        }}>
                        {item.name}
                      </Text>
                    </View>
                    <View style={{width: 50}}>
                      <RadioButton
                        value={`checkbox-${item._id}`}
                        status={
                          selectContacts.includes(item)
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() => {
                          if (selectContacts.includes(item)) {
                            setSelectContacts(
                              selectContacts.filter(
                                contact => contact !== item,
                              ),
                            );
                          } else {
                            setSelectContacts([...selectContacts, item]);
                          }
                        }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}></FlatList>

        <View
          style={{
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: 'gray',
            height: 60,
            alignItems: 'center',
          }}>
          {selectContacts?.map((item, index) => (
            <View
              style={{
                backgroundColor: '#DCDCDC',
                height: 50,
                width: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 10,
              }}>
              {/* <Image
                style={{
                  height: 40,
                  width: 40,
                  borderRadius: 50,
                  marginBottom: 5,
                }}
                src={
                  item.avatar
                    ? item.avatar
                    : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
                }
              /> */}
              {/* <Text>{item.name}</Text> */}
              <View style={{color: 'white', fontSize: 20, marginTop: -20, alignItems:'center', justifyContent:'center'}}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                  }}
                  src={
                    item.avatar
                      ? item.avatar
                      : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
                  }></Image>
              </View>
              <TouchableOpacity
                // style chạy trên máy thật
                style={{
                  height: 25,
                  width: 25,
                  borderRadius: 20,
                  backgroundColor: 'gray',
                  marginLeft: 40,
                  marginTop: -40,
                }}
                onPress={() => {
                  const update = selectContacts.filter(i => i !== item);
                  setSelectContacts(update);
                }}>
                {/* style này chạy trên máy ảo */}
                {/* <View style={{ height: 25, width: 25, borderRadius: 20, backgroundColor: 'gray', marginLeft: 40, marginTop: -50 }}> */}
                <View>
                  <CrossImg
                    source={require('../../images/icons8-cross-30.png')}></CrossImg>
                </View>
                {/* <Text> khong them</Text> */}
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            disabled={!inputNameGroup && selectContacts.length < 2}
            onPress={() => handleNewGroup()}
            style={{
              backgroundColor: '#3399ff',
              borderRadius: 25,
              height: 50,
              width: 50,
              justifyContent: 'center',
              marginLeft: 10,
            }}>
            {/* <Text style={{color: 'white', textAlign: 'center'}}>Tạo</Text> */}
            <ArrowRightImg
              source={require('../../images/icons8-arrow-right-50.png')}></ArrowRightImg>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
