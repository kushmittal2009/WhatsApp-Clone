import React, {useEffect, useState} from 'react';
import {
  FlatList,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
} from 'react-native';
import _Divider from '../../components/_Divider';
import constants from '../../utils/constants';
import {Container} from 'native-base';
import ContactsHeaderView from './ContactsHeaderView';
import Contacts from 'react-native-contacts';
import ContactsItem from './ContactsItem';
import {getLoggedInUserList} from '../../api/apiController';
import {getLocalData} from '../../utils/helperFunctions';
import EmptyComponent from '../../components/EmptyComponent';

const ContactsView = ({navigation, route}) => {
  const [contacts, setContacts] = useState([]);
  const [newuser, setNewUser] = useState('');
  const [userid, setUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [item1, setItem1] = useState('');
  const [name, setName] = React.useState('');
  const [number, setNumber] = React.useState('');

  
  
  useEffect(() => {
    getRegisteredUsers();
  }, []);

  const getRegisteredUsers = () => {
    getLoggedInUserList()
      .then(async res => {
        console.log('User List Response => ', res.data);
        if (res.data.success) {
          var userList = res.data.data;
          var ownerID = await getLocalData(constants.USER_ID);

          for (let index = 0; index < userList.length; index++) {
            const user = userList[index];
            if (user.userId === ownerID) {
              userList.splice(index, 1);
            }
          }
          setContacts(userList);
        }
      })
      .catch(err => {
        console.log('User List Error => ', err);
      });
  };

  const getAllContacts = () => {
    if (Platform.OS === 'android') {
      console.log('PLATFORM => ', Platform.OS);
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
        {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
          buttonPositive: 'Accept',
        },
      )
        .then(flag => {
          console.log('WRITE_CONTACTS Permission Granted => ', flag);

          if (flag === 'granted') {
            PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
              {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
                buttonPositive: 'Accept',
              },
            )
              .then(flag => {
                console.log('READ_CONTACTS Permission Granted => ', flag);
                if (flag === 'granted') {
                  fectchContacts();
                }
              })
              .catch(() => {
                console.log('READ_CONTACTS Permission Denied');
              });
          }
        })
        .catch(() => {
          console.log('WRITE_CONTACTS Permission Denied');
        });
    } else {
      fectchContacts();
    }
  };

  const fectchContacts = () => {
    Contacts.getAll((err, contacts) => {
      if (err === 'denied') {
        // error
        console.log('fectchContacts Error');
      } else {
        // contacts returned in Array
        // console.log(JSON.stringify(contacts));

        setContacts(contacts);
      }
    });
  };
  async function goToUser(){
    var userName = name;
    var mobile = number;
    setNewUser(true);
    contacts.forEach(async function (element){
      if(
        element.phoneNumber == mobile
      ){
      setNewUser(false);
      setUserId(element.userId);
      setChatId(element.chatId);
      setItem1(element);


      }
    })
    if(newuser == true){
    loginUser(getLoginModel(userName, mobile));
    contacts.forEach(async function (element){
      if(
        element.phoneNumber == mobile
      ){
      setUserId(element.userId);
      setChatId(element.chatId);
      setItem1(element);

      }
    })
    } 
    var userChatList = route.params.chatList;
    let isMatch = false;
    if (userChatList && userChatList.length > 0) {
      for (let index = 0; index < userChatList.length; index++) {
        const element1 = userChatList[index];
        if (
          element1.userId === userid ||
          element1.userId === chatId ||
          element1.chatId === userid ||
          element1.chatId === chatId
        ) {
          navigateChatRoom(item1);
          isMatch = true;
          break;
        } else {
          let chatModel = await getContactsChatModel(item1);
          navigateChatRoom(chatModel);
        }
      }
      }
      isMatch = false;
    }
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <Container>
        <ContactsHeaderView
          item={contacts ? contacts.length : 0}
          navigation={navigation}
        />
        {contacts.length <= 0 && <EmptyComponent message={'No User Found'} />}
        <FlatList
          // contentContainerStyle={DEFAULT_STYLES.container}
          data={contacts}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => {
            return <_Divider />;
          }}
          renderItem={({item}) => {
            return (
              <ContactsItem
                item={item}
                navigation={navigation}
                userChatList={route.params.chatList}
              />
            );
          }}
        />
      </Container>
      <Container>
          <SafeAreaView>
              <TextInput>
                onChangeText={setNumber}
                value={number}
                placeholder="Number"

              </TextInput>
              <TextInput>
                onChangeText={setName}
                value={name}
                placeholder="Name"
              </TextInput>
              <Button>
              onPress={goToUser}
              title="Submit"
              color="#841584"
              </Button>
          </SafeAreaView>
      </Container>
    </SafeAreaView>
  );
};

export default ContactsView;
