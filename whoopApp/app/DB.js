import {AsyncStorage} from 'react-native'

class MessageObject {
  constructor(){

  }
}

class RecvMessageObject extends MessageObject {
  constructor(id, text, title, timestamp, sender_id){
    super();
    this.id = id;
    this.text = text;
    this.title = title;
    this.timestamp = timestamp;
    this.sender_id = sender_id
    this.sent = false;
    this.bColor = '#fff'
    this.tColor = '#500000'
    this.date = this.processTimestamp(timestamp);
  }
  processTimestamp(timestamp){
    this.timestamp = timestamp
    console.log('timestamp is ' + timestamp)
    var now = Date.now()
    var date = new Date(timestamp*1000)
    var timeDiff = now - timestamp * 1000;
    if(timeDiff > 60*60*24*1000){
      console.log('return month and date')
      return date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
      //return date.toISOString()
    }
    console.log('return time')
    return date.getHours() + ':' + date.getMinutes()
  }
}

class SentMessageObject extends MessageObject {
  constructor(id, text, title, timestamp){
    super();
    this.id = id;
    this.text = text;
    this.title = title;
    this.timestamp = timestamp;
    this.sent = true;
    this.date = this.processTimestamp(timestamp);
    this.bColor = '#000000';
    this.tColor = '#fff';
  }
  processTimestamp(timestamp){
    this.timestamp = timestamp
    console.log('timestamp is ' + timestamp)
    var now = Date.now()
    var date = new Date(timestamp*1000)
    var timeDiff = now - timestamp * 1000;
    if(timeDiff > 60*60*24*1000){
      console.log('return month and date')
      return date.getMonth()+1 + '/' + date.getDate() + '/' + date.getFullYear();
      //return date.toISOString()
    }
    console.log('return time')
    return date.getHours() + ':' + date.getMinutes()
  }
}

/*
class MessageObject {
  constructor(id, text, title, sent, timestamp){
    this.id = id
    this.text = text
    this.title = title
    this.sent = sent
    this.date = this.processTimestamp(timestamp)
    this.bColor
    this.tColor
    this.processMessage()
  }
  processTimestamp(timestamp){
    this.timestamp = timestamp
    console.log('timestamp is ' + timestamp)
    var now = Date.now()
    var date = new Date(timestamp*1000)
    var timeDiff = now - timestamp * 1000;
    if(timeDiff > 60*60*24*1000){
      console.log('return month and date')
      return date.getMonth()+1 + '/' + date.getDate()
      //return date.toISOString()
    }
    console.log('return time')
    return date.getHours() + ':' + date.getMinutes()
  }
  processMessage(){
    this.tColor = '#fff'
    if(this.title.charAt(0) === 'T'){
      this.bColor = '#000'
    } else {
      if(this.sent === false){
        this.bColor = '#fff'
        this.tColor = '#500000'
      } else {
        this.bColor = '#500000'
      }
    }
  }
}
*/

class NetworkObject {
  getName(){
    return this.name;
  }
  getId(){
    return this.id;
  }
}

class GroupObject extends NetworkObject{
  constructor(name, id){
    super()
    this.type = 'group'
    this.name = name
    this.id = id
    this.members = []
  }
  getMembers(){
    return this.members
  }
  setMembers(mems){
    this.members = mems
  }
  removeMember(mem){
    for(m in this.members){
      var tmpMem = this.members[m]
      if(tmpMem == mem){
        this.members.splice(m, 1)
        return
      }
    }
  }
  addMember(mem){
    this.members.push(mem)
  }
  getName(){
    return this.name
  }
  getId(){
    return this.id
  }
}

class ContactObject extends NetworkObject{
  constructor(first, last, handle, id, email_address, mobile_no){
    super()
    this.type = 'contact'
    this.first_name = first
    this.last_name = last
    this.handle = handle
    this.id = id
    this.email_address = email_address
    this.mobile_no = mobile_no
  }
  getFirst(){
    return this.first_name
  }
  getLast(){
    return this.last_name
  }
  getName(){
    return this.first_name + ' ' + this.last_name
  }
  getHandle(){
    return this.handle
  }
  getId(){
    return this.id
  }
}

