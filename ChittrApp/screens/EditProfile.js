import React, {Component, Fragment} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Image, Alert, AsyncStorage} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import { Formik } from 'formik';
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
import * as yup from 'yup'
import ErrorMessage from '../components/ErrorMessage'
import {baseUrl} from '../components/baseUrl'
import {Avatar} from 'react-native-elements';

const profilePic = require('../images/default.jpg');

class EditProfile extends Component {
	constructor(props){
		super(props);
		this.state={
			isLodaing: true,
			photo: '',
			userDetails: {},
			auth:{}
		}
	}
	handleSubmit = values => {
		if (values.given_name.length > 0 && values.family_name.length > 0 && values.email.length > 0 && values.password.length > 0) {
			return fetch(baseUrl+'/user/' + this.state.auth.id,
			{
				method: 'PATCH',
				withCredentials: true,
				headers: {
					'X-Authorization': this.state.auth.token,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					given_name: values.given_name,
					family_name: values.family_name,
					email: values.email,
					password: values.password
				})
			})
			.then((response)=>{
				if(response.status == "201"){
					Alert.alert("Profile update successfully!")
				} else {
					Alert.alert("Fail to update...")
				}
			})
			.catch((error)=>{
				console.error(error);
			})

		}
	}

	imagePressed(){
		this.props.navigation.navigate('EditPhoto')
	}

	async getUser(){
		let response = await AsyncStorage.getItem('auth');
		let authKey = await JSON.parse(response) || {};
		this.setState({
			auth: authKey
		});
		this.getData(this.state.auth.id)
		this.getPhoto(this.state.auth.id)
	}

	getPhoto(id){
		return fetch(baseUrl+'/user/'+id+'/photo')
		.then(response => response.blob())
		.then((image)=>{
			var reader = new FileReader();
			reader.onload =()=>{
				this.setState({
					isLoading: false,
					photo: reader.result
				});
			}
			reader.readAsDataURL(image);
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	getData(id){
		return fetch(baseUrl+'/user/' + id)
		.then((response)=>response.json())
		.then((responseJson)=>{
			this.setState({
				isLoading: false,
				userDetails: responseJson,
			});
		})
		.catch((error)=>{
			console.log(error);
		});
	}

	componentDidMount(){
		this.getUser();
	}

	render(){
		return(
			<SafeAreaView style={styles.container}>
				<Formik
					enableReinitialize
					initialValues={this.state.userDetails}
					onSubmit={values => {this.handleSubmit(values)}}
					validationSchema={validationSchema}
				>
					{({handleChange, values, handleSubmit, errors, isValid, isSubmitting, touched, handleBlur}) => (
						<Fragment>
							<View style={styles.header}>
								<View style={styles.buttonContainer}>
									<FormButton
										buttonType="outline"
										onPress={handleSubmit}
										title="SAVE"
										buttonColor="#f7f7f7"
									/>
								</View>
							</View>
							<Avatar style={styles.avatar}
								size="xlarge"
								rounded
								source={{uri: this.state.photo}}
								onPress={()=>this.imagePressed()}
								activeOpacity={0.7}
							/>
							<FormInput
								name="Given Name"
								value={values.given_name}
								placeholder="Enter Given Name"
								autoCapitalize="none"
								onChangeText={handleChange('given_name')}
								iconName="person"
								iconColor="#2f415c"
								onBlur={handleBlur('given_name')}
							/>
							<ErrorMessage errorValue={touched.given_name && errors.given_name} />
							<FormInput
								name="Family Name"
								value={values.family_name}
								placeholder="Enter Family Name"
								autoCapitalize="none"
								onChangeText={handleChange('family_name')}
								iconName="people"
								iconColor="#2f415c"
								onBlur={handleBlur('family_name')}
							/>
							<ErrorMessage errorValue={touched.family_name && errors.family_name} />
							<FormInput
								name="Email"
								value={values.email}
								placeholder="Enter Email"
								autoCapitalize="none"
								onChangeText={handleChange('email')}
								iconName="email"
								iconColor="#2f415c"
								onBlur={handleBlur('email')}
							/>
							<ErrorMessage errorValue={touched.email && errors.email} />
							<FormInput
								name="Password"
								value={values.password}
								placeholder="Enter password to save"
								secureTextEntry
								onChangeText={handleChange('password')}
								iconName="lock"
								iconColor="#2f415c"
								onBlur={handleBlur('password')}
							/>
							<ErrorMessage errorValue={touched.password && errors.password} />
						</Fragment>
					)}
				</Formik>
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	header:{
		backgroundColor: "#00c8ff",
		height:150,
	},
	container: {
		flex: 1,
		backgroundColor: '#fff'
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
		marginTop: 10
	},
	name: {
		fontSize: 22,
		color:"#f7f7f7",
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
		color: "#969595",
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
		justifyContent:'flex-end',
	},
});

const validationSchema = yup.object().shape({
	given_name: yup.string()
		.label('Given Name')
		.min(2, 'Too short!')
		.max(50, 'Too Long!')
		.required('Please enter your given/first name'),
	family_name: yup.string()
		.label('Family Name')
		.min(2, 'Too short!')
		.max(50, 'Too Long!')
		.required('Please enter your family/last name'),
	email: yup.string()
		.label('Email')
		.email('Enter a valid email')
		.required('Please enter a registered email'),
	password: yup.string()
		.label('Password')
		.required()
		.min(4, 'Password must have at least 4 characters ')
})

export default EditProfile
