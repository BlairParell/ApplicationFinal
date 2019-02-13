'use strict';

import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  ScrollView,
  AsyncStorage
} from 'react-native';
import Dimensions from 'Dimensions';
import DropDown from '../customButtons/DropDownButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class Profile extends React.Component {
static navigationOptions = ({navigation}) => ({
  header: <DropDown navigation={navigation}
    feed={false}
    network={false}
    profile={true}
  />
});

  constructor(props) {
    super (props);
    this.state = {
      e: '',
      p: '',
      f: '',
      l: '',
      m: '',
      u: '',
      s: ''
    };
  }

  async componentDidMount() {
    var e = await AsyncStorage.getItem('email_address');
    var p = await AsyncStorage.getItem('password');
    var f = await AsyncStorage.getItem('firstName');
    var l = await AsyncStorage.getItem('lastName');
    var m = await AsyncStorage.getItem('mobile_no');
    var u = await AsyncStorage.getItem('user_id');
    var s = await AsyncStorage.getItem('SESSION_KEY');
    this.setState({
      e: e,
      p: p,
      f: f,
      l: l,
      m: m,
      u: u,
      s: s
    })
  }

  static navigatorStyle= {
    navBarBackgroundColor: '#500000',
    navBarTextColor: '#fff',
    navBarTextFontSize: 24
  }

  onPress() {
    alert("Feature under construction.");
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoord={{x:0,y:0}}
        scrollEnabled={true}>
      <View style={styles.container}>
        <Text style={styles.text}> First Name </Text>
        <TextInput placeholder='First Name'
          editable={false}
          value={JSON.stringify(this.state.f).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
        <Text style={styles.text}> Last Name </Text>
        <TextInput placeholder='Last Name'
          editable={false}
          value={JSON.stringify(this.state.l).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
        <Text style={styles.text}> Email Adress </Text>
        <TextInput placeholder='Email Address'
          editable={false}
          value={JSON.stringify(this.state.e).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
        <Text style={styles.text}> Mobile Number (only digits) </Text>
        <TextInput placeholder='Mobile Number'
          editable={false}
          value={JSON.stringify(this.state.m).replace(/['"]+/g, '')}
          returnKeyType={'done'}
          returnKeyLabel={'done'}
          underlineColorAndroid='#fff'
          style={styles.input} />
        </View>
        <View>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPress}
          underlayColor='#565656' >
          <Text style={{color:'white'}}> SHARE MY AGGIE PRIDE </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPress}
          underlayColor='#565656' >
          <Text style={{color:'white'}}> MANAGE MY DEVICES </Text>
        </TouchableHighlight>
        </View>
      </KeyboardAwareScrollView>
    );
  };
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  tabBar: {
    borderTopColor: 'black',
    backgroundColor: 'white',
    opacity: 0.98
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#500000',
    marginHorizontal:50,
    marginBottom: 3
  },
  description: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#565656',
    fontWeight: 'bold'
  },
  text: {
    fontSize: 16,
    textAlign: 'left',
    color: 'black'
  },
  input: {
    marginBottom: 10,
    fontSize: 14,
    textAlign: 'left',
    color: '#500000',
    width: DEVICE_WIDTH - 30,
    height: 36,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5
  },
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
