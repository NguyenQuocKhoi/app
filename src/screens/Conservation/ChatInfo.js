import {useState} from 'react';
import {
  Alert,
  Modal,
  PermissionsAndroid,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {Image, View} from 'react-native-animatable';

import {useDispatch, useSelector} from 'react-redux';
import {
  AddFriendImg1,
  BackImg,
  CrossImg,
  HeaderAddMember,
  IconCamera,
} from './styles';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL, getToken, getUserId} from '../../utils';
import axios from 'axios';
import {
  getAllConversations,
  selectConversation,
} from '../../redux/conversationsSlice';
import {updateGroup} from '../../utils/socket';
import {launchCamera} from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

export default function ChatInfo1() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedConversation = useSelector(
    state => state.conversationReducer.selectedConversation,
  );
  const recipient = useSelector(
    state => state.conversationReducer.userRecipient,
  );

  const getGroupName = () => {
    if (selectedConversation.isGroup) {
      return selectedConversation.name;
    }
  };

  const groupName = getGroupName();
  const [inputNameGroup, setInputNameGroup] = useState(groupName);
  const dispatch = useDispatch();

  const handleChangeGroupName = async () => {
    try {
      const dt = {
        conversationId: selectedConversation._id,
        name: inputNameGroup,
      };
      const token = await getToken();
      const userId = await getUserId();
      const result = await axios.put(
        `${BASE_URL}/conversation/changeGroupName`,
        dt,
        {
          headers: {
            'auth-token': `${token}`,
          },
        },
      );
      console.log(result.data);
      if (result.status === 200) {
        await dispatch(selectConversation(result.data));
        await dispatch(getAllConversations(userId));
        updateGroup(
          result.data,
          result.data.users
            .filter(user => user._id !== userId)
            .map(user => user._id),
        );
        Alert.alert('Success');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Fail');
    }
  };

  const handleChangeGroupImage = async () => {
    try {
      const userId = await getUserId();
      const token = await getToken();
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const images = await ImagePicker.openPicker({
          multiple: true,
          mediaType: 'photo',
          includeBase64: true, // Nếu bạn muốn gửi base64
        });

        if (images && images.length > 0) {
          const formData = new FormData();
          images.forEach((image, index) => {
            formData.append('file', {
              uri: image.path,
              type: image.mime,
              name: `image_${index}.jpg`,
            });
          });

          try {
            const result = await axios.put(
              `${BASE_URL}/conversation/changeGroupImage/${selectedConversation._id}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  'auth-token': token,
                },
              },
            );
            if (result.status === 200) {
              await dispatch(selectConversation(result.data));
              await dispatch(getAllConversations(userId));
              updateGroup(
                result.data,
                result.data.users
                  .filter(user => user._id !== userId)
                  .map(user => user._id),
              );
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          console.log('User cancelled the image picker');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  return (
    <View>
      <HeaderAddMember>
        <TouchableOpacity onPress={navigation.goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 20, color: 'white', marginLeft: 10}}>
            Tùy chọn
          </Text>
        </View>
      </HeaderAddMember>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 80,
            width: 80,
            borderRadius: 40,
            backgroundColor: '#E0E0E0',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            marginTop: 10,
          }}>
          <Image
            style={{
              height: 60,
              width: 60,
              resizeMode: 'contain',
              marginTop: 10,
            }}
            src={
              selectedConversation.isGroup
                ? selectedConversation.image || 'https://static.vecteezy.com/system/resources/previews/010/154/511/non_2x/people-icon-sign-symbol-design-free-png.png'
                : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
            }
          />
          <TouchableOpacity
            // onPress={()=>requestCameraPermission()}
            onPress={() => handleChangeGroupImage()}>
            <IconCamera
              source={require('../../images/icons8-camera-30.png')}></IconCamera>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '700',
            color: 'black',
          }}>
          {selectedConversation.isGroup
            ? selectedConversation.name
            : recipient?.name}
        </Text>

        {selectedConversation.isGroup ? (
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}>
            <View
              style={{
                height: 30,
                width: 30,
                marginLeft: 15,
                borderRadius: 20,
                backgroundColor: '#E0E0E0',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../images/icons8-edit-24.png')}
                style={{height: 24, width: 24}}
              />
            </View>
          </TouchableOpacity>
        ) : null}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',

              width: '90%',
              marginTop: 10,
              borderRadius: 5,
              height: 150,
            }}>
            <Text
              style={{
                fontSize: 20,
                marginTop: 20,
                color: 'black',
                fontWeight: 700,
                marginLeft: 10,
              }}>
              Change group name
            </Text>
            <View style={{borderTopWidth: 0.5, marginTop: 10}}>
              <TextInput
                style={{
                  fontSize: 15,
                  color: 'black',

                  marginLeft: 10,
                  width: '100%',
                }}
                value={inputNameGroup}
                onChangeText={setInputNameGroup}></TextInput>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    handleChangeGroupName();
                  }}
                  style={{
                    flexDirection: 'row',
                    margin: 10,
                    alignItems: 'center',
                  }}>
                  <AddFriendImg1
                    source={require('../../images/icons8-group-24.png')}></AddFriendImg1>
                  <Text style={{fontSize: 12}}>Update</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  flexDirection: 'row',
                  margin: 10,
                  alignItems: 'center',
                }}>
                <CrossImg
                  source={require('../../images/icons8-cross-30.png')}></CrossImg>
                <Text style={{marginRight: 35, fontSize: 12}}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View>
        <View
          style={{
            width: '100%',
            backgroundColor: '#E0E0E0',
            height: 10,
            marginTop: 10,
          }}></View>
        <View>
          {selectedConversation.isGroup ? (
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  margin: 15,
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../images/icons8-group-24.png')}
                  style={{
                    height: 30,
                    width: 30,
                    tintColor: 'gray',
                    marginLeft: 10,
                  }}></Image>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Members');
                  }}>
                  <Text style={{fontSize: 20, color: 'black', marginLeft: 10}}>
                    Xem thành viên
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddMember');
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../images/icons8-add-friend-24.png')}
                    style={{
                      height: 30,
                      width: 30,
                      tintColor: 'gray',
                      marginLeft: 25,
                    }}></Image>

                  <Text style={{fontSize: 20, color: 'black', marginLeft: 10}}>
                    Thêm thành viên
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
