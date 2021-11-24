import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, TextInput} from 'react-native'

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
            <View style={styles.container}>
                <Text style={styles.textRegistrate}>Registrate</Text>
                <TextInput
                    style={styles.input}
                    keyboardType='email-address'
                    placeholder='Email'
                    onChangeText={text => this.setState({email: text})}
                />
                <TextInput
                    style={styles.input}
                    keyboardType='default'
                    placeholder='Username'
                    onChangeText={text => this.setState({username: text})}
                />
                <TextInput
                    style={styles.input}
                    keyboardType='default'
                    placeholder='Password'
                    secureTextEntry={true}
                    onChangeText={text => this.setState({password: text})}
                />
                <Text style={styles.error}>{this.props.errorMessage}</Text>
                {
                    this.state.email == '' && this.state.username == '' && this.state.password == ''?
                    <TouchableOpacity disabled={true} style={styles.button} onPress={() => this.props.register(this.state.email, this.state.password, this.state.username)} > 
                        <Text style={styles.text}>Register</Text>
                    </TouchableOpacity> :
                    <TouchableOpacity style={styles.button} onPress={() => this.props.register(this.state.email, this.state.password, this.state.username)} > 
                        <Text style={styles.text}>Register</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#4D4D4D',
        flex: 1,
        padding: 30,
    },
    textRegistrate: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
        marginVertical: 10,
    },
    input: {
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor:'#f0f0f0',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginTop: 15,
    },
    error:{
        color: '#f44336',
        alignSelf: 'center',
        margin: 10,
        fontWeight: 'bold'
    },
    button: {
        backgroundColor: '#6db1b3',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#6db1b3',
        marginTop: 10,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold'
    },
})

export default Register