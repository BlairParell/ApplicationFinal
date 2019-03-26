import React from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  RefreshControl,
  ActivityIndicator,
  NativeModules,
  DeviceEventEmitter, TouchableOpacity, NetInfo, Alert,
  BackAndroid,
  Image
} from 'react-native';
import DropDown from '../customButtons/DropDownButton';
import Dimensions from 'Dimensions';
import Modal from "react-native-modal";
const { width } = Dimensions.get('window');


const options = [
  'Cancel',
  'Reply',
  <Text style={{color: 'yellow'}}>Reply to Message</Text>,
  'Forward',
  <Text style={{color: 'red'}}>Forward Message</Text>
]

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;


function MiniOfflineSign() {

  // Alert.alert(
  //   'Warning',
  //   'Internet Not Working!',
  //   [
  //     {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
  //     {
  //       text: 'Cancel',
  //       onPress: () => console.log('Cancel Pressed'),
  //       style: 'cancel',
  //     },
  //     {text: 'OK', onPress: () => console.log('OK Pressed')},
  //   ],
  //   {cancelable: false},
  // )
  return (
  <View style={styles.offlineContainer}>
    <Text style={styles.offlineText}>No Internet Connection</Text>
  </View>
);
}

// function handleConnectivityChange = isConnected => {
//   this.setState({ isConnected });
// }

class Message extends React.Component{

  constructor(props){
    super(props);
    this.hideMessageCallback = this.props.hideCallback;
    this.addContactCallback = this.props.addCallback;
    this.item = this.props.item; // message object
    this.navigation = this.props.navigation;
    this.unknownContact = this.props.unknown;
    this.state = {
      isModalVisible: false,
      isConnected: true
    };
    
    this.handler = require('../DB.js')
    console.log('we have a handler')
  }
  handleOnNavigateBack(foo) {
    // this.setState({
    //   foo
    // })
   b = new Feed();
   b._onRefresh()
    //this._onRefresh()
    //this._onRefresh()
  }
 
