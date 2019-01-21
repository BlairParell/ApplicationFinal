import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  TouchableHighlight,
  ListView,
  AsyncStorage,
  KeyboardAvoidingView,
  NativeModules
} from 'react-native';
import Dimensions from 'Dimensions';
import { StackNavigator } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class LogIn extends React.Component {
  static navigationOptions = {
    title: 'WHOOP!!! APP',
    headerStyle: {
      backgroundColor: '#530100'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontSize: 20
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
      email_address: '',
      firstName: '',
      lastName: '',
      mobile_no: '',
      user_id: '',
      isLoading: false,
      jsonData: [],
      SESSION_KEY : '',
      isAutoLogin: true
    };
    this.handler = require('../DB.js')
    this._autoSignIn();
  };

  async _autoSignInFetch(e, p) {
    var array = [];
    console.log('e = ', e);
    console.log('p = ', p);
    try {
      await fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/authentication', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: e,
          password: p
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        for (let prop in responseData) {
          array.push(responseData[prop]);
        }
        console.log("responseData = ", responseData);
        console.log("array = ", array);
      })
      .catch((error) => {
        alert("Network issue occurred... Please try again.")
        console.error(error)
      })
    } catch (error) {
      console.error(error);
      alert("Network issue occurred... Please try again.")
    }
    if (array[0] == true) {
      return 0;
    }
    try {
    } catch (error) {
      console.error(error);
      alert("Network issue occurred... Please try again.")
    }
    if (array[0] == false) {
      await AsyncStorage.setItem('user_id', array[1]['user_id']);
      await AsyncStorage.setItem('SESSION_KEY', array[2]['session_token']);
      this.handler.setSessionToken(array[2]['session_token'])
      this.handler.setUserId(array[1]['user_id'])
      this.handler.loadContacts(()=>{})//empty callback
      this.handler.loadGroups(()=>{})
    //  NativeModules.FirebaseModule.getFBCMtoken((tst)=>{this.handler.postFCMToken(tst)})
      this.props.navigation.navigate('App', {}, {
        type:"Navigate",
        routeName: "AppStack",
        params: {
          e: e,
          p: p,
          f: array[1]['first_name'],
          l: array[1]['last_name'],
          m: array[1]['mobile_no'],
          u: array[1]['user_id'],
          s: array[2]['session_token']
        }
      });
    } else {
      this.props.navigation.navigate('Auth');
    }
  }

  async _autoSignIn() {
    await AsyncStorage.setItem('blur', 'false');
    var e = await this.handler.getEmail()
    if(!e){
      this.setState({ isAutoLogin: false })
      console.log('no email so no autologin')
      return
    }
    var p = await this.handler.getPassword()
    if(!p){
      console.log('no password so no autologin')
      this.setState({ isAutoLogin: false })
      return
    }
    console.log('signing in with : ')
    console.log('email: ' + e)
    console.log('password: ' + p)
    this._autoSignInFetch(e, p)
    /*
    var e;
    try {
      e = await AsyncStorage.getItem('email_address');
    } catch (error) {
      this.setState({ isAutoLogin: false });
    }
    if (e) {
      var p = await AsyncStorage.getItem('password');
      this._autoSignInFetch(e,p);
    } else {
        this.setState({ isAutoLogin: false });
      //this.props.navigation.navigate('Auth');
    }
    */
  };

  async fetchData() {
    var array = [];
    console.log('this.state.email_address = ', this.state.email_address);
    console.log('this.state.password = ', this.state.password);
    const e = this.state.email_address;
    const p = this.state.password;
    console.log('e = ', e);
    console.log('p = ', p);
    try {
      await fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/authentication', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: e,
          password: p
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        for (let prop in responseData) {
          array.push(responseData[prop]);
        }
        console.log("responseData = ", responseData);
        console.log("array = ", array);
      })
      .catch((error) => {
        alert("Network issue occurred... Please try again.")
        console.error(error)
      })
    } catch (error) {
      console.error(error);
      alert("Network issue occurred... Please try again.")
    }
    if (array[0] == true) {
      return 0;
    }
    try {
      this.setState({
        firstName: array[1]['first_name'],
        lastName: array[1]['last_name'],
        mobile_no: array[1]['mobile_no'],
        user_id: array[1]['user_id'],
        SESSION_KEY: array[2]['session_token']
      });
    } catch (error) {
      console.error(error);
      alert("Network issue occurred... Please try again.")
    }
    if (array[0] == false) {
      await this.handler.setEmail(e)
      await this.handler.setPassword(p)
      await this.handler.setSessionToken(this.state.SESSION_KEY)
      console.log('setting session token')
      await this.handler.setUserId(this.state.user_id)
      //await AsyncStorage.setItem('email_address', e);
      //await AsyncStorage.setItem('password', p);
      await AsyncStorage.setItem('mobile_no', this.state.mobile_no);
      await AsyncStorage.setItem('user_id', this.state.user_id);
      await AsyncStorage.setItem('firstName', this.state.firstName);
      await AsyncStorage.setItem('lastName', this.state.lastName);
      await AsyncStorage.setItem('SESSION_KEY', this.state.SESSION_KEY);
      NativeModules.FirebaseModule.getFBCMtoken((tst)=>{this.handler.postFCMToken(tst)})
      return 1;
    } else {
      return 0;
    }
  }

  async _authenticate () {
    var hasAccount = await this.fetchData();
    this.setState({ isLoading: false});
    if (hasAccount == 1) {
      this.props.navigation.navigate('App', {
        e: this.state.email_address,
        p: this.state.password,
        f: this.state.lastName,
        l: this.state.firstName,
        m: this.state.mobile_no,
        u: this.state.user_id,
        s: this.state.SESSION_KEY
      });
    } else { alert("Invalid email/password"); }
  };

  _onLOGINPressed = async() => {
    this.setState({ isLoading: true });
    this._authenticate();
  };

  render() {

    return (
      <View style={{flex:1}}>
      <KeyboardAwareScrollView
        resetScrollToCoord={{ x:0, y:0 }}
        contentContainerStyle={styles.container}
        scrollEnabled={true}>
        <Text style={styles.title}>
          WHOOP!!!
        </Text>
        <Text style={styles.description}>
          Please Sign In
        </Text>
        <TextInput placeholder='Username/Email'
          returnKeyType={'next'}
          returnKeyLabel={'next'}
          selectionColor={'black'}
          style={styles.input}
          underlineColorAndroid='black'
          onChangeText={(text) => this.setState({email_address:text.toLowerCase().replace(' ', '')})} />
        <TextInput placeholder='Password'
          returnKeyType={'done'}
          returnKeyLabel={'done'}
          selectionColor={'black'}
          style={styles.input}
          underlineColorAndroid='black'
          secureTextEntry={true}
          onChangeText={(text) => this.setState({password:text})} />
        <TouchableHighlight
          style={styles.button1}
          onPress={this._onLOGINPressed}
          underlayColor='#565656' >
          <Text style={{fontWeight:'bold',color:'#000'}}> LOGIN </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.navigate('ForgotPassword')}
          underlayColor='#565656' >
          <Text style={{fontWeight:'bold',color:'#000'}}> FORGOT PASSWORD </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.button}
          onPress={() => this.props.navigation.navigate('SignUp')}
          underlayColor='#565656' >
          <Text style={{fontWeight:'bold',color:'#000'}}> SIGN UP </Text>
        </TouchableHighlight>

      </KeyboardAwareScrollView>
      {this.state.isLoading &&
        <View style={styles.isLoading}>
          <ActivityIndicator size='large' />
        </View>
      }
      {this.state.isAutoLogin &&
        <View style={styles.isLoading}>
          <ActivityIndicator size='large' />
        </View>
      }
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  button1: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: DEVICE_WIDTH - 100,
    marginBottom: 10,
    marginTop: 20
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: DEVICE_WIDTH - 100,
    marginBottom: 10,
  },
  description: {
    fontSize: 20,
    textAlign: 'center',
    color: '#696969'
  },
  isLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center',
    flex:1
  },
  input: {
    marginBottom: 5,
    fontSize: 20,
    textAlign: 'center',
    color: '#000',
    width: DEVICE_WIDTH - 100,
    marginHorizontal: 20,
    paddingLeft: 10
  },
  title: {
    marginVertical: 20,
    fontSize: 40,
    textAlign: 'center',
    color: '#500000',
    fontWeight: 'bold'
  }
});
