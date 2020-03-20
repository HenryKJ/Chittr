
import React, {Component} from 'react';
import {StyleSheet, FlatList, ActivityIndicator, Text, View} from 'react-native';
import {NavigationEvents} from 'react-navigation';
import {ListItem, Image, Card, Avatar, Divider, Icon} from 'react-native-elements';
import {baseUrl} from '../components/baseUrl';
import Geocoder from 'react-native-geocoding';

class HomeScreen extends Component{
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photoList: [],
			chitListData: [],
			locationList: [],
			refreshing: false,
		}
	}

	getData(){
		return fetch(baseUrl+'/chits')
		.then((response)=> response.json())
		.then((responseJson)=>{
			this.setState({
				chitListData: responseJson,
			});
		})
		.catch((err)=>{
			console.error(err);
		});
	}

	componentDidMount(){
		Geocoder.init("");
		this.getData()
		.then(async()=>{
			const list = [];
			const addressList = [];
			for(var chit of this.state.chitListData){
				try{
					let data = await this.getPhoto(chit.chit_id)
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
				if(chit.location){
					let address = await this.getLocation(chit.location);
					addressList.push({id: chit.chit_id, location: address});
				}
			}
			return [list, addressList];
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list[0],
				locationList: list[1],
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}

	getApiData(){
		this.getData()
		.then(async()=>{
			const list = [];
			const addressList = [];
			for(var chit of this.state.chitListData){
				try{
					let data = await this.getPhoto(chit.chit_id)
					let img = await this.readFileAsync(data)
					list.push({id: chit.chit_id, image: img});
				} catch(err){
					console.log(err);
				}
				if(chit.location){
					let address = await this.getLocation(chit.location);
					addressList.push({id: chit.chit_id, location: address})
				}
			}
			return [list, addressList];
		})
		.then((list)=>{
			this.setState({
				isLoading: false,
				photoList: list[0],
				locationList: list[1],
				refreshing: false,
			});
		})
		.catch(err=>{console.log(err)})
	}

	readFileAsync(file){
		return new Promise((resolve, reject)=>{
			let reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		})
	}
	async getPhoto(chit_id){
		let response = await fetch(baseUrl+'/chits/'+chit_id+'/photo')
		if(response.status=='200'){
			return await response.blob();
		} else {
			return null;
		}
	}

	handleRefresh = () => {
		this.setState({
			isFetching: true
		}, function(){this.getApiData()});
	}
	showImage(chit_id){
		let response = this.state.photoList.find(img => img.id == chit_id);
		if(response){
		return (<Image source={{uri: response.image}} style={{height: 200, width: 200}}/>)
		}
	}

	showLocation(chit_id){
		let response = this.state.locationList.find(add => add.id == chit_id);
		if(response){
			return (
			<View style={styles.address}>
				<Icon
					name='location'
					type='evilicon'
					color='gray'
					size={18}
				/>
				<Text style={{color: 'gray'}}>{response.location}</Text>
			</View>);
		}
	}

	async getLocation(coords){
		try{
			let response = await Geocoder.from(coords.latitude, coords.longitude);
			let addressComponent = await response.results[5].formatted_address;
			return addressComponent;
		}catch(err){
			console.error(err);
		}
	}

	showTime(timestamp){
		let time = new Date(timestamp);
		return time.toUTCString();
	}

	render(){
		if(this.state.isLoading){
			return(
				<View>
				<ActivityIndicator/>
				</View>
			)
		}else{
			return(
				<View>
					<FlatList
						data={this.state.chitListData}
						renderItem={({item}) => (
							<Card
								titleStyle={{textAlign: 'left'}}
								title={
									<View style={styles.header}>
										<Text style={{flex: 1, flexWrap: 'wrap'}}>{item.user.given_name} {item.user.family_name}</Text>
										<Text style={{flex: 2, color: 'gray'}}>{this.showTime(item.timestamp)}</Text>
									</View>

								}
							>
								<View style={{paddingTop: 10}}>
									<Divider style={styles.divider}/>
									<Text style={{marginBottom: 10}}>{item.chit_content}</Text>
									{this.showImage(item.chit_id)}
									{item.location &&
										this.showLocation(item.chit_id)
									}
								</View>
							</Card>

						)}
						keyExtractor={({chit_id}, index) => chit_id.toString()}
						refreshing={this.state.refreshing}
						onRefresh={this.handleRefresh}
					/>
				</View>
			);
		}
	}
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	divider: {
		backgroundColor:'gray',
		marginBottom: 10,
	},
	address: {
		marginTop: 10,
		flexDirection: 'row',
	},
})

export default HomeScreen
