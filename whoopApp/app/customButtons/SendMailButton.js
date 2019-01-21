import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image
} from 'react-native';

import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  button: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
    marginLeft: DEVICE_WIDTH - 185
  },
});

export default class SendMailButton extends React.Component {
  constructor(props) {
    super(props);
  };

  _onPress = () => {
    this.props.navigation.navigate('SendMessageModal');
  };

  render() {
    return (
      <View style={styles.button}>
        <TouchableHighlight onPress={this._onPress}>
          <Image
            style={{width: 40, height: 40}}
            source={require('./../images/send_mail.png')}
          />
        </TouchableHighlight>
      </View>
    )
  }
}
