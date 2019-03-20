import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image
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
    song.play();
  };

  componentWillUnmount() {
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
    const { params } = this.props.navigation.state;
    if(!params.item.sender_id){
      return this.render_sent();
    } else {
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
