import React from 'react';
import {
  Text,
  FlatList,
  ScrollView,
  View,
  StyleSheet,
  TouchableHighlight,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import DropDown from '../customButtons/DropDownButton';
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

export default class PreviewMessageModal extends React.Component{
  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state;
    return {
      title: 'Message Preview',
      headerStyle: {
        backgroundColor: '#500000'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 20
      }
    }
  }

  render(){
    return(
        <View>
          <Text>Show Message Preview here</Text>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    marginTop: 10,
    flex: 1
  },
  isLoading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    marginBottom: 5,
    fontSize: 24,
    textAlign: 'left',
    color: '#000',
    fontWeight: 'bold'
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
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  loadingText: {
    fontSize:20,
    color:'#000'
  }
});
