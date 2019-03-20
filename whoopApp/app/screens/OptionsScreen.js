import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableHighlight,
  Switch,
  Button
} from 'react-native';
import Dimensions from 'Dimensions';

export default class Options extends React.Component {
  static navigationOptions = {
    title: 'WHOOP!!!',
    headerStyle: {
      backgroundColor: '#500000'
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      fontSize: 24
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      sounds: true,
      messages: true
    };
  };

onPress = () => {
  this.props.navigation.navigate('SendMessageModal', {selectedContacts: '74', selectedGroups: '', 'selectedString': 'Support'});
}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.container1}>
          <Text style={styles.description}>Mute Sounds    </Text>
          <Switch
            value={this.state.sounds}
            onValueChange={sounds => this.setState({sounds})} />
        </View>
        {/* <View style={styles.container1}>
          <Text style={styles.description}>Hide Messages</Text>
          <Switch
            value={this.state.messages}
            onValueChange={messages => this.setState({messages})} />
        </View> */}
        <View style={styles.container2}>
          <TouchableHighlight
            style={styles.button}
            onPress={this.onPress}
            underlayColor='#565656' >
            <Text> REPORT BUG </Text>
          </TouchableHighlight>
          <Text>v0.11.6</Text>
        </View>
      </View>
    );
  };
}

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    marginTop: 10
  },
  container1: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  container2: {
    alignItems: 'center'
  },
  toggles: {
    marginHorizontal: 30
  },
  support: {
    marginTop: 30,
    marginHorizontal: 16,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    backgroundColor: '#500000'
  },
  tabBar: {
    borderTopColor: 'black',
    backgroundColor: 'white',
    opacity: 0.98
  },
  button: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#C0C0C0',
    marginTop: DEVICE_HEIGHT - 300,
    marginBottom:10
  },
  description: {
    marginHorizontal: 20,
    fontSize: 24,
    textAlign: 'left',
    color: '#565656',
  },
  input: {
    marginBottom: 20,
    fontSize: 24,
    textAlign: 'left',
    color: '#565656',
    fontWeight: 'bold',
    marginHorizontal: 20,
    paddingLeft: 10,
    backgroundColor: '#ffffff',
    borderRadius: 20
  },
  title: {
    marginBottom: 20,
    fontSize: 30,
    textAlign: 'center',
    color: '#000000',
    fontWeight: 'bold'
  }
});