class localStorageHandler{
  constructor(){
    this.messages = new Array()
    this.contacts = new Array() // list of contactObjects
    this.groups = new Array() // list of groupObjects
    this.sortedNetworkList = new Array() // list of networkObjects
    this.session_token
    this.user_id
    this.email_address
    this.replaceMessagesCallback
  }
  postFCMToken(fcm_token){
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/fcm', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.getUserId(),
        session_token: this.getSessionToken(),
        fcm_token: fcm_token
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log('done adding fcm token')
      console.log(JSON.stringify(responseData))
    })
  }
  sortNetworkList(networkList){
    return networkList.sort(function(a, b){
      if(a.getName().toLowerCase() < b.getName().toLowerCase()){
        return -1;
      } else {
        return 1;
      }
      return 0;
    })
  }
  processGroups(groupsJson, callback){
    if(groupsJson.Failed){
      callback([])
      return
    }
    var groups = groupsJson.Groups
    var groupObjs = []
    for(g in groups){
      var grp = groups[g]
      var grpObj = new GroupObject(grp.name, grp.id)
      groupObjs.push(grpObj)
    }
    this.groups = groupObjs
    var sortedNetworkList = this.sortNetworkList(this.contacts.concat(this.groups))
    console.log('sortedNetworkList')
    console.log(JSON.stringify(sortedNetworkList))
    console.log('groups')
    console.log(JSON.stringify(this.groups))
    //callback(groups, sortedNetworkList)
  }
  loadGroups(callback){
    console.log('checking for existing groups')
    console.log(this.groups.length)
    if(this.groups.length > 0){
      callback(this.groups, this.sortNetworkList(this.contacts.concat(this.groups)))
    }
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/groups', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user_id': this.user_id,
        'session_token': this.session_token
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      this.processGroups(responseData, callback)
    })
  }
  processContacts(contactsJson, callback){
    this.updateContactsCallback = callback
    var storedNetworkList = [];
    if(contactsJson.Failed){
      callback([])
    }
    var contacts = contactsJson.Contacts
    var contactObjs = []
    for(c in contacts){
      var contact = contacts[c]
      var contactObj = new ContactObject(contact.first_name, contact.last_name, contact.handle, contact.id, contact.email_address, contact.mobile_no)
      contactObjs.push(contactObj)
    }
    this.contacts = contactObjs
    sortedNetworkList = this.sortNetworkList(this.groups.concat(this.contacts))
    console.log('sortedNetworkList')
    console.log(JSON.stringify(sortedNetworkList))
    console.log('contacts')
    console.log(JSON.stringify(this.contacts))
    callback(contacts, sortedNetworkList)
  }
  loadContacts(callback){
    console.log('checking for existing contacts')
    console.log(this.contacts.length)
    if(this.contacts.length > 0){
      callback(this.contacts, this.sortNetworkList(this.groups.concat(this.contacts)))
    }
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/contacts', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user_id': this.user_id,
        'session_token': this.session_token
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      this.processContacts(responseData, callback)
      //callback(responseData)
    })
  }
  getMessages(){
    return this.messages
    //callback(this.messages)
  }
  getOldest(){
    return this.messages[this.messages.length-1].timestamp
  }
  clearMessages(){
    this.messages = new Array();
  }
  addReplaceMessagesCallback(callback){
    this.replaceMessagesCallback = callback
  }
  makeMessageObject(msg_data){
    if(msg_data.sent){
      return new SentMessageObject(msg_data.msg_id, msg_data.text, msg_data.title, msg_data.timestamp);
    } else {
      return new RecvMessageObject(msg_data.msg_id, msg_data.text, msg_data.title, msg_data.timestamp, msg_data.sender_id);
    }
  }
  removeMessage(msg_data){
    var msg_id = msg_data.id;
    var tmp = 0;
    for(msg in this.messages){
      if(msg.id = msg_id){
        this.messages.splice(tmp, 1);
        break;
      }
      tmp++;
    }
    this.replaceMessagesCallback(this.getMessages())
  }
  insertMessage(msg_data){
    console.log('in the insert message function');
    console.log('timestamp is ' + msg_data.timestamp);
    console.log('in the insert message function')
    var msgObj = this.makeMessageObject(msg_data);
    this.messages.unshift(msgObj)
    if(this.replaceMessagesCallback){
      this.replaceMessagesCallback(this.getMessages())
    }
  }
  insertNewMessage(msg_data){
    var msgObj = this.makeMessageObject(msg_data);
    this.messages.push(msgObj)
    if(this.replaceMessagesCallback){
      this.replaceMessagesCallback(this.getMessages())
    }
  }
  /*
  processMessages(responseData, callback){
    console.log('processing messages')
    console.log(JSON.stringify(responseData))
    if(responseData.message || responseData.errorMessage){
      callback('done')
      this.loadMessages(callback)
      return
    }
    var tmp = []
    for(var m in responseData){
      var msg = responseData[m]
      //id, text, title, sent, timestamp
      this.insertNewMessage(msg.id, msg.text, msg.title, msg.sent, msg.timestamp)
    }
    console.log('done processing messages')
    console.log(JSON.stringify(tmp))
    callback(this.messages)
  }
  loadMessages(callback){
    var user_id = this.user_id
    var session_token = this.session_token
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/messages', {
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
      console.log('response data')
      console.log(JSON.stringify(responseData))
      this.processMessages(responseData, callback)
    })
  }*/
  addContact(first, last, handle, id){
    var contactObj = new ContactObject(first, last, handle, id)
    this.contacts.push(contactObj)
  }
  getContacts(){
    console.log('returning all contacts')
    console.log(JSON.stringify(this.contacts))
    return this.contacts
  }
  removeContact(id){
    console.log('remove contact')
    for(con in this.contacts){
      if(this.contacts[con].getId() == id){
        this.contacts.splice(con, 1);
        break
      }
    }
    if(this.updateContactsCallback){
      var sortedNetworkList = this.sortNetworkList(this.groups.concat(this.contacts))
      this.updateContactsCallback(this.contacts, sortedNetworkList)
    }
    console.log('all contacts: ')
    console.log(JSON.stringify(this.contacts))
  }
  postDeleteContact(id){
    this.removeContact(id)
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/deletecontact', {
      method: 'POST',
      credentials: 'include',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.getUserId(),
        session_token: this.getSessionToken(),
        contactee_user_id: id
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      if(responseData.Failed == false){
        //this.removeContact(id);
      } else {
        alert('failed')
      }
    })
  }
  addGroup(name, id){
    var groupObj = new GroupObject(name, id)
    this.groups.push(groupObj)
  }
  getGroups(){
    return this.groups
  }
  processGroupMembers(responseData, callback, grpId){
    console.log('processing group members')
    if(responseData.Failed){
      console.log('failed group members call')
      callback(false)
      return
    }
    var mems = responseData.Members
    if(mems.length == 0){
      console.log('empty group')
      callback(false)
      return
    }
    for(g in this.groups){
      var grp = this.groups[g]
      if(grp.getId() == grpId){
        grp.setMembers(mems)
        callback(grp)
        return
      }
    }
  }
  loadGroupMembers(grpId, callback){
    console.log('loading group members')
    var token = this.getSessionToken()
    var user_id = this.getUserId()
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/groups/members', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'user_id': user_id,
        'session_token': token,
        'group_id': grpId
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('about to process group members')
      this.processGroupMembers(responseData, callback, grpId)
    })
  }
  removeMemFromGroup(grpId, mem){
    //remove member locally then push to server
    for(g in this.groups){
      var grp = this.groups[g]
      if(grp.id == grpId){
        grp.removeMember(mem)
        //this.pushRemoveMember(grpId, mem)
      }
    }
  }
  pushAddMember(grpId, mem){
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/groups/members', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.getUserId(),
        session_token: this.getSessionToken(),
        group_id: grpId,
        contact_id: mem.id
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log('done adding member')
      console.log(JSON.stringify(responseData))
    })
  }
  addMemToGroup(grpId, mem){
    console.log('attempting to add group member')
    console.log(JSON.stringify(this.groups))
    for(g in this.groups){
      var grp = this.groups[g]
      if(grp.id == grpId){
        console.log('adding member to db')
        // check if member already exists
        grp.addMember(mem)
        this.pushAddMember(grpId, mem)
      }
    }
  }
  async setUserId(user_id){
    this.user_id = user_id
    AsyncStorage.setItem('user_id', user_id)
  }
  getUserId(){
    return this.user_id
  }
  getSessionToken(){
    return this.session_token
  }
  async setSessionToken(session_token){
    this.session_token = session_token
    console.log('setting session token')
    AsyncStorage.setItem('SESSION_KEY', session_token)
  }
  async setEmail(email_address){
    this.email_address = email_address
    AsyncStorage.setItem('email_address', email_address)
  }
  async getEmail(){
    try {
      var e = await AsyncStorage.getItem('email_address')
      return e
    } catch (error) {
      return null
    }
  }
  async setPassword(password){
    AsyncStorage.setItem('password', password)
  }
  async getPassword(){
    try {
      var p = await AsyncStorage.getItem('password')
      return p
    } catch (error) {
      return null
    }
  }
  async logout(){
    await AsyncStorage.clear()
    this.constructor()
  }
}

// this is the local storage handler for the entire application
var tmp = new localStorageHandler()

module.exports = tmp
