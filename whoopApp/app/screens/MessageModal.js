import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image, BackAndroid
} from 'react-native';

import Dimensions from 'Dimensions';

const SoundPlayer = require('react-native-sound');
SoundPlayer.setCategory('Playback');
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

var song = new SoundPlayer('whoop.mp3', SoundPlayer.MAIN_BUNDLE, (error) => {
  if (error) {
    alert('Sound failed');
  }
});

export default class MessageModal extends React.Component {
  static navigationOptions = {
    header:null
  };

  componentDidMount() {
   // this.props.navigation.state.params.onNavigateBack(this.state.foo)
    song.play();
  };


  //new code
  constructor(props) {
    super(props);
    this.state = {
      message: this.props.navigation.getParam('selectedMsg',''), // Sets the value of the message to the text of previous string if it's for forwarded msg else make it null
      selectedContacts: [],
      selectedGroups: [],
      selectedString: 'Empty',
      loading: false,
      status: 'Read',
      msg_id : this.props.navigation.state.params.item.id,
     // onNavigate : this.props.navigation.state.params.onNavigateBack
    //  receipt_id : this.props.navigation.getParam('receipt_id','')
    }
    //console.log("FIAN :"+ onNavigate)
    this.handler = require('../DB.js')
  };



  

  handleError(){
    alert('Error sending message')
  }

  processUserIds(user_ids){
    return 'To: ' + this.state.selectedString.replace('\n', ', ')
  }

  

  postMessage(user_id, session_token, status, timestamp, sender_id, msg_guid){
    // console.log('contacts')
    // console.log(JSON.stringify(recp_id_list))
    // console.log('groups')
    // console.log(JSON.stringify(recp_grp_id_list))
    // recp_id_list = this.process_recp_list(recp_id_list)
    // recp_grp_id_list = this.process_recp_list(recp_grp_id_list)
    // console.log('processed grp id list')
    // console.log(JSON.stringify(recp_grp_id_list))
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/messages', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
         user_id: user_id,
       //  session_token: session_token,
         status: status,
         timestamp : timestamp,
         sender_id : sender_id,
         msg_guid : msg_guid
        // list_of_user_ids: recp_id_list,
        // list_of_off_network_ids: "",
        // list_of_group_ids: recp_grp_id_list,
        // message_text: msg_txt
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('NEW response')
      console.log(JSON.stringify(responseData))
      if(responseData.Failed){
        this.handleError()
        return
      }
      // var new_message_id = responseData.guid
      // var timestamp = responseData.timestamp
      // var user_ids = responseData.list_of_user_ids
      // console.log('guid: ' + new_message_id)
      // console.log('timestamp: ' + timestamp)
      // console.log('user_ids: ' + user_ids)
      console.log('response STATUS : ' + JSON.stringify(responseData))
    //  this.insertNewMessage(new_message_id, msg_txt, user_ids, timestamp)
    //  ToastAndroid.show('Message has been sent!',ToastAndroid.LONG)
     // this.props.navigation.navigate('Feed');
    }).catch((error) => {
      alert("Network issue occurred... Please try again.")
      console.error(error)
    })
  }

  send_message(){
   // console.log("GETTING CALLED 01 : ")
    var user_id = this.handler.getUserId()
    //console.log("NEW 900 : "+ user_id)
    var session_token = this.handler.getSessionToken()
    this.postMessage(user_id, session_token ,this.state.status,this.props.navigation.state.params.item.timestamp,this.props.navigation.state.params.item.sender_id, this.props.navigation.state.params.item.id )
  }
  //new code


  componentWillUnmount() {
    //this.props.navigation.state.params.onNavigateBack(this.state.foo)
    song.stop();

  };

  onPressReply(){
    const { params } = this.props.navigation.state;
    this.props.navigation.navigate('SendMessageModal', {selectedString: params.item.title.slice(6,params.item.title.length), selectedContacts: params.item.sender_id})
  }

  render_sent(){
    const { params } = this.props.navigation.state;
    return (
      <View style={styles.container}>
      <View style={{flex:.9}}>
      {/* <View stlye={{flex: 1, alignItems:'center'}}>
      <Image source={require('../images/chatIcon.png')} style={{width: 90, height: 80, resizeMode:'contain', alignSelf:'flex-end', marginRight:120}} />

      </View> */}
      <Text style={styles.top}>Whoop!!!</Text>
      <Text style={styles.title}>{params.item.title}</Text>
      <Text style={styles.text}>{params.item.text}</Text>
      </View>
      <View style={styles.footer}>
      <Text style={styles.sponsor}>Sponsored By</Text>
      <Image
        style={{width: 70, height: 70}}
        source={require('./../images/img_sponsor_gst.jpg')}
      />
      </View>
      </View>
    )
  }

  render() {
    BackAndroid.addEventListener("hardwareBackPress", () => {
      this.props.navigation.state.params.onNavigateBack(this.state.message)
    })
    

    // console.log("NEW 6 @ : " + this.state.receipt_id)
    const { params } = this.props.navigation.state;
    if(!params.item.sender_id){
      return this.render_sent();
    } else {
      this.send_message();
    return (
      <View style={styles.container}>
      <View style={{flex:.9}}>
      <Text style={styles.top}>Whoop!!!</Text>
      <Text style={styles.title}>{params.item.title}</Text>
      <Text style={styles.text}>{params.item.text}</Text>
      </View>
      <View style={styles.footer}>
      <TouchableHighlight style={styles.button} onPress={this.onPressReply.bind(this)}><Text>Reply</Text></TouchableHighlight>
      <Text style={styles.sponsor}>Sponsored By</Text>
      <Image
        style={{width: 70, height: 70}}
        source={require('./../images/img_sponsor_gst.jpg')}
      />
      </View>
      </View>
    )
    }
  };
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 60,
    paddingHorizontal: 30
  },
  footer: {
    alignItems: 'center'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    marginBottom: 10,
  },
  top: {
    alignItems: 'center',
    fontSize: 60,
    //marginTop:5,
    color: '#500000',
    fontWeight: 'bold',
    textAlign: 'center'
    
  },
  title: {
    paddingLeft: 15,
    marginTop: 15,
    fontSize: 15,
    color: '#fff',
    alignItems: 'center',
  //  fontWeight: 'bold',
    marginBottom: 10,
    backgroundColor: '#500000',
    borderRadius: 15,

  },
  text: {
    paddingTop: 10,
    marginTop: 15,
    paddingLeft: 15,
    fontSize: 15,
    color: '#fff',
    //textAlign: 'center',
   // fontWeight: 'bold',
    marginBottom: 10,
    height: Dimensions.get('window').height - 550,
    width: Dimensions.get('window').width - 100,
    backgroundColor:'#500000',
    borderRadius: 20,
  },
  sponsor: {
    fontSize: 16,
    color: '#500000',
    fontWeight: 'bold',
    marginBottom: 10
  }
});
