import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  Image,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {BASE_URL, getUserStorage} from '../../utils';
import {putApiWithToken} from '../../config/Axios';
import {Button, Input} from '../../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {
  Container,
  IconInfor,
  IconPhone,
  LogoutBtn,
  RadioBtn,
  TextInput,
  TextUserInfor,
  ViewRadioBtn,
  ViewUserInfor,
} from './styles';

function Profile_1(props) {

    const [user, setUser] = useState({});
    const [name, setName] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);
    const [checked, setChecked] = useState('');

   
    

  const handleUpdateInfo = async () => {
    const data = {
          name: user,
        };
    const user = useSelector(state => state.auth.login.currentUser);
        await axios
          .put(`${BASE_URL}/users/${user.user._id}`, data, {
            headers: {
              'auth-token': `${user.token}`,
            },
          })
      }

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    try {
      AsyncStorage.getItem('user').then(value => {
        if (value != null) {
          let user = JSON.parse(value);
          // console.log('user1',user.user);
          setUser(user.user);
          setChecked(user.user.gender);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };


  const handleLogOut = async ()=>{
    try {
      await AsyncStorage.removeItem('user');
      props.navigation.navigate('Login');
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Container>
    
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{marginVertical: 15}}>Profile</Text>
        <Image
          source={require('../../images/user.png')}
          style={{height: 100, width: 100, borderRadius: 50}}
        />
      </View>

      <ViewUserInfor>
        <View style={{flexDirection: 'row', marginBottom: 20}}>
          <IconInfor source={require('../../images/user.png')} />
          <TextUserInfor>
            <Text>Name</Text>
            <TextInput value={user.name} onChange={setName} editable={isUpdate} />
          </TextUserInfor>
        </View>
        <View style={{flexDirection: 'row'}}>
          <IconPhone source={require('../../images/icons8-phone-50.png')} />
          <TextUserInfor>
            <Text>Phone</Text>
            <TextInput value={user.phone} editable={isUpdate} />
          </TextUserInfor>
        </View>
      </ViewUserInfor>

      <ViewRadioBtn>
        <RadioBtn>
          <RadioButton
            value="male"
            status={checked === 'male' ? 'checked' : 'unchecked'}
            disabled={isUpdate ? "" : "disabled"}
            onPress={() => setChecked('male')}
          />
          <Text>Male</Text>
        </RadioBtn>

        <RadioBtn>
          <RadioButton
            value="female"
            status={checked === 'female' ? 'checked' : 'unchecked'}
            disabled={isUpdate ? "" : "disabled"}
            onPress={() => setChecked('female')}
          />
          <Text>Female</Text>
        </RadioBtn>
      </ViewRadioBtn>

      <View>
        {!isUpdate ? (
          <Button
            title="Update"
            style={{marginVertical: 15}}
            onPress={() => setIsUpdate(!isUpdate)}></Button>
        ) : (
          <View>
            <Button
              title="Update"
              style={{marginVertical: 15}}
              onPress={() => handleUpdateInfo()}></Button>
            <Button
              title="Cancel"
              style={{marginVertical: 15}}
              onPress={() => setIsUpdate(!isUpdate)}></Button>
          </View>
        )}
      </View>

      <View>
        <LogoutBtn onPress={() => handleLogOut()}>
          Logout
        </LogoutBtn>
      </View>
    </Container>
  );
}
export default Profile_1;
