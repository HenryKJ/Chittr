import React, {Component} from 'react';
import {StyleSheet, FlatList, ActivityIndicator, Text, View, Image, AsyncStorage} from 'react-native';
import {Button, ListItem} from 'react-native-elements';
import FormButton from '../components/FormButton'
import {baseUrl} from '../components/baseUrl'

const profilePic = require('../images/default.jpg');

export default class OtherProfile extends Component{
	constructor(props){
		super(props);
		this.state={
			isLoading: true,
			userID: '',
			userDetails: {},
			followers: [],
			following: [],
			isFollowing: false,
			auth:{}
		}
	}

	goToFollowers(){this.props.navigation.navigate('Followers');}

	goToFollowing(){this.props.navigation.navigate('Following');}

	async getUser(){
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		let id = JSON.parse(await AsyncStorage.getItem('id'));

		this.setState({
			auth: authKey,
			userID: id
		});
		this.getData(id);
		this.getFollowers(id);
		this.getFollowing(id);
	}
	getData(id){
		return fetch(baseUrl+'/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				userDetails: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	getFollowers(id){
		return fetch(baseUrl+'/user/'+id+'/followers')
		.then((response)=>response.json())
		.then((responseJson)=>{
			let result = responseJson.filter(obj=>obj.user_id==this.state.auth.id);
			console.log(result);
			if(result.length==1){
				this.setState({
					isFollowing: true,
				});
			}
			this.setState({
				followers: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}
	getFollowing(id){
		return fetch(baseUrl+'/user/'+id+'/following')
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				isLoading: false,
				following: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	componentDidMount(){
		this.getUser();
	}

	follow(){
		let id = this.state.userID
		let key = this.state.auth.token

		if(this.state.isFollowing == true){
			return fetch(baseUrl+'/user/'+id+'/follow',{
				method: 'DELETE',
				withCredentials: true,
				headers:{
					'X-Authorization': key,
					'Content-Type': 'application/json'
				}
			})
			.then((response)=>{
				if(response.status == '200'){
					this.setState({
						isFollowing: false,
					});
				}
				console.log(response.status);
			})
			.catch((error)=>{
				console.log(error);
			})
		} else {
			return fetch(baseUrl+'/user/'+id+'/follow',{
				method: 'POST',
				withCredentials: true,
				headers: {
					'X-Authorization': key,
					'Content-Type': 'application/json'
				}
			})
			.then((response)=>{
				if(response.status == '200'){
					this.setState({
						isFollowing: true,
					});
				}
				console.log(response.status);
			})
			.catch((error)=>{
				console.log(error);
			});
		}
	}

	render(){
		if(this.state.isLoading){
			return(
				<View>
				<ActivityIndicator/>
				</View>
			)
		}
		return(
			<View style={{flex: 1}}>
				<View style={styles.header}>
					<View style={styles.buttonContainer}>
					<FormButton
						buttonType="outline"
						onPress={() => this.follow()}
						title={this.state.isFollowing == false ? 'Follow':'Following'}
						buttonColor="#FFFFFF"
					/>
					</View>
				</View>
				<Image style={styles.avatar} source = {profilePic}/>
				<View style={styles.body}>
					<View style={styles.bodyContent}>
						<Text style={styles.name}>{this.state.userDetails.given_name} {this.state.userDetails.family_name}</Text>
						<Text style={styles.email}>{this.state.userDetails.email}</Text>
						<View style={styles.followerContainer}>
						<Button
							title={"Followers "+this.state.followers.length}
							onPress={()=>this.goToFollowers()}
							titleStyle={{
								color: '#F57c00'
							}}
							type="clear"
						/>
						<Button
							title={"Following "+this.state.following.length}
							onPress={()=>this.goToFollowing()}
							titleStyle={{
								color: '#F57c00'
							}}
							type="clear"
						/>
				</View>
					</View>
				</View>
				<FlatList style={{marginTop: 150}}
						data={this.state.userDetails.recent_chits}
						renderItem={({item}) => (
							<ListItem
								title={item.chit_content}
								subtitle={new Date(item.timestamp).toUTCString()}
								bottomDivider
								chevron
								onPress={() => console.log("check chit")}
							/>
						)}
						keyExtractor={({chit_id}, index) => chit_id}
					/>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	header:{
		backgroundColor: "#00c8ff",
		height:150,
	},
	avatar:{
		width: 130,
		height:130,
		borderRadius: 63,
		borderWidth: 4,
		borderColor: "white",
		marginBottom: 10,
		alignSelf: 'center',
		position: 'absolute',
		marginTop: 80
	},
	name: {
		fontSize: 22,
		color:"#FFFFFF",
		fontWeight:'600',
	},
	body: {
		marginTop: 40,
	},
	bodyContent: {
		flex: 1,
		alignItems: 'center',
		padding: 30,
	},
	name:{
		fontSize: 28,
		color: "#696969",
		fontWeight: "600"
	},
	email:{
		fontSize: 16,
		color: "#00c8ff",
		marginTop: 10
	},
	buttonContainer:{
		margin: 25,
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
	followerContainer:{
		flexDirection:'row',
		alignSelf: 'stretch',
		justifyContent: 'space-around',
		margin:25,
	},
});
