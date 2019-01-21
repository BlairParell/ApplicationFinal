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
  DeviceEventEmitter
} from 'react-native';
import DropDown from '../customButtons/DropDownButton';
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

class Message extends React.Component{

  constructor(props){
    super(props);
  }

  onPress = () => {
    this.props.navigation.navigate('MessageModal', {
      item: this.props.item

    });
  };

  onLongPress = () => {
  }

  renderNormal = () => {
    return(
      <TouchableHighlight onPress={this.onPress} onLongPress={this.onLongPress}>
        <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:this.props.bColor}}
          marginBottom={2}
          paddingHorizontal={0}
          paddingVertical={8}
          width={DEVICE_WIDTH-30}>
          <Text style={{paddingLeft:5,textAlign:'left', color:this.props.tColor,width:(DEVICE_WIDTH-30)/2}}>{this.props.title}</Text>
          <Text style={{paddingRight:5,textAlign:'right', color:this.props.tColor,width:(DEVICE_WIDTH-30)/2}}>{this.props.date}</Text>
          <Text style={{paddingHorizontal:5,textAlign:'left', color:this.props.tColor}}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderMenu = () => {
    return(
      <TouchableHighlight onPress={this.onPress} onLongPress={this.onLongPress}>
        <View style={{flexDirection:'row',flexWrap:'wrap',backgroundColor:this.props.bColor}}
          marginBottom={2}
          paddingHorizontal={0}
          paddingVertical={8}
          width={DEVICE_WIDTH-30}>
          <Text style={{paddingLeft:5,textAlign:'left', color:this.props.tColor,width:(DEVICE_WIDTH-30)/2}}>{"Testing"}</Text>
          <Text style={{paddingRight:5,textAlign:'right', color:this.props.tColor,width:(DEVICE_WIDTH-30)/2}}>{this.props.date}</Text>
          <Text style={{paddingHorizontal:5,textAlign:'left', color:this.props.tColor}}>{this.props.text}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  render(){
    return this.renderNormal();
    /*
    if(!this.state.menu_exposed){
      return this.renderNormal();
    } else {
      return this.renderMenu();
    }
    */
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
      console.log('response data')
      console.log(JSON.stringify(responseData))
      this.processMessages(responseData, callback)
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
      console.log('response data')
      console.log(JSON.stringify(responseData))
      if(responseData.message || responseData.errorMessage){
        this.setState({refreshing:false})
      } else {
        callback(responseData)
      }
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

  componentDidMount(){
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

  //when the user is looking for new messages
  _onRefresh(){
    /*
    this.setState({refreshing: true})
    var callback = this.updateMessagesCallback.bind(this)
    this.loadMessages(callback)
    */
    this.setState({refreshing: true})
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
            <Message navigation={this.props.navigation} item={item} title={item.title} date={item.date} text={item.text} bColor={item.bColor} tColor={item.tColor} msg_id={item.id} />
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
    padding: 15,
    marginTop: 10,
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
  }
});
