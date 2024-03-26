import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AppState,
  Text,
  TextInput,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import {
  Header,
  SearchImg,
  AddFriendImg,
  TextI,
  Them,
  BaCham,
  GroupImg,
  TextButton,
} from './styles';
import {Button, Input} from '../../components';
import {BASE_URL, checkPhoneValid} from '../../utils';
import {useSelector, useDispatch} from 'react-redux';
import axios from 'axios';
import CardUser from './CardUserSearch';
import {getContacts, getPenddingRequests} from '../../redux/userSlice';
import {createAsyncThunk} from '@reduxjs/toolkit';
import ReceivedInvitation from './ReceivedInvitation';
import CardFriend from './CardFriend';
import {getUserId} from '../../utils';
import {useFocusEffect} from '@react-navigation/native';

function Friend_banbe(props) {
  const [isBanBe, setIsBanBe] = React.useState(false);
  const [color, setcolor] = React.useState(1);
  
  const pendingRequests = useSelector(
    state => state.userReducer.pendingRequests,
  );
  // console.log(pendingRequests);
  const contacts = useSelector(state => state.userReducer.contacts);
  const dispatch = useDispatch();

  // console.log('pendingr', pendingRequests);
  // console.log('contacts',contacts);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const userID = await getUserId();
        await dispatch(getContacts(userID));
        // console.log(1);
        await dispatch(getBlocks(`/users/${userID}`));
      };
      fetchData();
    }, []),
  );

  return (
    <View>
      <Header>
        <SearchImg
          source={require('../../images/icons8-search-50.png')}></SearchImg>
        <TextInput
          style={{
            width: 250,
            height: 45,
            fontSize: 20,
            marginLeft: 10,
          }}
          placeholderTextColor="white"
          placeholder="Search"
          onPressIn={() =>
            props.navigation.navigate('Friend_timkiem')
          }></TextInput>
        <AddFriendImg
          source={require('../../images/icons8-add-friend-24.png')}></AddFriendImg>
      </Header>

      <View style={{marginTop: 20}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Pressable
            onPress={() => {
              setIsBanBe(false);
              setcolor(1);
            }}>
            <TextButton
              style={[
                {},
                color == 1
                  ? {
                      borderBottomColor: '#3399ff',
                      borderBottomWidth: 3,
                      color: 'black',
                    }
                  : null,
              ]}>
              Friends
            </TextButton>
          </Pressable>
          <Pressable
            onPress={() => {
              setIsBanBe(true);
              setcolor(2);
            }}>
            <TextButton
              style={[
                {},
                color == 2
                  ? {
                      borderBottomColor: '#3399ff',
                      borderBottomWidth: 3,
                      color: 'black',
                    }
                  : null,
              ]}>
              Groups
            </TextButton>
          </Pressable>
        </View>
        <>
          {!isBanBe ? (
            <View>
              <View
                style={{borderBottomColor: '#DCDCDC', borderBottomWidth: 10}}>
                <TouchableOpacity
                  // onPress={() => setIsBanBe(true)}//chuyen sang màn lời mời
                  onPress={() => {
                    props.navigation.navigate('Friend_received');
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <View
                      style={{
                        backgroundColor: '#3399ff',
                        height: 30,
                        width: 30,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10,
                      }}>
                      <GroupImg
                        source={require('../../images/icons8-group-24.png')}></GroupImg>
                    </View>
                    <Text style={{marginLeft: 10, fontSize: 20}}>Invitation</Text>
                  </View>
                </TouchableOpacity>
              
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View
                      style={{
                        backgroundColor: '#3399ff',
                        height: 30,
                        width: 30,
                        borderRadius: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: 10,
                      }}>
                      <GroupImg
                        source={require('../../images/icons8-contact-64.png')}></GroupImg>
                    </View>
                    <Text style={{marginLeft: 10, fontSize: 20 }}>
                      List friend
                    </Text>
                  </View>
               
              </View>
              <View style={{margin: 10, height: 450}}>
                <ScrollView
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                  {contacts?.map((item, index) => (
                    <CardFriend data={item} key={index} />
                  ))}
                </ScrollView>
              </View>
            </View>
          ) : (
            <View>
              <View>
                <Text style={{fontSize: 20, marginTop: 10, marginLeft: 10}}>
                  Groups
                </Text>
              </View>
            </View>
          )}
        </>
      </View>
    </View>
  );
}
export default Friend_banbe;