  onPress = () => {
   
    this.navigation.navigate('MessageModal', {
      item: this.props.item, receipt_id : this.handler.user_id,
      onNavigateBack: this.handleOnNavigateBack.bind(this)

    });
    
  };
  _toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  }

  onLongPress = () => {
  }
  onReplyPress = () => { // Logic for replying to msgs
    this.setState({ isModalVisible: !this.state.isModalVisible }); // For showing the menu
    //const { params } = this.props.item;
    console.log("CHASA:" + this.props.item)
    console.log(this.props.item)
    console.log("SENDER: "+ this.handler.getUserId())
    
    this.navigation.navigate('SendMessageModal', {selectedString: this.props.item.title.slice(4,this.props.item.title.length), selectedContacts: [{'id':this.props.item.sender_id}], onNavigateBack: this.handleOnNavigateBack.bind(this)}); // For Replying to msg

   // this.navigation.navigate('SendMessageModal', {selectedString: this.props.item.title.slice(4,this.props.item.title.length), selectedContacts: [{'id':this.handler.getUserId()}]}); // For Replying to msg
    //this.navigation.navigate('SendMessageModal', {selectedString: this.props.item.title.slice(4,this.props.item.title.length), selectedContacts: this.props.item.sender_id}); // For Replying to msg

  }
  onForwardPress = () => { // Logic for forwarding the msg
    this.setState({ isModalVisible: !this.state.isModalVisible }); // For showing the menu
    this.navigation.navigate('SendMessageModal', {selectedMsg: this.props.item.text, onNavigateBack: this.handleOnNavigateBack.bind(this)}); // For forwarding the msgs
  }
  onHidePress = () => { // Logic for hiding the msg
    this.hideMessageCallback(this.props.item);
    this._toggleModal();
  }
  onAddContactPress = () => { // Logic for add contact
    this.addContactCallback(this.item.id);
    this._toggleModal();
  }
  whiteRender = () => {
    return(
        <TouchableHighlight onPress={this.onPress} onLongPress={this._toggleModal}>
        <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:'#fff',borderRadius:10}}
          
          marginBottom={2}
          paddingHorizontal={0}
          paddingVertical={8}
          width={DEVICE_WIDTH-30}>
          <Modal isVisible={this.state.isModalVisible}
          animationIn='slideInUp'
          backdropColor='black'
          onBackdropPress={() => this.setState({ isModalVisible: false })}

          >
           <View style={{ width:'80%', height:'60%', backgroundColor:'transparent', justifyContent:'center', alignSelf:'center' }}>
            <View style={{flexDirection:'column', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={this.onReplyPress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20, marginTop: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Reply</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onForwardPress}>
              
              <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Forward</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onHidePress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:"#fff", marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Delete</Text>
              </View>
            </TouchableOpacity>
            <View style={this.unknownContact ? null : {display:"none"}}>
            <TouchableOpacity onPress={this.onAddContactPress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Add Contact</Text>
              </View>
            </TouchableOpacity>
            </View>
            {/* <View style={{ width:'80%', height:'50%', backgroundColor:'#500000', justifyContent:'center', alignSelf:'center' }}>
            <View style={{flexDirection:'column', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={this.onReplyPress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:5}}>Reply</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onForwardPress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Forward</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onHidePress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Hide</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={this._toggleModal}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Block User</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Report</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this._toggleModal}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 10 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Close</Text>
              </View>

            </TouchableOpacity>
            </View>
          </View>
          </Modal>

          {/* <MiniOfflineSign /> */}
          <View style={{flexDirection:'column', flex:1}}>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={{justifyContent:'flex-start'}}>
          <Text style={{paddingLeft:15,textAlign:'left', color:'#000',width:(DEVICE_WIDTH-30)/2}}>{this.props.item.title}</Text>
          </View>
          <View style={{justifyContent:'flex-end'}}>
          <Text style={{paddingRight:10,textAlign:'right', color:'#000',width:(DEVICE_WIDTH-30)/2}}>{this.props.item.date}</Text>
          </View>
          </View>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex :1,justifyContent:'flex-start'}}>
          <Text style={{paddingHorizontal:15,textAlign:'left', color:'#000'}}>{this.props.item.text}</Text>
          </View>
          <View style={this.item.bColor==='#282828' ? null : {display:"none"} }>
          <View style={{flex: 0.4,justifyContent:'flex-end', paddingRight: 15}}>
          <View style={{justifyContent:'flex-end',width:0,height:0,backgroundColor:'transparent',borderStyle:'solid',borderLeftWidth:10,borderRightWidth:10,borderBottomWidth:15,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'white'}}>
          </View>
          </View>
          </View>
          </View>
          {/* <View style={{paddingRight:10,alignItems:'right', color:this.props.item.tColor,width:(DEVICE_WIDTH-30)/2}}> */}
          </View>
          {/* </View> */}
        </View>
        {/* </View> */}
      </TouchableHighlight>


    )

  }
  render = () => {
  
    // if (!this.state.isConnected) {
    //   return ( <MiniOfflineSign /> );
    // }
    if(this.props.item.sent === false){
      if(this.props.item.statuss === 'read')
      return this.whiteRender();  
    } else {
    return(

      <TouchableHighlight onPress={this.onPress} onLongPress={this._toggleModal}>
        <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:this.item.bColor,borderRadius:10}}
          
          marginBottom={2}
          paddingHorizontal={0}
          paddingVertical={8}
          width={DEVICE_WIDTH-30}>
          <Modal isVisible={this.state.isModalVisible}
          animationIn='slideInUp'
          backdropColor='black'
          onBackdropPress={() => this.setState({ isModalVisible: false })}

          >
           <View style={{ width:'80%', height:'60%', backgroundColor:'transparent', justifyContent:'center', alignSelf:'center' }}>
            <View style={{flexDirection:'column', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={this.onReplyPress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20, marginTop: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Reply</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onForwardPress}>
              
              <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Forward</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onHidePress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:"#fff", marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Delete</Text>
              </View>
            </TouchableOpacity>
            <View style={this.unknownContact ? null : {display:"none"}}>
            <TouchableOpacity onPress={this.onAddContactPress}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 20 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Add Contact</Text>
              </View>
            </TouchableOpacity>
            </View>
            {/* <View style={{ width:'80%', height:'50%', backgroundColor:'#500000', justifyContent:'center', alignSelf:'center' }}>
            <View style={{flexDirection:'column', justifyContent:'space-between'}}>
            <TouchableOpacity onPress={this.onReplyPress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:5}}>Reply</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onForwardPress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Forward</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onHidePress}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Hide</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={this._toggleModal}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Block User</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this._toggleModal}>
              <Text style={{color:'white', textAlign:'center', fontSize:20, marginTop:10}}>Report</Text>
              <View style={{backgroundColor:'white', width:'60%', height:0.5, alignSelf:'center' }}>
              </View>
            </TouchableOpacity> */}
            <TouchableOpacity onPress={this._toggleModal}>
            <View style={{ width:'80%', height:45, alignSelf:'center',borderRadius:10, backgroundColor:'#fff', marginBottom: 10 }}>
              <Text style={{color:'black', textAlign:'center', fontSize:20, marginTop:5}}>Close</Text>
              </View>

            </TouchableOpacity>
            </View>
          </View>
          </Modal>

          {/* <MiniOfflineSign /> */}
          <View style={{flexDirection:'column', flex:1}}>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={{justifyContent:'flex-start'}}>
          <Text style={{paddingLeft:15,textAlign:'left', color:this.props.item.tColor,width:(DEVICE_WIDTH-30)/2}}>{this.props.item.title}</Text>
          </View>
          <View style={{justifyContent:'flex-end'}}>
          <Text style={{paddingRight:10,textAlign:'right', color:this.props.item.tColor,width:(DEVICE_WIDTH-30)/2}}>{this.props.item.date}</Text>
          </View>
          </View>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={{flex :1,justifyContent:'flex-start'}}>
          <Text style={{paddingHorizontal:15,textAlign:'left', color:this.props.item.tColor}}>{this.props.item.text}</Text>
          </View>
          <View style={this.item.bColor==='#282828' ? null : {display:"none"} }>
           <View style={this.item.statuss==='read' ? null : {display:"none"} }>
            <View style={{flex: 0.4,justifyContent:'flex-end', paddingRight: 15}}>
          {/* <View style={{justifyContent:'flex-end',width:0,height:0,backgroundColor:'transparent',borderStyle:'solid',borderLeftWidth:10,borderRightWidth:10,borderBottomWidth:15,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'white'}}> */}
          {/* </View> */}
               <Image source={require('../images/traingleFull.png')} style={{width: 20, height: 20, resizeMode:'contain', alignSelf:'flex-end'}} />
            </View>
           </View>
           <View style={this.item.statuss==='unread' ? null : {display:"none"} }>
            <View style={{flex: 0.4,justifyContent:'flex-end', paddingRight: 15}}>
          {/* <View style={{justifyContent:'flex-end',width:0,height:0,backgroundColor:'transparent',borderStyle:'solid',borderLeftWidth:10,borderRightWidth:10,borderBottomWidth:15,borderLeftColor:'transparent',borderRightColor:'transparent',borderBottomColor:'white'}}> */}
          {/* </View> */}
               <Image source={require('../images/traingleHalf.png')} style={{width: 20, height: 20, resizeMode:'contain', alignSelf:'flex-end'}} />
            </View>
           </View>
          </View>
          </View>
          {/* <View style={{paddingRight:10,alignItems:'right', color:this.props.item.tColor,width:(DEVICE_WIDTH-30)/2}}> */}
          </View>
          {/* </View> */}
        </View>
        {/* </View> */}
      </TouchableHighlight>
    );
   }
  }
}

