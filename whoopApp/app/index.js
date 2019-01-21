import React, { Component } from 'react';
import { Root } from './config/router';
import { MenuProvider } from 'react-native-popup-menu';
import { Message } from './screens/FeedScreen'
 

class App extends Component {
  render() {
    <MenuProvider >
    <whoopApp />
    </MenuProvider>
    return <Root />;
  }
}

export default App;
