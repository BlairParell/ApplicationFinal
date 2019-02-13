import React from 'react'
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button
} from 'react-native';
import Dimensions from 'Dimensions';

export default class AddContactModal extends React.Component {
  constructor(props){
    super()
    this.handler = require('../DB.js')
    this.state = {
      email: ''
    }
  }

  addContact(){
    fetch('https://n4dwn5g227.execute-api.us-east-2.amazonaws.com/testing/contacts', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: this.handler.getUserId(),
        session_token: this.handler.getSessionToken(),
        email_address: this.state.email
      })
    }).then((response) => response.json())
    .then((responseData) => {
      console.log(JSON.stringify(responseData))
      //first, last, handle, id
      this.handler.addContact(responseData.user_info.first_name, responseData.user_info.last_name, responseData.user_info.handle, responseData.user_info.id)
      this.props.navigation.navigate('Network')
    })
  }

  render(){
    return (
      <View style={styles.container}>
      <Text style={styles.text}>Email Address of New Contact</Text>
      <TextInput
        onChangeText={(text) => this.setState({email: text})}
        underlineColorAndroid='transparent'
        style={styles.input} />
      <Button
        onPress={() => {this.addContact()}}
        title="Done"
      />
      </View>
    )
  }
}
  const DEVICE_WIDTH = Dimensions.get('window').width;

  const styles = StyleSheet.create({
    container: {
      paddingLeft: 15,
      paddingRight: 15,
      paddingTop: 15,
      alignItems: 'flex-start',
      justifyContent: 'flex-start'
    },
    text: {
      textAlign: 'left',
      color: '#000'
    },
    input: {
      marginBottom: 10,
      textAlign: 'left',
      color: '#000',
      width: DEVICE_WIDTH - 30,
      height: 40,
      paddingLeft: 10,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 5
    }
  })
