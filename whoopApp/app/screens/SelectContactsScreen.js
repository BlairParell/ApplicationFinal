import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import MessagesDropDown from '../customButtons/MessagesDropDownButton';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export default class SelectContactsScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: <MessagesDropDown navigation={navigation} />
  });

  constructor(props) {
    super(props);
    this.state = {
      message: ''
    }
  };

  process_recp_list(recp_id_list){
    var tmp_recp_list = ""
    if(recp_id_list.length > 1){
      for(id in recp_id_list){
        tmp_recp_list += (recp_id_list[id] + ",")
      }
      tmp_recp_list = tmp_recp_list.substring(0, tmp_recp_list.length - 1)
    } else {
      tmp_recp_list =  "" + recp_id_list[0]
    }
    return tmp_recp_list
  }

  postMessage(user_id, session_token, recp_id_list, msg_txt){
    recp_id_list = this.process_recp_list(recp_id_list)
    //console.log(tmp_recp_list)
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/messages', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        session_token: session_token,
        list_of_user_ids: recp_id_list,
        list_of_off_network_ids: "",
        group_ids: "",
        message_text: msg_txt
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('response')
      console.log(JSON.stringify(responseData))
      var new_message_id = responseData // this needs error handling
    })
  }

  send_message(recp_id_list, msg_txt){
    try {
      AsyncStorage.getItem("user_id").then((value) => {
        user_id = value
        AsyncStorage.getItem("SESSION_KEY").then((value) => {
          this.postMessage(user_id, value, recp_id_list, msg_txt)
        });
      });
    } catch (error) {
      alert('error');
    }
  }

  onPress = () => {
    var recp_id = 19293840 // temp hardcode recipient
    var msg_txt = this.state.message
    this.send_message([recp_id], msg_txt)
  }

  goToContacts = () => {
    this.props.navigation.navigate('AddContact');
//    https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/contacts
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
        <TouchableHighlight
          onPress={this.goToContacts}
          underlayColor='#565656'>
          <Text style={styles.to}>To:   Select Contacts</Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPress}
          underlayColor='#565656'>
          <Text style={styles.buttonText}>SEND</Text>
        </TouchableHighlight>
        </View>
        <View style={styles.container2}>
          <TextInput
            style={styles.input}
            underlineColorAndroid='transparent'
            editable={true}
            maxLength={200}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => this.setState({message:text})} />
        </View>
      </View>
    );
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  container2: {
    marginHorizontal: 15,
    marginTop: 20,
    paddingHorizontal: 5,
  },
  to: {
    fontSize: 16,
    color: '#500000',
    marginTop: 5
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    width: 80,
    height: 40,
    marginLeft: DEVICE_WIDTH - 260
  },
  text: {
    fontSize: 14,
    color: '#500000',
    marginTop: 5
  },
  input: {
    marginBottom: 10,
    textAlign: 'left',
    textAlignVertical: 'top',
    color: '#000',
    fontSize: 18,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5
  },
  buttonText1: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonText2: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
