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
     <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.text}> First Name </Text>
        <TextInput placeholder='First Name'
          editable={false}
          value={JSON.stringify(this.state.f).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
          <View style ={styles.inputLine}>
            </View>
        <Text style={styles.text}> Last Name </Text>
        <TextInput placeholder='Last Name'
          editable={false}
          value={JSON.stringify(this.state.l).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
          <View style ={styles.inputLine}>
            </View>
        <Text style={styles.text}> Email Adress </Text>
        <TextInput placeholder='Email Address'
          editable={false}
          value={JSON.stringify(this.state.e).replace(/['"]+/g, '')}
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          underlineColorAndroid='#fff'
          style={styles.input} />
          <View style ={styles.inputLine}>
            </View>
        <Text style={styles.text}> Mobile Number (only digits) </Text>
        <TextInput placeholder='Mobile Number'
          editable={false}
          value={JSON.stringify(this.state.m).replace(/['"]+/g, '')}
          returnKeyType={'done'}
          returnKeyLabel={'done'}
          underlineColorAndroid='#fff'
          style={styles.input} />
          <View style ={styles.inputLine}>
            </View>
        </View>
        <View>
        {/* <TouchableHighlight
          style={styles.button}
          onPress={this.onPress}
          underlayColor='#565656' >
          <Text style={{color:'white', fontWeight:'bold', fontSize: 14}}> Share My Aggie Pride </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={this.onPress}
          underlayColor='#565656' >
          <Text style={{color:'white', fontWeight:'bold',fontSize: 14}}> Manage My Devices </Text>
        </TouchableHighlight> */}
        </View>
        </View>
      </KeyboardAwareScrollView>
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
    marginHorizontal: 100,
    borderRadius: 25,
    marginBottom: 10, 
    height: 50,
    width: "50%"
  },
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#565656',
    fontWeight: 'bold',
    paddingLeft: 10
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
    fontSize: 18,
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
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
