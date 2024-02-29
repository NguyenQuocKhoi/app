import React, {useState, useEffect} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {Header, SearchImg, AddFriendImg, TextI, BackImg, SearchImg1, QrImg} from './styles';
import {Button, Input} from '../../components';
import {BASE_URL, checkPhoneValid} from '../../utils';
import {useSelector} from 'react-redux';
import axios from 'axios';
import CardUser from './CardUserSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
function Friend_timkiem() {
  const [inputSearch, setInputSearch] = useState('');
  const [listSearch, setListSearch] = useState([]);
  const [token, setToken] = useState('');
  const navigation = useNavigation();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    getData();
  }, []);
  const getData = () => {
    try {
      AsyncStorage.getItem('user').then(value => {
        if (value != null) {
          let user = JSON.parse(value);
          setToken(user.token);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async () => {
    if (checkPhoneValid(inputSearch)) {
      // console.log(inputSearch);
      await axios
        .get(`${BASE_URL}/users/search?phone=${inputSearch}`, {
          headers: {
            // 'auth-token': user.token,
            'auth-token': `${token}`,
          },
        })
        .then(result => {
          setListSearch(result.data);
          // console.log(result.data);
        })
        .catch(error => {
          console.log(error);
          console.log('3');
        });
    } else {
      await axios
        .get(`${BASE_URL}/users/search?name=${inputSearch}`, {
          headers: {
            'auth-token': `${token}`,
          },
        })
        .then(result => {
          setListSearch(result.data);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  return (
    <View>
      <Header>
        <TouchableOpacity onPress={goBack}>
          <BackImg
            source={require('../../images/icons8-back-50.png')}></BackImg>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, height: 35}}>
          <TouchableOpacity
             onPress={() => {
              handleSearch();
            }}
          >
            <SearchImg1
              source={require('../../images/icons8-search-50.png')}></SearchImg1>
          </TouchableOpacity>
          <TextInput
            style={{
              width: 250,
              height: 45,
              fontSize: 18,
              marginLeft: 5,
            }}
            placeholderTextColor='gray'
            placeholder="  Tìm kiếm"
            onChangeText={setInputSearch}
          ></TextInput>
        </View>
        <TouchableOpacity>
          <QrImg
            source={require('../../images/icons8-qr-24.png')}></QrImg>
        </TouchableOpacity>
      </Header>

      {listSearch.map((item, index) => (
        <CardUser data={item} />
      ))}
    </View>
  );
}
export default Friend_timkiem;
