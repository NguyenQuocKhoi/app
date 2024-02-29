import { useEffect, useState } from 'react';
import { Alert, Modal, Text, TextInput, TouchableOpacity } from 'react-native';
import { Image, View } from 'react-native-animatable';
import CardAddMembers from '../Group/CardAddMembers';
import { useDispatch, useSelector } from 'react-redux';
import { AddFriendImg1, BackImg, CrossImg, HeaderAddMember, LeaveGroupImg } from './styles';
import { useNavigation } from '@react-navigation/native';
import { BASE_URL, getToken, getUserId } from '../../utils';
import axios from 'axios';
import { getAllConversations, selectConversation } from '../../redux/conversationsSlice';

export default function ChatInfo1() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [members, setMembers] = useState([]);
    const [openAddMembers, setOpenAddMembers] = useState(false);

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
    // console.log(inputNameGroup);
    const dispatch = useDispatch();
    const handleChangeGroupName = async () => {
        try {
            const dt = {
                conversationId: selectedConversation._id,
                name: inputNameGroup,
            };
            const token = await getToken();
            const userId = await getUserId();
            const result = await axios.put(`${BASE_URL}/conversation/changeGroupName`, dt, {
                headers: {
                    "auth-token": `${token}`,
                }
            })

            if (result.status === 200) {
                const result1 = await axios.get(`${BASE_URL}/conversation/${selectedConversation._id}`, {
                    headers: {
                        "auth-token": `${token}`,
                    }
                })
                if (result1.status === 200) {
                    await dispatch(selectConversation(result1.data));
                    await dispatch(getAllConversations(userId))
                    // props.onHide();
                    Alert.alert('Success');
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Fail')
        }
    };
    // console.log(groupName); 
    return (
        <View>
            <HeaderAddMember>
                <TouchableOpacity onPress={navigation.goBack}>
                    <BackImg
                        source={require('../../images/icons8-back-50.png')}></BackImg>
                </TouchableOpacity>
                <View>
                    <Text style={{ fontSize: 20, color: 'white', marginLeft: 10 }}>
                        Tùy chọn
                    </Text>
                </View>
            </HeaderAddMember>
            <View style={{ alignItems: 'center' }}>
                <Image
                    source={require('../../images/user.png')}
                    style={{ height: 60, width: 60, borderRadius: 50 }}
                />
                <View>
                    {selectedConversation.isGroup
                        ? (<TouchableOpacity
                            onPress={() => { setModalVisible(true) }}
                        >
                            <Image
                                source={require('../../images/icons8-edit-24.png')}
                                style={{ height: 24, width: 24 }}
                            />
                        </TouchableOpacity>) : null}


                </View>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text>{selectedConversation.isGroup
                    ? selectedConversation.name
                    : recipient?.name}
                </Text>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ backgroundColor: 'white', alignItems: 'center', width: '90%', marginTop: 10, borderRadius: 5 }}>
                        <Text>Change group name</Text>
                        <TextInput
                            value={inputNameGroup}
                            onChangeText={setInputNameGroup}
                        ></TextInput>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => { handleChangeGroupName() }}
                                style={{ flexDirection: 'row', margin: 10 }}
                            >
                                <AddFriendImg1
                                    source={require('../../images/icons8-group-24.png')}></AddFriendImg1>
                                <Text>Update</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{ flexDirection: 'row', margin: 10 }}
                            >
                                <CrossImg
                                    source={require('../../images/icons8-cross-30.png')}></CrossImg>
                                <Text style={{ marginRight: 35 }}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View>

                <View>
                    {selectedConversation.isGroup ? (
                        <View>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('Members') }}
                            >
                                <Text>Xem thành viên</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { navigation.navigate('AddMember'); }}
                            >
                                <Text>Thêm thành viên</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}

                </View>



            </View>

        </View>
    );
}
