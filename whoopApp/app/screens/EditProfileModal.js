'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
  Button,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import Dimensions from 'Dimensions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PopupDialog from 'react-native-popup-dialog';

export default class EditProfileModal extends React.Component {
  static navigationOptions = {
    title: 'Profile',
    headerTintColor: '#fff',
    headerStyle: {
      backgroundColor: '#500000'
    },
    headerLeft: null,
    headerTitleStyle: {
      fontSize: 24
    },
  };

  constructor(props) {
    super (props);
    this.state = {
      warning: false,
      newPassword: '',
      password: '',
      e: '',
      p: '',
      p2: '',
      f: '',
      l: '',
      m: '',
      waiting: false
    };
    this.handler = require('../DB.js')
  }

  async componentDidMount() {
    var e = await AsyncStorage.getItem('email_address');
    var p = await AsyncStorage.getItem('password');
    var f = await AsyncStorage.getItem('firstName');
    var l = await AsyncStorage.getItem('lastName');
    var m = await AsyncStorage.getItem('mobile_no');
    this.setState({
      e: e,
      password: p,
      f: f,
      l: l,
      m: m
    });
  }

  static navigatorStyle= {
    navBarBackgroundColor: '#500000',
    navBarTextColor: '#fff',
    navBarTextFontSize: 24
  }

  changePassword(newPassword){
    this.setState({waiting: true})
    console.log('new password: ' + newPassword)
    console.log('changing password')
    var session_token = this.handler.getSessionToken()
    var email_address = this.state.e
    console.log('email_address: ' + email_address)
    var user_id = this.handler.getUserId()
    console.log('user_id: ' + user_id)
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/chpwd', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address: email_address,
        user_guid: user_id,
        new_password: newPassword,
        session_token: session_token
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('response')
      console.log(JSON.stringify(responseData))
      this.handler.logout()
      this.props.navigation.navigate('LogIn')
    })
  }

  onPress() {
    console.log('p: ' + this.state.p)
    console.log('p2: ' + this.state.p2)
    console.log('password: ' + this.state.password)
    if(this.state.p == this.state.p2 && this.state.p == this.state.password){
      this.popupDialog.show()
      this.setState({
        warning: false
      })
    } else {
      var tmp = this.state.warning
      this.setState({
        warning: true
      })
    }
  }

  render() {
    return (
      <View>
      <KeyboardAwareScrollView
        resetScrollToCoord={{x:0,y:0}}
        scrollEnabled={true}>
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.text}>First Name</Text>
          <TextInput
            onChangeText={(text) => this.setState({f:text})}
            underlineColorAndroid='transparent'
            value={this.state.f}
            style={styles.input} />
            <View style ={styles.inputLine}>
            </View>
          <Text style={styles.text}>Last Name</Text>
          <TextInput
            onChangeText={(text) => this.setState({l:text})}
            underlineColorAndroid='transparent'
            value={this.state.l}
            style={styles.input} />
            <View style ={styles.inputLine}>
            </View>
          <Text style={this.state.warning ? styles.warning : styles.text}>Current Password</Text>
          <TextInput
            secureTextEntry={true}
            onChangeText={(text) => this.setState({p:text})}
            underlineColorAndroid='transparent'
            style={styles.input} />
            <View style ={styles.inputLine}>
            </View>
          <Text style={this.state.warning ? styles.warning : styles.text}>Confirm Password</Text>
            <TextInput
              secureTextEntry={true}
              onChangeText={(text) => this.setState({p2:text})}
              underlineColorAndroid='transparent'
              style={styles.input} />
              <View style ={styles.inputLine}>
            </View>
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            onChangeText={(text) => this.setState({e:text})}
            underlineColorAndroid='transparent'
            value={this.state.e}
            style={styles.input} />
            <View style ={styles.inputLine}>
            </View>
          <Text style={styles.text}>Mobile Number (only digits)</Text>
          <TextInput
            onChangeText={(text) => this.setState({m:text})}
            underlineColorAndroid='transparent'
            value={this.state.m}
            style={styles.input} />
            <View style ={styles.inputLine}>
            </View>
          </View>
          <View style={styles.container2}>
          <TouchableHighlight
            style={styles.button1}
            onPress={()=>{this.onPress()}}
            underlayColor='#565656'>
            <Text style={styles.buttonText1}>CHANGE PASSWORD</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button2}
            onPress={this.onPress}
            underlayColor='#565656'>
            <Text style={styles.buttonText2}>DEACTIVATE MY ACCOUNT</Text>
          </TouchableHighlight>
        </View>
        </View>
      </KeyboardAwareScrollView>
      <PopupDialog
        ref={(popupDialog) => { this.popupDialog = popupDialog; }}
      >
      <View style={styles.container2}>
      <Text style={styles.text}>New Password</Text>
      <TextInput
        onChangeText={(text) => {this.setState({newPassword: text})}}
        underlineColorAndroid='transparent'
        value={this.state.newPassword}
        style={styles.input} />
      <Button
        title="Done"
        onPress={() => {this.changePassword(this.state.newPassword)}}
      />
      </View>
      {this.state.waiting &&
        <ActivityIndicator size='large' />
      }
  </PopupDialog>
      </View>
    );
  };
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor:'#ffffff',
    height: DEVICE_HEIGHT
  },
  container: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  container2: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  button1: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#500000',
    width: 200,
    borderRadius: 25,
    marginBottom: 10, 
    height: 50
  },
  button2: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f53229',
    width: 200,
    borderRadius: 25,
    marginBottom: 10, 
    height: 50
  },
  warning: {
    textAlign: 'left',
    color: '#FF0000'
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    color: '#500000',
    paddingLeft:8,
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 10,
    fontSize: 15,
    textAlign: 'left',
    color: '#000',
    width: DEVICE_WIDTH - 30,
    height: 40,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5, 
    borderColor: '#ffffff',
  },
  inputLine:{
    width: DEVICE_WIDTH - 70,
    backgroundColor:'#500000',
    height: 0.7,
    marginLeft: 10,
    marginTop: -15,
    marginBottom: 15,
    borderColor:'#500000'

  },
  buttonText1: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  buttonText2: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  }
});
