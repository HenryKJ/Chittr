import React, {Component} from 'react';
import {StyleSheet, Image, Text, View, TextInput, AsyncStorage, Alert, PermissionsAndroid} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl'
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';

class PostChit extends Component{
	constructor(props){
		super(props);
		this.state={
			chitId: '',
			auth: {},
			image: null,
			location: null,
			coords: null,
			locationPermission: false,
			text: '',
			numChar: 141
		}
	}

	handleLocation = () => {
		if(!this.state.locationPermission){
			this.state.locationPermission = requestLocationPermission();
		}
		Geolocation.getCurrentPosition(
			(position) => {
				let coords = {
					'longitude': position.coords.longitude,
					'latitude': position.coords.latitude
				};

				this.setState({coords});

				Geocoder.from(position.coords.latitude, position.coords.longitude)
				.then(json => {
					console.log(json);
					let addressComponent = json.results[5].formatted_address;
					this.setState({
						location: addressComponent
					})
					console.log(addressComponent);
				})
				.catch(err => console.log(err));
			},
			(error)=>{
				Alert.alert(error.message)
			},
			{
				enableHighAccuracy: true,
				timeout: 20000,
				maximumAge: 1000
			}
		);
	};

	receivedImage =(image) =>{
		this.setState({image})
	}

	handleImage = () => {
		this.props.navigation.navigate('Photo',{receivedImage: this.receivedImage});
	}

	async uploadPhoto(){
		await this.getChitId(this.state.auth.id)
		let chitId = this.state.chitId
		let token = this.state.auth.token
		await this.postPhoto(token,chitId)
	}

	postPhoto(token,id){
		return fetch(baseUrl+'/chits/'+id+'/photo', {
			method: 'POST',
			withCredentials: true,
			headers: {
				'X-Authorization': token,
				'Content-Type': 'image/jpeg'
			},
			body: this.state.image
		})
		.then((response)=>{
			console.log('Picture added!');
			this.setState({
				image: null
			})
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	postChit(token){

		if(this.state.coords == null){
			return fetch(baseUrl+'/chits',
			{
				method: 'POST',
				withCredentials: true,
				headers: {
					'X-Authorization': token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timestamp: Date.parse(new Date()),
					chit_content: this.state.text,
				})
			})
			.then((response)=>{
				if(response.status == "201"){
					if(this.state.image != null){
						this.uploadPhoto();
					}
					Alert.alert("Chit posted successfully!")
					this.setState({
						text: '',
						numChar: 141,
						coords: null,
						location: null,
					});
				} else {
					Alert.alert("Chit failed to post...")
				}
			})
		}
		else {
			return fetch(baseUrl+'/chits',
			{
				method: 'POST',
				withCredentials: true,
				headers: {
					'X-Authorization': token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					timestamp: Date.parse(new Date()),
					chit_content: this.state.text,
					location: this.state.coords,
				})
			})
			.then((response)=>{
				if(response.status == "201"){
					if(this.state.image != null){
						this.uploadPhoto();
					}
					Alert.alert("Chit posted successfully!")
					// reset state
					this.setState({
						text: '',
						numChar: 141,
						coords: null,
						location: null,
					});
				} else {
					Alert.alert("Chit failed to post...")
				}
			})
		}
	}

	async getUser(){
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		this.setState({
			auth: authKey
		});
		console.log(this.state.auth);
	}
	getChitId(id){
		return fetch(baseUrl+'/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			let id = responseJson.recent_chits[0].chit_id
			this.setState({
				chitId : id
			})
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	componentDidMount(){
		this.getUser();
		Geocoder.init("");
	}

	render(){
		return(
			<View>
				<TextInput
					style={styles.textbox}
					multiline={true}
					numberOfLines={5}
					maxLength={141}
					placeholder={"What's happening?"}
					onChangeText={(text) => this.setState({text, numChar: (141-text.length)})}
					value={this.state.text}
				/>
				<View style={styles.buttonContainer}>
					<Icon
						name='image'
						type='evilicon'
						color='#339aff'
						size= {55}
						onPress={this.handleImage}
					/>
					<Icon
						name='location'
						type='evilicon'
						color='#339aff'
						size= {55}
						onPress={this.handleLocation}
					/>
					<Text style={styles.counter}>
						{this.state.numChar}
					</Text>
					<Button
						title="Chit"
						onPress={()=> {this.postChit(this.state.auth.token)}}
					/>
				</View>
				{this.state.location != null &&
					<View style={styles.addOn}>
						<Text> Location: {this.state.location}</Text>
						<Icon
							name='close-o'
							type='evilicon'
							color='#FF7256'
							size= {25}
							onPress={()=>{
								this.setState({
									location: null
								});
							}}
						/>
					</View>
				}
				{this.state.image != null &&
					<View style={styles.addOn}>
						<Image
							source={this.state.image}
							style={{width: 200, height: 200}}
						/>
						<Icon
							name='close-o'
							type='evilicon'
							color='#FF7256'
							size= {30}
							onPress={()=>{
								this.setState({
									image: null
								});
							}}
						/>
					</View>
				}

			</View>
		);
	}
}

const styles = StyleSheet.create({
	textbox: {
		fontSize: 25,
	},
	counter: {
		fontSize: 25,
		marginRight: 20,
	},
	buttonContainer:{
		margin: 25,
		flexDirection: 'row',
		justifyContent:'flex-end',
	},
	addOn:{
		flexDirection: 'row',
		padding: 15,
	},
})

async function requestLocationPermission(){
	try {
		const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			{
				title: 'Location Permission',
				message:'Location access required',
				buttonNeutral: 'Neutral',
				buttonNegative: 'Cancel',
				buttonPositive: 'OK',
			},
		);
		if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			console.log('You can access location');
			return true;
		} else {
			console.log('Location access denied');
			return false;
		}}
	catch (err) {console.warn(err);}
}
export default PostChit
