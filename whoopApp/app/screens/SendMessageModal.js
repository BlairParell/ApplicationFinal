import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  AsyncStorage,
  Image,
  Platform,
  ActivityIndicator
} from 'react-native';
import Dimensions from 'Dimensions';
import ModalDropdown from 'react-native-modal-dropdown';

//import MessagesDropDown from '../customButtons/MessagesDropDownButton';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export default class SendMessageModal extends React.Component {
  //  static navigationOptions = ({navigation}) => ({
  //    header: <MessagesDropDown navigation={navigation} />
  //  });
  dropdownAdjustFrame(style) {
    style.top -= DEVICE_HEIGHT/22;
    style.left += DEVICE_WIDTH/3.43;
  };

  _dropdownOptions(idx, value) {
    alert('Test');
//    this.props.navigation.navigate('SelectContactsModal');
//    this.props.navigation.navigate('PreviewMessageModal');
    if (idx == 0) {
      this.props.navigation.navigate('PreviewMessageModal');
    }
  }
// This code here
  static navigationOptions = ({navigation}) => {
//    const { params = {} } = navigation.state;
    return {
      title: 'Send WHOOP!!!',
      headerStyle: {
        backgroundColor: '#500000'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20
      },
      headerRight:
        <ModalDropdown
          options={['Preview']}
          dropdownTextStyle={styles.dropdown_1_text}
          style={styles.dropdown_1}
          dropdownStyle={styles.dropdown_2}
          onSelect = {() => navigation.navigate('PreviewMessageModal')} >
          <Image
            style={{width:50,height:35}}
            source={require('./../images/three_dots.png')}
          />
        </ModalDropdown>
    }/*
    return {
      title: params.title,
      headerRight: params.headerRight
    };*/
  };
// Different way to set header and titles, however takes a while to load so not used
/*  setHeader() {
    let title = 'Send Whoop';
    let headerRight = <ModalDropdown
      options={['Preview']}
      dropdownTextStyle={styles.dropdown_1_text}
      style={styles.dropdown_1}
      dropdownStyle={styles.dropdown_2}
      onSelect = {(idx, value) => this._dropdownOptions()}>
      <Image
        style={{width:50,height:50}}
        source={require('./../images/three_dots.png')}
      />
    </ModalDropdown>;
    this.props.navigation.setParams({
      title,
      headerRight
    });
  }*/

  componentDidMount() {
    const {params} = this.props.navigation.state
    if(!params){
      return
    }
    console.log("PROPS " + JSON.stringify(params));
    console.log(params.selectedContacts)
    if(params.support_id){
      this.setState({
        selectedContacts: [{id: "74"}],
        selectedString: "WHOOP Support"
      })
    }
    if(params.selectedContacts && params.selectedString){
      this.setState({
        selectedContacts: params.selectedContacts,
        selectedString: params.selectedString
      })
    }
    this.props.navigation.setParams({ _dropdownOptionsParams: this. _dropdownOptions });
  }

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      selectedContacts: [],
      selectedGroups: [],
      selectedString: 'Empty',
      loading: false
    }
    this.handler = require('../DB.js')
  };

  process_recp_list(recp_id_list){
    if(recp_id_list.length == 0){
      return ''
    }
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

  handleError(){
    alert('Error sending message')
  }

  processUserIds(user_ids){
    return 'To: ' + this.state.selectedString.replace('\n', ', ')
  }

  insertNewMessage(guid, msg_txt, user_ids, timestamp){
    var msg_obj = {
      id: guid,
      text: msg_txt,
      title: this.processUserIds(user_ids),
      sent: true,
      timestamp: timestamp
    }
    this.handler.insertNewMessage(msg_obj);
  }

  postMessage(user_id, session_token, recp_id_list, recp_grp_id_list, msg_txt){
    console.log('contacts')
    console.log(JSON.stringify(recp_id_list))
    console.log('groups')
    console.log(JSON.stringify(recp_grp_id_list))
    recp_id_list = this.process_recp_list(recp_id_list)
    recp_grp_id_list = this.process_recp_list(recp_grp_id_list)
    console.log('processed grp id list')
    console.log(JSON.stringify(recp_grp_id_list))
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
        list_of_group_ids: recp_grp_id_list,
        message_text: msg_txt
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('response')
      console.log(JSON.stringify(responseData))
      if(responseData.Failed){
        this.handleError()
        return
      }
      var new_message_id = responseData.guid
      var timestamp = responseData.timestamp
      var user_ids = responseData.list_of_user_ids
      console.log('guid: ' + new_message_id)
      console.log('timestamp: ' + timestamp)
      console.log('user_ids: ' + user_ids)
      console.log('response: ' + JSON.stringify(responseData))
      this.insertNewMessage(new_message_id, msg_txt, user_ids, timestamp)
      this.props.navigation.navigate('Feed');
    })
  }

  send_message(recp_id_list, recp_grp_id_list, msg_txt){
    var user_id = this.handler.getUserId()
    var session_token = this.handler.getSessionToken()
    this.postMessage(user_id, session_token, recp_id_list, recp_grp_id_list, msg_txt)
  }

  onPress = () => {
    if(this.state.loading){
      return;
    }
    var selectedContacts = this.state.selectedContacts
    var contIds = []
    for(n in selectedContacts){
      contIds.push(selectedContacts[n].id)
    }
    var selectedGroups = this.state.selectedGroups
    var grpIds = []
    for(n in selectedGroups){
      grpIds.push(selectedGroups[n].id)
    }
    console.log(JSON.stringify(contIds))
    var msg_txt = this.state.message
    this.setState({loading: true})
    this.send_message(contIds, grpIds, msg_txt)
  }

  returnData(selectedContacts, selectedGroups, selectedString){
    console.log('inside return data function')
    console.log(JSON.stringify(selectedContacts))
    console.log(JSON.stringify(selectedGroups))
    console.log(selectedString)
    if(selectedString == ''){
      return
    }
    this.setState({
      selectedContacts: selectedContacts,
      selectedGroups: selectedGroups,
      selectedString: selectedString
    })
  }

  goToContacts = () => {
    this.props.navigation.navigate('SelectContactsModal', {returnData: this.returnData.bind(this)});
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
        <TouchableHighlight
          onPress={this.goToContacts}
          underlayColor='#565656'>
          <Text style={styles.to}>{'To: ' + this.state.selectedString}</Text>
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
        <View>
        {this.state.loading &&
        <ActivityIndicator size='large'/>
        }
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
  },
  buttonTop: {
    width: 26,
    height: 26,
    marginLeft: DEVICE_WIDTH - 192,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -5,
  },
  dropdown_1: {
    flex:1,
    height: 30,
  },
  dropdown_1_text: {
    fontSize: 20,
    color: '#000'
  },
  dropdown_2: {
  	flex:1,
    alignSelf: 'flex-end',
    height:48
  }
});
