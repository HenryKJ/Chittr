import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, AsyncStorage} from 'react-native';
import {ListItem} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'

const profilePic = require('../images/default.jpg');

export default class Followers extends Component{
	constructor(props){
		super(props);
		this.state={
			followersList: [],
		}
	}

	moreDetails = id => {
		this.storeId(id);
		this.props.navigation.push('OtherProfile');
	}

	async storeId(id){
		try{
			await AsyncStorage.setItem('id', JSON.stringify(id));
		} catch (error) {
			console.log(error.message);
		}
	}

	async getFollowers(){
		let id = JSON.parse(await AsyncStorage.getItem('id'));
		return fetch(baseUrl+'/user/'+id+'/followers')
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				followersList: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	componentDidMount(){
		this.getFollowers();
	}

	render(){
		return(
			<View style={styles.viewStyle}>
				<FlatList
					data={this.state.followersList}
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
