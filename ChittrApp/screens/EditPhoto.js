import React,{Component, Fragment} from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableOpacity, Alert, Image, Button } from 'react-native';
import {RNCamera} from 'react-native-camera';
import {baseUrl} from '../components/baseUrl'

export default class EditPhoto extends Component {

	constructor(props){
		super(props);
		this.state={
			photo: null,
			auth: {}
		}
	}

	async getUser(){
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		this.setState({
			auth: authKey
		});
	}

	takePicture = async() => {
		if(this.camera){
			const options = {quality: 0.5, base64: true};
			const data = await this.camera.takePictureAsync(options);
			console.log(data);

			return fetch(baseUrl+'/user/photo',{
				method: 'POST',
				headers:{
					"Content-Type": "image/jpeg",
					"X-Authorization": this.state.auth.token
				},
				body: data
			})
			.then((response)=>{
				Alert.alert('Picture Added!');
			})
			.catch((error)=>{
				console.log(error);
			});
		}
	}

	componentDidMount(){
		this.getUser();
	}

	render() {
		return (
		  <View style={styles.container}>
			<RNCamera
				ref={ref=>{
					this.camera = ref;
				}}
				style={styles.preview}
			/>
			<View style={{flex:0, flexDirection:'row', justifyContent:'center'}}>
				<TouchableOpacity
					onPress={this.takePicture.bind(this)}
					style={styles.capture}
				>
				<Text style={{fontSize: 16}}>
					CAPTURE
				</Text>
				</TouchableOpacity>
			</View>
		  </View>
		);
	}
}

const styles = StyleSheet.create({
	container: {flex: 1, flexDirection: 'column'},
	preview: {flex: 1, justifyContent: 'flex-end', alignItems: 'center'},
	capture: {flex: 0, borderRadius: 5, padding: 15, paddingHorizontal: 20, alignSelf: 'center', margin: 20,}
});
