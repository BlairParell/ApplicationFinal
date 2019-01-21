import React from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ForgotPassword extends React.Component {
  static navigationOptions = {
    title: 'Forgot Password',
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
      email_address: ''
    };
  };

  async fetchData(email) {
    try {
      console.log("email = ", email);
      await fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/rstpwd', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: email
        })
      })
      .then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData = ", responseData)
        if(responseData.Failed){
          alert('sending email failed')
        }
      })
      .catch((error) => {
        console.log(error)
      })
    } catch (error) {
      console.log("error:", error);
      alert("Error sending request.");
    }
    alert("Please wait until you receive an email with further instructions to reset your password.")
  };

  async _authenticate(email) {
    await this.fetchData(email);
  }

  _changePassword = () => {
    var email = this.state.email_address;
    this._authenticate(email);
  };

   _changeText(text) {
    this.setState({email_address:text.toLowerCase()});
    console.log("email_address in changeText = ", this.state.email_address)
  };

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoord={{ x:0, y:0 }}
        scrollEnabled={true}>
        <View style={styles.container}>
        <Text style={styles.title}>
          Forgot your password?
        </Text>
        <Text style={styles.description}>
          Enter your email address and we{`'`}ll send you a link to automatically sign in. Once signed in, you{`'`}ll be prompted to change your password if you wish.
        </Text>
        </View>
        <View style={{marginHorizontal:14}}>
        <Text style={styles.text}>Email Address</Text>
        </View>
        <View style={styles.container2}>
        <TextInput
          returnKeyType={'done'}
          style={styles.input}
          returnKeyLabel={'done'}
          underlineColorAndroid='#fff'
          onChangeText={(text) => this.setState({email_address:text.toLowerCase().replace(' ', '')})} />
        <TouchableHighlight
          style={styles.button}
          underlayColor='#565656'
          onPress={this._changePassword} >
          <Text> Send </Text>
        </TouchableHighlight>
        </View>
      </KeyboardAwareScrollView>
    );
  };
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container2: {
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD'
  },
  text: {
    textAlign: 'left',
    color: '#000'
  },
  description: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    color: '#353333',
    fontWeight: 'bold'
  },
  input: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'left',
    color: '#000',
    width: DEVICE_WIDTH - 30,
    height: 40,
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 5
  },
  title: {
    marginVertical: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
