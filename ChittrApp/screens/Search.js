import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, AsyncStorage} from 'react-native';
import {SearchBar, ListItem} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'

const profilePic = require('../images/default.jpg');

export default class Search extends Component{

	constructor(props){
		super(props);
		this.state={
			userListData: [],
			search: '',
		}
	}

	async storeId(id){
		try{
			await AsyncStorage.setItem('id', JSON.stringify(id));
		} catch (error) {
			console.log(error.message);
		}
	}

	updateSearch = text => {
		this.setState({search: text});
		if(text == ''){
			this.setState({
				userListData: [],
			});
		} else {
			return fetch(baseUrl+'/search_user?q=' + text)
			.then(response => response.json())
			.then(responseJson => {
				this.setState({
					userListData: responseJson,
				});
			})
			.catch((error)=>{
				console.log(error);
			});
		}
	}

	moreDetails = id => {
		this.storeId(id);
		this.props.navigation.navigate('OtherProfile');
	}

	render(){
		return(
			<View style={styles.viewStyle}>
				<SearchBar
					placeholder="Type here..."
					onChangeText={this.updateSearch}
					value={this.state.search}
				/>
				<FlatList
					data={this.state.userListData}
					renderItem={({item}) => (
						<ListItem
							leftAvatar={{source: {profilePic}}}
							title={`${item.given_name} ${item.family_name}`}
							subtitle={item.email}
							bottomDivider
							chevron
							onPress={() => this.moreDetails(item.user_id)}
						/>
					)}
					enableEmptySections={true}
					style={{marginTop: 10}}
					keyExtractor={(item, index) => String(index)}
				/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	viewStyle: {
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'lightgrey',
	},
	textStyle: {
		padding: 10,
		fontSize: 25,
	},
});
