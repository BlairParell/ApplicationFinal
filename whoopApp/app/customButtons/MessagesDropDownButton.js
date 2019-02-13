import ModalDropdown from 'react-native-modal-dropdown';
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  AsyncStorage,
  Platform
} from 'react-native';
import Dimensions from 'Dimensions';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class MessagesDropDown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      feed: false,
      network: false,
      profile: false
    };
  };

	dropdownAdjustFrame(style) {
		style.top -= DEVICE_HEIGHT/22;
		style.left += DEVICE_WIDTH/3.43;
	};

  async _dropdownOptions(idx, value) {
    if (idx == 0) {
      this.props.navigation.navigate('OptionsModal');
    } else {
      var u = await AsyncStorage.getItem('user_id');
      var s = await AsyncStorage.getItem('SESSION_KEY');
      await fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/signout', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: u,
          session_token: s
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData = ", responseData);
      })
      .catch((error) => {
        console.log(error);
      });
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
    }
  }

  _onPress = () => {

  };

  render() {
   	return (
     		<View style={styles.container}>
          <Text style={styles.text}>Send WHOOP!!!</Text>
          <View style={styles.button}>
     			<ModalDropdown options={['Preview']}
     				dropdownTextStyle={styles.dropdown_1_text}
     				style={styles.dropdown_1}
     				dropdownStyle={styles.dropdown_2}
            onSelect = {(idx, value) => this._dropdownOptions(idx, value)}
     				adjustFrame={style=> this.dropdownAdjustFrame(style)}>
     				<Image
     					style={{width:50,height:50}}
     					source={require('./../images/three_dots.png')}
     				/>
     			</ModalDropdown>
          </View>

	     	</View>
   	);
  }
};

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
    marginTop: Platform.OS == "ios" ? 20 : 0,
    backgroundColor: '#500000'
  },
  text: {
    marginTop: 8,
    marginLeft: 10,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  button: {
    width: 26,
    height: 26,
    marginLeft: DEVICE_WIDTH - 195,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dropdown_1_text: {
    fontSize: 20,
    color: '#000'
  },
  dropdown_2: {
  	flex:1,
    alignSelf: 'flex-end',
    height:48
  },
});
