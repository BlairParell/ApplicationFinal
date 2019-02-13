import React from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableHighlight
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class UserObj{
  constructor(first, last, email, phone, password, confirm, handle){
    this.first = first
    this.last = last
    this.email = email
    this.phone = phone
    this.password = password
    this.confirm = confirm
    this.handle = handle
  }
  // this should check everything with regex
  verify(){
    if(this.password != this.confirm){
      return false
    }
    return true
  }

  print(){
    console.log('user object')
    console.log('first : ' + this.first)
    console.log('last : ' + this.last)
    console.log('email : ' + this.email)
    console.log('phone : ' + this.phone)
    console.log('password : ' + this.password)
    console.log('confim : ' + this.confirm)
    console.log('handle : ' + this.handle)
    console.log('end user object')
  }
}

export default class SignUp extends React.Component {
  static navigationOptions = {
    title: 'Sign Up',
    headerStyle: {
      backgroundColor: '#500000'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 20
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      whoopHandle: '',
      emailAddress: '',
      mobileNo: ''
    };
  }

  postUser(userObj){
    userObj.print()
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/users', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        //get fields from user object
        "email_address": userObj.email,
        "password": userObj.password,
        "first_name": userObj.first,
        "last_name": userObj.last,
        "mobile_no": userObj.phone,
        "handle": userObj.handle
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      this.processNewUser(responseData)
    })
  }

  // process the successfull or failed user post call
  processNewUser(responseData){
    console.log('response from post user call')
    console.log(JSON.stringify(responseData))
    if(responseData.Failed){
      if(responseData.AccountExists){
        alert('Account already exists')
      } else {
        alert('Invalid Input')
        return
      }
    }
    this.props.navigation.navigate('LogIn')
    // redirect to the sign in screen
    // possibly with the username filled in
  }

  // user object does basic verification to speed things up
  // verification is also done on the backend
  onPress = () => {
    var userObj = new UserObj(this.state.firstName, this.state.lastName, this.state.emailAddress,
    this.state.mobileNo, this.state.password, this.state.confirmPassword, this.state.whoopHandle)
    //var userObj = new UserObj("testing", "postUser", "testing@mail.com", "5555555555", "tsting", "tsting", "awesome")
    if(userObj.verify()){
      this.postUser(userObj)
    }
  }

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoord={{x:0,y:0}}
        scrollEnabled={true}>
        <View style={styles.container}>
          <Text style={styles.title}>
            Personal Info
            </Text>
        </View>

        <View style={styles.container2}>
          <Text style={styles.text}>First Name</Text>
          <TextInput
            onChangeText={(text) => this.setState({firstName:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input} />
          <Text style={styles.text}>Last Name</Text>
          <TextInput
            onChangeText={(text) => this.setState({lastName:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input} />
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            onChangeText={(text) => this.setState({emailAddress:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input} />
          <Text style={styles.text}>Phone Number</Text>
          <TextInput
            onChangeText={(text) => this.setState({mobileNo:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input} />
          <Text style={styles.text}>Password</Text>
          <TextInput
            onChangeText={(text) => this.setState({password:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input}
            secureTextEntry={true} />
          <Text style={styles.text}>Confirm Password</Text>
          <TextInput
            onChangeText={(text) => this.setState({confirmPassword:text})}
            selectionColor={'black'}
            returnKeyType={'next'}
            returnKeyLabel={'next'}
            underlineColorAndroid='#fff'
            style={styles.input}
            secureTextEntry={true} />
          <Text style={styles.text}>WHOOP!!! Handle</Text>
          <TextInput
            onChangeText={(text) => this.setState({whoopHandle:text})}
            selectionColor={'black'}
            returnKeyType={'done'}
            returnKeyLabel={'done'}
            underlineColorAndroid='#fff'
            style={styles.input} />
          </View>
          <View>
          <TouchableHighlight
            style={styles.button}
            onPress={this.onPress}
            underlayColor='#565656'>
            <Text style={{fontWeight:'bold'}}> Continue </Text>
          </TouchableHighlight>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    marginTop: DEVICE_HEIGHT / 100,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    padding: 15,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 100
  },
  text: {
    textAlign: 'left',
    color: '#000'
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
    borderRadius: 5
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