export default class Feed extends React.Component {
  static navigationOptions = ({navigation}) => ({
    header: <DropDown navigation={navigation}
      feed={true}
      network={false}
      profile={false}
    />//
  });
 

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      messages: [],
      refreshing: false,
      empty: false
    }
    this.handler = require('../DB.js')
    console.log('we have a handler')
    console.log(this.handler)
  };
  //  handleConnectivityChange = isConnected => {
  //   this.setState({ isConnected });
  // }
  processMessages(responseData, callback){
    console.log('processing messages')
    console.log(JSON.stringify(responseData))
    if(responseData.message || responseData.errorMessage){
      callback('done')
      //this.loadMessages(this.updateMessagesCallback(this.handler.getMessages()))
      return
    }
    var tmp = []
    for(var m in responseData){
      var msg = responseData[m]
      //id, text, title, sent, timestamp
      this.handler.insertNewMessage(msg)
    }
    console.log('done processing messages')
    console.log(JSON.stringify(tmp))
    //callback(this.handler.getMessages())
    this.updateMessagesCallback(this.handler.getMessages())
  }

  loadMessages(callback){
    var user_id = this.handler.user_id
    var session_token = this.handler.session_token
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
      console.log('response data Feed2 : ')
      console.log(JSON.stringify(responseData))
      this.processMessages(responseData, callback)
    }).catch((error) => {
      alert("Network issue occurred... Please try again.")
      console.error(error)
    })

  }

  loadAllMessages(callback){
    var user_id = this.handler.user_id
    var session_token = this.handler.session_token
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
      console.log('response data Feed : ')
      console.log(JSON.stringify(responseData))
      if(responseData.message || responseData.errorMessage){
        this.setState({refreshing:false})
      } else {
        callback(responseData)
      }
    }).catch((error) => {
      alert("Network issue occurred... Please try again.")
      console.error(error)
    })
  }

  updateMessagesCallback(newMessages){
    console.log('updating messages')
    console.log(JSON.stringify(newMessages))
    if(newMessages == 'done'){
      this.setState({
        refreshing: false,
        isLoading: false,
        empty: false
      })
      return
    }
    if(newMessages.length > 0){
      this.setState({
        messages: newMessages,
        refreshing: false,
        isLoading: false,
        empty: false
      })
    } else {
      //Empty messages
      this.setState({
        refreshing: false,
        isLoading: false,
        empty: true
      })
    }
  }

  hideMessageCallback(msg_data){
   // this.removeMessage(msg_data); // this function needs to remove the message on the front-end
    this.pushRemoveMessage(msg_data); // api call to remove message on back-end
   // this.removeMessage(msg_data);
    // currently no way to un-delete a message
  }

  removeMessage(msg_data){
    var callback = this.updateDisplayingMessagesCallback.bind(this);
    this.handler.addReplaceMessagesCallback(callback);
    this.handler.removeMessage(msg_data);
    var callback = this.replaceLocalMessagesCallback.bind(this)
    this.loadAllMessages(callback)
  }

  pushRemoveMessage(msg_data){
    var timestamp = msg_data.timestamp;
    var user_id = this.handler.getUserId();
    var session_token = this.handler.getSessionToken();
    var sent = msg_data.sent;
    console.log("SENT MESSAGE IS : ")
    console.log(sent)
    console.log("MESSAGE DATA IS : ")
    console.log(msg_data)

    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/messages/delete', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        session_token: session_token,
        timestamp: timestamp,
        sent: sent
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log("HERE")
      console.log(JSON.stringify(responseData))
      this._onRefresh()
     // this.removeMessage(msg_data);

    }).catch((error) => {
      alert("Network issue occurred... Please try again.")
      console.error(error)
    })
  }
  
  componentDidMount(){
   // this._onRefresh()
   // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    DeviceEventEmitter.addListener('newNotification', this._onRefresh.bind(this))
    //this._onRefresh()
    var updateMessagesCallback = this.updateDisplayingMessagesCallback.bind(this)
    this.handler.addReplaceMessagesCallback(updateMessagesCallback)

    var callback = this.replaceLocalMessagesCallback.bind(this)
    this.loadAllMessages(callback)

    var storedMessages = this.handler.getMessages()
    if(storedMessages.length > 0){
      updateMessagesCallback(storedMessages)
    } else {
      this.setState({isLoading: true})
    }
    /*
    var callback = this.updateMessagesCallback.bind(this)
    var tmpMessages = []
    if(this.hander){
      tmpMessages = this.handler.getMessages()
    }
    if(tmpMessages.length > 0){
      callback(tmpMessages)
    }
    this.loadMessages(callback)
    //this.handler.getMessages(callback)
    */
  }
  componentWillUnmount() {
    //NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
 }
  updateDisplayingMessagesCallback(){
    var messages = this.handler.getMessages()
    if(messages.length > 0){
      this.setState({
        messages: messages
      })
    }
  }

  replaceLocalMessagesCallback(messages){
    console.log('replacing local messages')
    console.log(JSON.stringify(messages))
    this.handler.clearMessages();
    for(m in messages){
      var msg = messages[m]
      //id, text, title, sent, timestamp
      this.handler.insertNewMessage(msg)
    }
    var messages = this.handler.getMessages()
    if(messages.length > 0){
      this.setState({
        messages: messages,
        refreshing: false,
        isLoading: false,
        empty: false
      })
    } else {
      this.setState({
        refreshing: false,
        isLoading: false,
        empty: true
      })
    }
  }

  addContactCallback(contact_id){
    var user_id = this.handler.getUserId();
    var session_token = this.handler.getSessionToken();
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/contact/unknown', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: user_id,
        session_token: session_token,
        contactee_user_id: contact_id
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
    }).catch((error) => {
      alert("Network issue occurred... Please try again.")
      console.error(error)
    })
  }

  //when the user is looking for new messages
  _onRefresh(){
    /*
    this.setState({refreshing: true})
    var callback = this.updateMessagesCallback.bind(this)
    this.loadMessages(callback)
    */
    this.setState({refreshing: true})
   // NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    var callback = this.replaceLocalMessagesCallback.bind(this)
    this.loadAllMessages(callback)
  }

  renderFooter = () => {
    if(!this.state.loadMore){return null}

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  endReached(){
    if(this.state.messages.length < 10){
      return // this is not a long term solution
    }
    console.log('checking for state')
    if(this.state == undefined){
      console.log('no state apparently')
      return
    }
    if(this.state.loadMore){
      return
    }
    console.log('testing here')
    if(this.state.isLoading){
      return
    } else {
      this.setState({loadMore:true})
      console.log('load more messages')
      var callback = this.updateMessagesCallback.bind(this)
      this.loadOldMessages(this.handler.getOldest(), callback)
    }
  }

  loadOldMessages(oldest, callback){
        console.log(oldest)
        var user_id = this.handler.user_id
        var session_token = this.handler.session_token
        fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/messages', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'user_id': user_id,
            'session_token': session_token,
            'oldest': oldest
          }
        })
        .then((response) => response.json())
        .then((responseData) => {
          console.log('response data')
          console.log(JSON.stringify(responseData))
          this.processMessages(responseData, callback)//This looks like the problem
          this.setState({loadMore: false})
        }).catch((error) => {
          alert("Network issue occurred... Please try again.")
          console.error(error)
        })
  }

  render() {
    
    return (
      <View style={styles.container}>
        {this.state.empty &&
          <Text>Messages are empty</Text>
        }
        <FlatList
        refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh.bind(this)}
        />
      }
          data={this.state.messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) =>(
            <Message navigation={this.props.navigation} item={item} hideCallback={this.hideMessageCallback.bind(this)} addCallback={this.addContactCallback.bind(this)} unknown={item.unknown}/>
          )}
          ListFooterComponent={this.renderFooter}
          onEndReachedThreshold={0.5}
          onEndReached={this.endReached.bind(this)}
        />
        {this.state.isLoading &&
          <View style={styles.isLoading}>
            <Text style={styles.loadingText}>Loading Messages</Text>
            <ActivityIndicator size='large' />
          </View>
        }
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginTop: 3,
    flex: 1
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
  },
  description: {
    marginBottom: 5,
    fontSize: 24,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'left',
    color: '#565656',
    fontWeight: 'bold',
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20
  },
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  loadingText: {
    fontSize:20,
    color:'#000'
  }, container2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
},offlineContainer: {
  backgroundColor: '#b52424',
  height: 30,
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  width,
  marginTop: 50,
  //position: 'absolute',
  flex:1
  //top: 30
},
offlineText: {
  color: '#fff'
},
});

