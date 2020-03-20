import * as yup from 'yup'
import ErrorMessage from '../components/ErrorMessage'
import {baseUrl} from '../components/baseUrl'
import React, {Component, Fragment} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Alert} from 'react-native';
import {Button, Icon} from 'react-native-elements';
import { Formik } from 'formik';
import FormInput from '../components/FormInput'
import FormButton from '../components/FormButton'
export default class SignUp extends Component{

	handleSubmit = values => {
		if (values.given_name.length > 0 && values.family_name.length > 0 && values.email.length > 0 && values.password.length > 0) {
			return fetch(baseUrl+'/user/',
			{
				method: 'POST',
				headers: {
					Accept: 'applicaation/json',
					'Content-Type': 'application/json',
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
					Alert.alert("Create account successfully!")
					setTimeout(() => {
						this.props.navigation.navigate('Login')
					}, 3000)
				} else {
					Alert.alert("Fail to create account...")
					setTimeout(() => {
						this.props.navigation.navigate('Login')
					}, 3000)
				}
			})
			.catch((error)=>{
				console.error(error);
			})

		}
	}

	render(){
		return (
			<SafeAreaView style={styles.container}>
				<Formik
					initialValues={{given_name: '', family_name: '', email: '', password: ''}}
					onSubmit={values => {this.handleSubmit(values)}}
					validationSchema={validationSchema}
				>
					{({handleChange, values, handleSubmit, errors, isValid, isSubmitting, touched, handleBlur}) => (
						<Fragment>
							<FormInput
								name="Given Name"
								value={values.given_name}
								placeholder="Enter Given Name"
								autoCapitalize="none"
								onChangeText={handleChange('given_name')}
								iconName="person"
								iconColor="#2C384A"
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
								iconColor="#2C384A"
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
								iconColor="#2C384A"
								onBlur={handleBlur('email')}
							/>
							<ErrorMessage errorValue={touched.email && errors.email} />
							<FormInput
								name="Password"
								value={values.password}
								placeholder="Enter Password"
								secureTextEntry
								onChangeText={handleChange('password')}
								iconName="lock"
								iconColor="#2C384A"
								onBlur={handleBlur('password')}
							/>
							<ErrorMessage errorValue={touched.password && errors.password} />

							<View style={styles.buttonContainer}>
								<FormButton
									buttonType="outline"
									onPress={handleSubmit}
									title="Sign Up"
									buttonColor="#039BE5"
									disabled={!isValid || isSubmitting}
									loading = {isSubmitting}
								/>
							</View>
						</Fragment>
					)}
				</Formik>

			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	buttonContainer: {
		margin: 25
	}
})

const validationSchema = yup.object().shape({
	given_name: yup.string()
		.label('Given Name')
		.min(2, 'Too short!')
		.max(50, 'Too Long!')
		.required('Please enter your first name'),
	family_name: yup.string()
		.label('Family Name')
		.min(2, 'Too short!')
		.max(50, 'Too Long!')
		.required('Please enter your last name'),
	email: yup.string()
		.label('Email')
		.email('Enter a valid email')
		.required('Please enter a registered email'),
	password: yup.string()
		.label('Password')
		.required()
		.min(4, 'Password must have at least 4 characters ')
})
