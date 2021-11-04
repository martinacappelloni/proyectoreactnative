import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native'

class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            username:'',
            password:'',
        }
    }

    render(){
        return(
            <View>
                <Text>Registrar</Text>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.field}
                        keyboardType='email-address'
                        placeholder='Email'
                        onChangeText={text => this.setState({email: text})}
                    />
                    {/* <TextInput
                        style={styles.field}
                        keyboardType='default'
                        placeholder='Username'
                        onChangeText={text => this.setState({username: text})}
                    /> */}
                    <TextInput
                        style={styles.field}
                        keyboardType='default'
                        placeholder='Password'
                        secureTextEntry={true}
                        onChangeText={text => this.setState({password: text})}
                    />
                    <Text>{this.props.errorMessage}</Text>
                    <TouchableOpacity style={styles.touchable} onPress={() => this.props.register(this.state.email, this.state.password)} > 
                        <Text style={styles.text}>Registrar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formContainer: {
        padding: 10,
        marginTop: 10,
    },
    field: {
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#ccc',
        borderRadius: 6,
        marginVertical: 10,
    },
    touchable: {
        backgroundColor: '#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#28a745',
    },
    text: {
        color: '#fff'
    }
})

export default Register