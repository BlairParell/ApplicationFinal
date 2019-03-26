import React from 'react';
import Dimensions from 'Dimensions';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableHighlight,
  Keyboard
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class ForgotPasswordConfirm extends React.Component {
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
  componentDidMount(){
    Keyboard.dismiss()
  }

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
    
    this.props.navigation.navigate('LogIn')
  };

   _changeText(text) {
    this.setState({email_address:text.toLowerCase()});
    console.log("email_address in changeText = ", this.state.email_address)
  };

  render() {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoord={{ x:0, y:0 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps={true}
        >
      <View style={styles.mainContainer}>
        <View style={styles.container}>
        <Text style={styles.title}>
          Your Request has been changed!
        </Text>
        
        <TouchableHighlight
          style={styles.button}
          underlayColor='#565656'
          onPress={this._changePassword} >
          <Text style={{color:'white',fontWeight:'bold',fontSize:16}}> OK </Text>
        </TouchableHighlight>
        </View>
        </View>
      </KeyboardAwareScrollView>
    );
  };
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer:{
    backgroundColor:'#ffffff',
    height: Dimensions.get('window').height
  },
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
    justifyContent: 'center',
    backgroundColor: '#500000',
    marginHorizontal: 100,
    borderRadius: 25,
    marginBottom: 10, 
    height: 50,
    width: DEVICE_WIDTH - 150,
    marginTop: 20,


  },
  text: {
    textAlign: 'center',
    color: '#500000',
    marginBottom: 5,
    fontSize: 18,
    fontWeight:'bold'
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
    width: DEVICE_WIDTH - 100,
    height: 55,
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 5,
    borderColor: '#fff',
    textAlign:'center'


  },
  title: {
    marginVertical: 20,
    fontSize: 24,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
