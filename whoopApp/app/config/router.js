import React from 'react';
import { Button, Image, View, Text, TouchableHighlight } from 'react-native';
import { StackNavigator, SwitchNavigator, TabNavigator, TabBarBottom } from 'react-navigation';
import Feed from '../screens/FeedScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LogIn from '../screens/LogInScreen';
import ForgotPassword from '../screens/ForgotPasswordScreen';
import SignUp from '../screens/SignUpScreen';
import Profile from '../screens/ProfileScreen';
import Network from '../screens/NetworkScreen';
import Options from '../screens/OptionsScreen';
import DropDown from '../customButtons/DropDownButton';
import EditProfileButton from '../customButtons/EditProfileButton';
import SendMessageModal from '../screens/SendMessageModal';
import MessageModal from '../screens/MessageModal';
import AddPersonModal from '../screens/AddPersonModal';
import CheckGroupModal from '../screens/CheckGroupModal';
import EditProfileModal from '../screens/EditProfileModal';
import SelectContactsModal from '../screens/SelectContactsModal';
import PreviewMessageModal from '../screens/PreviewMessageModal';
import AddContactModal from '../screens/AddContactModal';
import ForgotPasswordConfirm from '../screens/ForgotPasswordConfirmScreen';

const Tabs = TabNavigator({
	Feed: {
		screen: Feed,
	},
	Network: {
		screen: Network
	},
	Profile: {
		screen: Profile
	}
}, {
	tabBarOptions: {
		activeTintColor: '#fff',
		inactiveTintColor: '#D3D3D3',
		labelStyle: {
			fontSize: 13
		},
		style: {
			backgroundColor: '#500000'
		},
		indicatorStyle: {
			backgroundColor: '#fff'
		}
	}
});

const AuthStack = StackNavigator(
	{
		LogIn: LogIn,
		ForgotPassword: ForgotPassword,
		ForgotPasswordConfirm : ForgotPasswordConfirm,
		SignUp: SignUp
	},
	{
		initialRouteName: 'LogIn'
	}
);

const AppStack = StackNavigator({
	Main: {
		screen: Tabs
	},
  OptionsModal: {
    screen: Options
  },
	SendMessageModal: {
		screen: SendMessageModal
	},
	MessageModal: {
		screen: MessageModal
	},
	AddPersonModal: {
		screen: AddPersonModal
	},
	CheckGroupModal: {
		screen:CheckGroupModal
	},
	EditProfileModal: {
		screen:EditProfileModal
	},
	SelectContactsModal: {
		screen:SelectContactsModal
	},
	PreviewMessageModal: {
		screen:PreviewMessageModal
	},
	AddContactModal: {
		screen:AddContactModal
	}
},
  {
    mode: 'modal',
    navigationOptions: {
      title: 'WHOOP APP',
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#500000'
      },
      headerTitleStyle: {
        fontSize: 24
      },
    }
  }
);

Tabs.navigationOptions =({navigation})=> ({
  title: 'WHOOP',
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: '#500000'
  },
  headerTitleStyle: {
    fontSize: 28
  },
  headerRight: <DropDown navigation={navigation}/>
});

export const Root = SwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'Auth'
  }
);
