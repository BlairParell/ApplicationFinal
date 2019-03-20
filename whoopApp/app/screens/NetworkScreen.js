//'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  AsyncStorage,
  TextInput,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';
import DropDown from '../customButtons/DropDownButton';
import Dimensions from 'Dimensions';
import SendMailButton from '../customButtons/SendMailButton';
import ModalDropdown from 'react-native-modal-dropdown';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
var flag = false;
//props: handle: string, mobile_no: string, last: string, first: string, id: string, email: string
class HandleObject extends React.Component {
  render() {
    if (this.props.object.type === 'group') {
      return (
        <GroupObject navigation={this.props.navigation} object={this.props.object} />//key={this.props.object.key} />
      )
    }
    return (
      <ContactObject navigation={this.props.navigation} object={this.props.object} />//key={this.props.object.key} />
    )
  }
}

class ContactObject extends React.Component {
  onPress() {
    this.props.navigation.navigate('AddPersonModal', {
      object: this.props.object
    });
  };

  render(){
    const {navigate} = this.props.navigation;
    return (
      <TouchableHighlight onPress={()=>{this.onPress()}}>
        <View style={styles.container2} >
          <Text style={styles.contacts}>{this.props.object.getName()} ({this.props.object.handle})</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

class GroupObject extends React.Component {
  onPress() {
    this.props.navigation.navigate('CheckGroupModal', {
      object: this.props.object
    });
  };

  render(){
    const {navigate} = this.props.navigation;
    return (
      <TouchableHighlight onPress={() => this.onPress()}>
        <View style={styles.container2}>
          <Text style={styles.contacts}>{this.props.object.getName()} (Group)</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

export default class Network extends React.Component {
/*  static navigatorStyle= {
    navBarBackgroundColor: '#500000',
    navBarTextColor: '#fff',
    navBarTextFontSize: 24
  }*/

  constructor(props){
    super(props);
    this.state = {
      contacts: [],
      groups: [],
      sortedNetworkList: [],
      displayingNetworkList: [],
      search: "",
      flag: true,
      isLoading: true,
      buttonPressed: false
    }
    this._setBackdrop = this._setBackdrop.bind(this);
    this._releaseBackdrop = this._releaseBackdrop.bind(this);
    this.handler = require('../DB.js')
    //this.setState({ buttonPressed: false })
  }
// change this to match SendMessageModal style and use componentDidMount to setParams function
// that will update the backgroundColor when the button is pressed
  static navigationOptions = ({navigation, state}) => {
    const { params = {} } = navigation.state;
    return {
      header:
//      <TouchableHighlight
//      onPress={() => params.setBackdrop()} >
      <DropDown navigation={navigation}
        feed={false}
        network={true}
        profile={false}
        set={params.setBackdrop}
        release={params.releaseBackdrop}
      />
//      </TouchableHighlight>
    }
  };
/*
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: 'WHOOP!!!',
      headerStyle: {
        backgroundColor: '#500000'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginTop: 10,
        marginLeft: 10
      },
      headerRight:
      <View>
        <SendMailButton navigation={navigation}/>
        <ModalDropdown
          options={['Settings', 'Sign Out']}
          dropdownTextStyle={styles.dropdown_1_text}
          style={styles.dropdown_1}
          dropdownStyle={styles.dropdown_2}
          onSelect = {(idx, value) => params._dropdownOptionsParams(idx, value)} >
          <Image
            style={{width:50,height:35}}
            source={require('./../images/three_dots.png')}
          />
        </ModalDropdown>
      </View>
    }/*
    return {
      title: params.title,
      headerRight: params.headerRight
    };
  };*/

  updateDisplayingList(text){
    var network_list = this.state.sortedNetworkList;
    if(text == null){
      text = this.state.search;
    }
    var displaying_list = [];
    console.log('testing update display messages');
    //console.log(JSON.stringify(network_list))
    for(m in network_list){
      var obj = network_list[m];
      var name = "";
      if(obj.type == "contact"){
        name = obj.first_name + obj.last_name;
      } else {
        name = obj.name
      }
      name = name.toLowerCase();
      console.log(name);
      console.log(text);
      if(name.search(text.toLowerCase()) != -1){
        displaying_list.push(obj);
      }
    }
    this.setState({
      search: text,
      displayingNetworkList: displaying_list
    })
  }

  sortNetworkList(networkList){
    ntwObjName = function(networkObject){
      if(networkObject.type === 'group'){
        return networkObject.group.name
      } else if(networkObject.type === 'contact'){
        return networkObject.contact.first_name + ' ' + networkObject.contact.last_name
      }
    }
    return networkList.sort(function(a, b){
      if(this.ntwObjName(a).toLowerCase() < this.ntwObjName(b).toLowerCase()){
        return -1;
      } else {
        return 1;
      }
      return 0;
    })
  }
/*
  processContacts(contactsJson){
    console.log('processing contacts')
    var sortedNetworkList = [];
    if(!contactsJson.Failed){
      var contacts = contactsJson.Contacts
      var contactObjs = []
      for(c in contacts){
        var contact = contacts[c]
        var contactObj = {'type': 'contact', 'key': contact.id, 'contact': contact}
        contactObjs.push(contactObj)
        this.handler.addContact(contactObj.contact.first_name, contactObj.contact.last_name, contactObj.contact.handle, contactObj.contact.id)
      }
      sortedNetworkList = this.sortNetworkList(this.state.networkObjects.concat(contactObjs))
      this.setState({
        contacts: contacts,
        networkObjects: sortedNetworkList
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
        var grpObj = {'type': 'group', 'key': grp.id, 'group': grp}
        groupObjs.push(grpObj)
        this.handler.addGroup(grp.name, grp.id)
      }
      var sortedNetworkList = this.sortNetworkList(this.state.networkObjects.concat(groupObjs))
      this.setState({
        groups: groups,
        networkObjects: sortedNetworkList
      })
    }
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
  _setBackdrop() {
    this.setState({ buttonPressed: true})
  }

  _releaseBackdrop() {
    this.setState({ buttonPressed: false})
  }

  updateContactsCallback(contacts, sortedNetworkList){
    console.log('networkScreenCallback')
    this.setState({
      contacts: contacts,
      isLoading: false,
      sortedNetworkList: sortedNetworkList
    })
    if(this.state.search == ""){
      this.setState({
        displayingNetworkList: sortedNetworkList
      })
    } else {
      this.updateDisplayingList();
    }
  }

  updateGroupsCallback(groups, sortedNetworkList){
    console.log('groupsCallback')
    this.setState({
      groups: groups,
      isLoading: false,
      sortedNetworkList: sortedNetworkList
    })
    if(this.state.search == ""){
      this.setState({
        displayingNetworkList: sortedNetworkList
      })
    } else {
      this.updateDisplayingList();
    }
  }

  supportPress(){
    console.log('support has been pressed');
    this.props.navigation.navigate('SendMessageModal', {support_id: 77});
  }

  componentDidMount(){
    this.props.navigation.setParams({ setBackdrop: this._setBackdrop });
    this.props.navigation.setParams({ releaseBackdrop: this._releaseBackdrop });

    var contactsCallback = this.updateContactsCallback.bind(this)
    this.handler.loadContacts(contactsCallback)
    var groupsCallback = this.updateGroupsCallback.bind(this)
    this.handler.loadGroups(groupsCallback)
  }

//<HandleObject navigation={this.props.navigation} object={item} />

  render() {
    return (      
    <View style={styles.mainContainer}>
      <View style={styles.container}>
      <TextInput
        onChangeText={(text) => this.updateDisplayingList(text)}
        underlineColorAndroid='transparent'
        value={this.state.search}
        placeholder= 'Search'
        style={styles.input} />
        <Text style={styles.support} onPress={this.supportPress.bind(this)}>
          WHOOP SUPPORT
        </Text>
        <FlatList
          data={this.state.displayingNetworkList}
          keyExtractor={(item, index)=>item.getId()}
          extraData={this.state}
          renderItem={({item}) =>
            <HandleObject navigation={this.props.navigation} object={item} />
          }
        />
        {this.state.isLoading &&
          <View style={styles.isLoading}>
            <ActivityIndicator size='large' />
          </View>
        }
        {this.state.buttonPressed &&
          <View style={styles.buttonToggled}>
          </View>
        }
      </View>
      </View>
    );
  };
}

const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor:'#ffffff',
    height: Dimensions.get('window').height
  },
  container: {
    padding: 15,
    marginTop: 10,
    flex: 1,
    backgroundColor:'#ffffff',
    height: Dimensions.get('window').height 
  },
  container2: {
    flexDirection:'row',
    flexWrap:'wrap',
    paddingTop:10,
    paddingLeft: 10,
    paddingVertical:5,
    width:DEVICE_WIDTH - 30,
    borderBottomColor:'#D3D3D3',
    borderBottomWidth: 1,
    height:45
  },
  input: {
    marginBottom: 10,
    textAlign: 'left',
    color: '#000',
    width: DEVICE_WIDTH - 30,
    height: 40,
    paddingLeft: 10,
    backgroundColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5
  },
  support: {
    color: '#DCDCDC',
    height: 30,
    fontSize: 18,
    backgroundColor: '#500000',
    borderRadius: 15,
    textAlign: 'center'
  },
  buttonToggled: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  },
  contacts: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabBar: {
    borderTopColor: 'black',
    backgroundColor: 'white',
    opacity: 0.98
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD'
  },
  description: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#565656',
    fontWeight: 'bold'
  },
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  loadingText: {
    fontSize:20,
    color:'#000'
  },
  isLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
