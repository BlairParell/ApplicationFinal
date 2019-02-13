import ModalDropdown from 'react-native-modal-dropdown';
import PopupDialog from 'react-native-popup-dialog'
import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Image,
  Platform,
  AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export default class MenuContactsButton extends Component {
  constructor(){
    super()
    this.popupDialog = null
  }
  _onPress = () => {
    alert('Needs to be implemented');
  //  this.props.navigation.navigate('MenuContactsModel');
  };

  dropdownAdjustFrame(style) {
    this.props.set();
		style.top -= DEVICE_HEIGHT/22;
		style.left += DEVICE_WIDTH/3.43;
//    this.props.release();
	};

  async _dropdownOptions(idx, value) {
    //await AsyncStorage.setItem('blur', 'true');
    if (idx == 0) {
      //this.props.navigation.navigate('OptionsModal');
      this.props.navigation.navigate('AddContactModal');
      //alert('Need to Implement Testing');
    } else {
      //alert('Need to implement');
      /*
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
      });*/
    }
    await AsyncStorage.setItem('blur','false');
    this.props.release();
    return false

    // need to put this somewhere else to detect whenever
    // any other part of the screen is pressed (possibly whenever a rerender happens?)
  }

  render() {
    return (
      <View style={styles.button}>
      <ModalDropdown options={['New Contact', 'New Group', 'Import Contacts']}
        dropdownTextStyle={styles.dropdown_1_text}
        style={styles.dropdown_1}
        dropdownStyle={styles.dropdown_2}
        onSelect = {(idx, value) => this._dropdownOptions(idx, value)}
        onDropdownWillHide = {()=>{this.props.release()}}
        adjustFrame={style=> this.dropdownAdjustFrame(style)}>
        <Image
          style={{width:26,height:26}}
          source={require('./../images/person_add.png')}
        />
      </ModalDropdown>

      </View>
    );
  }
}

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
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 11,
    marginLeft: DEVICE_WIDTH - 185
  },
  dropdown_1_text: {
    fontSize: 20,
    color: '#000'
  },
  dropdown_2: {
    backgroundColor: '#F5FCFF88',
    marginTop: DEVICE_HEIGHT / 2 - 72,
    alignSelf: 'center',
    justifyContent: 'center',
    height:144,
    width:DEVICE_WIDTH - 60
  }
});
