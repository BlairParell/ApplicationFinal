import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Text
} from 'react-native';

export default class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
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
    var e;
    try {
      e = await AsyncStorage.getItem('email_address');
    } catch (error) {
      this.props.navigation.navigate('Auth');
    }
    if (e) {
      var p = await AsyncStorage.getItem('password');

      this._autoSignInFetch(e,p);
    } else {
      this.props.navigation.navigate('Auth');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large'/>
        <StatusBar barStyle="default" />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#500000'
  }
})
