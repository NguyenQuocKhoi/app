import React, {useState, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {BASE_URL, getToken, getUserId} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  BtnUpdate,
  ChangePasswordBtn,
  Container,
  IconCamera,
  IconInfor,
  IconPhone,
  LogoutBtn,
  RadioBtn,
  TextBtnUpdate,
  TextInput,
  TextUserInfor,
  ViewRadioBtn,
  ViewUserInfor,
} from './styles';
import {launchCamera} from 'react-native-image-picker';

function Profile_1(props) {
  const [user, setUser] = useState({});
  const [inputName, setInputName] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [img, setImg] = useState('');
  const [urlImage, setUrlImage] = useState();
  const [inputGender, setInputGender] = useState();
  const [phone, setPhone] = useState('');

  const handleLogOut = async () => {
    try {
      await AsyncStorage.removeItem('user');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const result = await launchCamera({
          mediaType: 'photo',
          cameraType: 'back',
        });

        if (!result.cancelled) {
          console.log(result.assets[0].uri);
          setImg(result.assets[0].uri);
          await setUrlImage(result.assets[0].uri);
        } else {
          console.log('User cancelled the camera');
        }
      } else {
        console.log('Camera permission denied');
      }
    } catch (error) {
      console.log('Error requesting camera permission:', error);
    }
  };

  const handleUpdateInfo = async () => {
    const userId = await getUserId();
    const token = await getToken();
    const data = {
      name: inputName,
      gender: inputGender,
    };
    // console.log(data);
    try {
      const result = await axios.put(`${BASE_URL}/users/${userId}`, data, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      if (result.status === 200) {
        setUser(result.data); //
        console.log(result.data);
      }
    } catch (error) {
      console.log('err=', error);
    }
  };

  const handleUpdateAvatar = async () => {
    try {
      console.log('img', img);
      const userId = await getUserId();
      const token = await getToken();
      const formData = new FormData();
      formData.append('file', {
        uri: img,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      });
      const result = await axios.post(
        `${BASE_URL}/users/uploadAvatar/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'auth-token': token,
          },
        },
      );
      if (result.status === 200) {
        setUser(result.data);
        setIsUpdate(false);
        Alert.alert('Success');
      }
    } catch (error) {
      console.log('Error updating avatar:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const userId = await getUserId();
    const token = await getToken();
    try {
      const result = await axios.get(`${BASE_URL}/users/${userId}`, {
        headers: {
          'auth-token': `${token}`,
        },
      });
      if (result.status === 200) {
        setUser(result.data);
        setInputName(result.data.name);
        setInputGender(result.data.gender);
        setUrlImage(result.data?.avatar);
        setPhone(result.data.phone);
      }
    } catch (error) {}
  };

  return (
    <Container>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{marginVertical: 15}}>Profile</Text>
        <View style={{flexDirection: 'row'}}>
          <Image
            src={
              urlImage
                ? urlImage
                : 'https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'
            }
            style={{height: 100, width: 100, borderRadius: 50}}
          />
          <TouchableOpacity
            disabled={!isUpdate}
            onPress={() => requestCameraPermission()}>
            <IconCamera
              source={require('../../images/icons8-camera-30.png')}></IconCamera>
          </TouchableOpacity>
        </View>
      </View>

      <ViewUserInfor>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <IconInfor source={require('../../images/user.png')} />
          <TextUserInfor>
            <Text>Name</Text>
            <TextInput
              value={inputName}
              onChangeText={setInputName}
              editable={isUpdate}
              
            />
          </TextUserInfor>
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconPhone source={require('../../images/icons8-phone-50.png')} />
          <TextUserInfor>
            <Text>Phone</Text>
            <Text style={{fontSize: 20, color: 'black', marginTop: 5}}>
              {phone}
            </Text>
          </TextUserInfor>
        </View>
      </ViewUserInfor>

      <ViewRadioBtn>
        <RadioBtn>
          <RadioButton
            value="male"
            status={inputGender === 'male' ? 'checked' : 'unchecked'}
            disabled={isUpdate ? '' : 'disabled'}
            onPress={() => setInputGender('male')}
          />
          <Text>Male</Text>
        </RadioBtn>

        <RadioBtn>
          <RadioButton
            value="female"
            status={inputGender === 'female' ? 'checked' : 'unchecked'}
            disabled={isUpdate ? '' : 'disabled'}
            onPress={() => setInputGender('female')}
          />
          <Text>Female</Text>
        </RadioBtn>
      </ViewRadioBtn>

      <View>
        {!isUpdate ? (
          <BtnUpdate>
            <TouchableOpacity onPress={() => setIsUpdate(!isUpdate)}>
              <TextBtnUpdate>Update</TextBtnUpdate>
            </TouchableOpacity>
          </BtnUpdate>
        ) : (
          <View>
            <BtnUpdate>
              <TouchableOpacity onPress={() => handleUpdateInfo()}>
                <TextBtnUpdate>Update Info</TextBtnUpdate>
              </TouchableOpacity>
            </BtnUpdate>

            <BtnUpdate>
              <TouchableOpacity onPress={() => handleUpdateAvatar()}>
                <TextBtnUpdate>Update avatar</TextBtnUpdate>
              </TouchableOpacity>
            </BtnUpdate>

            <BtnUpdate>
              <TouchableOpacity onPress={() => setIsUpdate(!isUpdate)}>
                <TextBtnUpdate>Cancel</TextBtnUpdate>
              </TouchableOpacity>
            </BtnUpdate>
          </View>
        )}
      </View>

      <View>
        <LogoutBtn onPress={() => handleLogOut()}>Logout</LogoutBtn>
        <ChangePasswordBtn onPress={()=>{props.navigation.navigate('ChangePasswordScreen')}}>Change password</ChangePasswordBtn>
      </View>
    </Container>
  );
}
export default Profile_1;
