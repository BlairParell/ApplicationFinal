import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  TouchableHighlight,
  AsyncStorage,
  FlatList,
  ActivityIndicator
} from 'react-native';
import Dimensions from 'Dimensions';
import CheckBox from 'react-native-checkbox'
import MessagesDropDown from '../customButtons/MessagesDropDownButton';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class NetworkListObject {
  constructor(type, id, name){
    this.type = type // string : group / contact
    this.name = name
    this.key = id
    this.id = id
    this.checked = false
  }
  check(){
    this.checked = !this.checked
  }
  getChecked(){
    return this.checked
  }
  getName(){
    return this.name
  }
  getId(){
    return this.id
  }
  getType(){
    return this.type
  }
}

export default class SelectContactsModal extends React.Component {
  static navigationOptions = {
    title: 'WHOOP!!! APP',
    headerStyle: {
      backgroundColor: '#530000'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontSize: 20
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      groups: [],
      flag: true,
      isLoading: true,
      blur: false,
      sortedNetworkList: [],
      message: ''
    };
    this.handler = require('../DB.js')
    this.selectedContacts = []
    this.selectedGroups = []
  };
/*
  processContacts(contactsJson){
    flag = false;
    console.log('processing contacts')
    if(!contactsJson.Failed){
      var contacts = contactsJson.Contacts
      var contactObjs = []
      for(c in contacts){
        var contact = contacts[c]
        var contactObj = new NetworkListObject('contact', contact.id, contact.first_name + ' ' + contact.last_name)
        contactObjs.push(contactObj)
      }
      var sortedNetworkList = this.sortNetworkList(this.state.groups.concat(contactObjs))
      console.log('sortedNetworkList')
      console.log(JSON.stringify(sortedNetworkList))
      this.setState({
        contacts: contactObjs,
        sortedNetworkList: sortedNetworkList
      });
    }
    this.setState({ isLoading: false });
  }

  processGroups(groupsJson){
    flag = true;
    console.log('processing groups')
    if(!groupsJson.Failed){
      var groups = groupsJson.Groups
      var groupObjs = []
      for(g in groups){
        var grp = groups[g]
        var grpObj = new NetworkListObject('group', grp.id, grp.name)
        groupObjs.push(grpObj)
      }
      var sortedNetworkList = this.sortNetworkList(this.state.contacts.concat(groupObjs))
      console.log('sortedNetworkList')
      console.log(JSON.stringify(sortedNetworkList))
      this.setState({
        groups: groupObjs,
        sortedNetworkList: this.sortNetworkList(this.state.contacts.concat(groupObjs))
      })
    }
  }

  sortNetworkList(networkList){
    var sortedList = networkList.sort(function(a, b){
      if(a.name.toLowerCase() < b.name.toLowerCase()){
        return -1;
      } else {
        return 1;
      }
      return 0;
    })
    return sortedList
  }

  loadContacts(user_id, session_token){
    console.log('user_id: ' + user_id);
    console.log('session_token: ' + session_token);
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/contacts', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user_id': user_id,
        'session_token': session_token
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      this.processContacts(responseData)
    })
  }

  loadGroups(user_id, session_token){
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/groups', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user_id': user_id,
        'session_token': session_token
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      this.processGroups(responseData)
    })
  }
*/

  getContactsCallback(contacts, sortedNetworkList){
    console.log('contacts callback')
    console.log(JSON.stringify(contacts))
    console.log(JSON.stringify(sortedNetworkList))
    this.setState({
      contacts: contacts,
      sortedNetworkList: sortedNetworkList
    })
  }

  getGroupsCallback(groups, sortedNetworkList){
    console.log('groups callback')
    console.log(JSON.stringify(groups))
    console.log(JSON.stringify(sortedNetworkList))
    this.setState({
      groups: groups,
      sortedNetworkList: sortedNetworkList
    })
  }

  componentDidMount(){
    this.handler.loadContacts(this.getContactsCallback.bind(this))
    this.handler.loadGroups(this.getGroupsCallback.bind(this))
    console.log('end of component did mount')
    /*
    var contacts = this.handler.getContacts()
    this.processContacts({'Failed': false, 'Contacts': contacts})
    var groups = this.handler.getGroups()
    this.processGroups({'Failed': false, 'Groups': groups})

    //Get user id and session token from async storage
    try {
      AsyncStorage.getItem("user_id").then((value) => {
        user_id = value
        console.log('have user id')
        AsyncStorage.getItem("SESSION_KEY").then((value) => {
          this.loadContacts(user_id, value)
          this.loadGroups(user_id, value)
        });
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
    */
  }

  process_recp_list(recp_id_list){
    var tmp_recp_list = "";
    if(recp_id_list.length > 1){
      for(id in recp_id_list){
        tmp_recp_list += (recp_id_list[id] + ",");
      }
      tmp_recp_list = tmp_recp_list.substring(0, tmp_recp_list.length - 1);
    } else {
      tmp_recp_list =  "" + recp_id_list[0];
    }
    return tmp_recp_list;
  }

  contactsSelected(){
    console.log('selected contacts')
    console.log(JSON.stringify(this.selectedContacts))
    console.log('selected groups')
    console.log(JSON.stringify(this.selectedGroups))
    var selCntString = this.makeSelCntString(this.selectedContacts.concat(this.selectedGroups))
    console.log(selCntString)
    this.props.navigation.state.params.returnData(this.selectedContacts, this.selectedGroups, selCntString);
    this.props.navigation.goBack();
  }

  makeSelCntString(selectedContacts){
    var tmp = ''
    for(cnt in selectedContacts){
      var obj = selectedContacts[cnt]
      tmp += obj.type == 'contact' ? obj.first_name + ' ' + obj.last_name + '\n' : obj.name + '\n'
    }
    return tmp
  }

  onCheck(checked, item){
    if(checked){
      item.type == 'contact' ? this.selectedContacts.push(item) : this.selectedGroups.push(item)
    } else {
      if(item.type == 'contact'){
      for(n in this.selectedContacts){
        if(this.selectedContacts[n] == item){
          this.selectedContacts.splice(n, 1)
          return
        }
      }
    } else {
      for(n in this.selectedGroups){
        if(this.selectedGroups[n] == item){
          this.selectedGroups.splice(n, 1)
          return
        }
      }
    }
    }
  }

  render() {
    return (
      <View>
        <View style={styles.container}>
          <Text style={styles.network}>Network</Text>
          <FlatList
            data={this.state.sortedNetworkList}
            keyExtractor={(item, index) => item.id}
            renderItem={({item}) => (
                <CheckBox
                  label={item.type == 'contact' ? item.first_name + ' ' + item.last_name : item.name }
                  onChange={(checked)=>{this.onCheck(checked, item)}}
                />
            )}
          />
          <View style={styles.doneButton}>
          <Button
            title = "Done"
            onPress={() => this.contactsSelected()}
          />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 20,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  container2: {
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1
  },
  doneButton: {
    alignSelf: 'center'
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
  network: {
    fontSize: 14,
    color: '#500000',
    marginTop: 5,
    fontWeight: 'bold'
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
