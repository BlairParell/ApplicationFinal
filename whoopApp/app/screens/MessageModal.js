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
      <Text style={styles.top}>WHOOP!!!</Text>
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
      <Text style={styles.top}>WHOOP!!!</Text>
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
    backgroundColor: '#500000',
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
    fontSize: 50,
    marginTop:10,
    color: '#fff',
    fontWeight: 'bold'
  },
  title: {
    fontSize: 20,
    color: '#fff',
    alignItems: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10
  },
  sponsor: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10
  }
});
