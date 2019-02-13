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
import EditProfileButton from '../customButtons/EditProfileButton';
import MenuContactsButton from '../customButtons/MenuContactsButton';
import SendMailButton from '../customButtons/SendMailButton';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

export default class DropDown extends React.Component {
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
//      if (his.props.feed) {
//         call backdrop here
//      }
      this.props.navigation.navigate('OptionsModal');
    } else {
      await AsyncStorage.clear();
      this.props.navigation.navigate('Auth');
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
    }
  }

  _onPress = () => {

  };

  render() {
    const feedButton = this.props.feed ? <SendMailButton navigation={this.props.navigation}/> : null;
    const networkButton = this.props.network ? <MenuContactsButton navigation={this.props.navigation} set={this.props.set} release={this.props.release} /> : null;
    const profileButton = this.props.profile ? <EditProfileButton navigation={this.props.navigation}/> : null;
    const title= this.props.title ? this.props.title : 'WHOOP!!!';
   	return (
     		<View style={styles.container}>
          <Text style={styles.text}>{title}</Text>

          {feedButton}
          {networkButton}
          {profileButton}

     			<ModalDropdown options={['Settings','Sign Out']}
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
   	);
  }
};

/*
<TouchableHighlight onPress={this._onPress} style={styles.editProfileStyle}>
  <Image
    style={{width: 26, height: 26}}
    source={require('./../images/edit_white.png')}
  />
</TouchableHighlight>
<TouchableHighlight onPress={this._onPress} style={styles.menuContactStyle}>
  <Image
    style={{width: 26, height: 26}}
    source={require('./../images/person_add.png')}
  />
</TouchableHighlight>*/


const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    marginTop: Platform.OS == "ios" ? 20 : 0,
    backgroundColor: '#500000'
  },
  text: {
    marginTop: 10,
    marginLeft: 10,
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  dropdown_1: {
    flex:1,
    height: 30,
  },
  button: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
    marginLeft: DEVICE_WIDTH - 180
  },
  dropdown_1_text: {
    fontSize: 20,
    color: '#000'
  },
  dropdown_2: {
  	flex:1,
    alignSelf: 'flex-end',
    height:96
  },
  editProfileStyle: {
    alignSelf: 'flex-end'
  },
  menuContactStyle: {
    alignSelf: 'flex-end'
  }
});
