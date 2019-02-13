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
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default class AddPersonModal extends React.Component {
  static navigationOptions = {
    title: 'WHOOP!!! APP',
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
    this.handler = require('../DB.js')
    this.params = this.props.navigation.state;
  }

  onPress = () => {
    //alert("Feature under construction");
    console.log('user object')
    const { params } = this.params
    console.log(params.object.id)
    this.handler.postDeleteContact(params.object.id)
    this.props.navigation.navigate('Network')
  }

  render() {
    //const { params } = this.props.navigation.state;
    const { params } = this.params
    return (
      <KeyboardAwareScrollView
        resetScrollToCoord={{x:0,y:0}}
        scrollEnabled={true}>
        <View style={styles.container2}>
          <Text style={styles.text}>First Name</Text>
          <TextInput
            editable={false}
            underlineColorAndroid='transparent'
            value={params.object.first_name}
            style={styles.input} />
          <Text style={styles.text}>Last Name</Text>
          <TextInput
            editable={false}
            underlineColorAndroid='transparent'
            value={params.object.last_name}
            style={styles.input} />
          <Text style={styles.text}>WHOOP!!! Handle</Text>
          <TextInput
            editable={false}
            underlineColorAndroid='transparent'
            value={params.object.handle}
            style={styles.input} />
          <Text style={styles.text}>Email Address</Text>
          <TextInput
            editable={false}
            underlineColorAndroid='transparent'
            value={params.object.email_address}
            style={styles.input} />
          <Text style={styles.text}>Mobile Number (only digits)</Text>
          <TextInput
            editable={false}
            underlineColorAndroid='transparent'
            value={params.object.mobile_no}
            style={styles.input} />
          </View>
          <View>
          <TouchableHighlight
            style={styles.button1}
            onPress={this.onPress}
            underlayColor='#565656'>
            <Text style={{fontWeight:'bold'}}> ADD TO GROUP </Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button2}
            onPress={this.onPress}
            underlayColor='#565656'>
            <Text style={{fontWeight:'bold'}}> DELETE </Text>
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
  button1: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 100,
    marginBottom: 10
  },
  button2: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DDDDDD',
    marginHorizontal: 120
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
