import React, {Compoenent} from 'react';
import{Text, View} from 'react-native';
import {createStackNavigator} from 'react-navigation-stack';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Profile from './screens/Profile'
import EditProfile from './screens/EditProfile'
import EditPhoto from './screens/EditPhoto'
import Login from './screens/Login'
import SignUp from './screens/SignUp'
import HomeScreen from './screens/HomeScreen'
import Chit from './screens/Chit'
import Search from './screens/Search'
import PostChit from './screens/PostChit'
import CapturePhoto from './screens/CapturePhoto'
import OtherProfile from './screens/OtherProfile'
import Followers from './screens/Followers'
import Following from './screens/Following'

export const MainStack = createStackNavigator({
	Home: {
		screen: HomeScreen
	},
	Chit: {
		screen: Chit
	}
})

export const OtherUserStack = createStackNavigator({
	Search: {
		screen: Search
	},
	OtherProfile: {
		screen: OtherProfile
	},
	Followers: {
		screen: Followers
	},
	Following: {
		screen: Following
	}
})

export const PostChitStack = createStackNavigator({
	Create: {
		screen: PostChit
	},
	Photo: {
		screen: capturePhoto
	}
})

export const Tabs = createBottomTabNavigator({
	Home: {
		screen: MainStack
	},
	Create: {
		screen: PostChitStack
	},
	Search: {
		screen: OtherUserStack
	}
})

export const UserStack = createStackNavigator({
	Profile: {
		screen: Profile
	},
	EditProfile: {
		screen: EditProfile
	},
	EditPhoto: {
		screen: EditPhoto
	}
})

export const LoginStack = createStackNavigator({
	Login: {
		screen: Login
	},
	SignUp: {
		screen: SignUp
	}
})

export const Drawer = createDrawerNavigator({
	Home: {screen: Tabs},
	Login: {screen: LoginStack},
	Profile: { screen: UserStack}
})
