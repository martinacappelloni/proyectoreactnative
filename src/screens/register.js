import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';


class Register extends Component{
constructor(props){
    super(props);
    this.state={
        email: '',
        username: '',
        password: '',
    }
}
// Deprecado por la inclusión de firebase
// onSubmit(){
//     console.log(`El email ingresado es: ${this.state.email}`)
//     console.log(`El username ingresado es: ${this.state.username}`)
//     console.log(`La password ingresado es: ${this.state.password}`)
// }

render(){
    return(
        <View style={styles.formContainer}>
         <Text>Register</Text>
        <TextInput style={styles.field} 
        keyboardType='email-address'
        placeholder='email'
        onChangeText={ text => this.setState({email:text}) }/>
        
        <TextInput style={styles.field} 
        keyboardType='default'
        placeholder='username'
        onChangeText={ text => this.setState({username:text}) }/>
       

        <TextInput style={styles.field} 
        keyboardType='default'
        placeholder='password'
        secureTextEntry={true} 
        onChangeText={ text => this.setState({password:text}) }/> 

        <Text> {this.props.errorMsj} </Text>
            
        <TouchableOpacity style={styles.boton} onPress={() => this.props.register(this.state.email, this.state.password)}>
        <Text style={styles.textboton}> Registrate </Text> 
        </TouchableOpacity> 
    </View>
    )
}
}
     
const styles = StyleSheet.create({
   formContainer: {
    paddingHorizontal: 10,
    marginBottom: 20,
    
},
   field: {
    height: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor:'#ccc',
    borderStyle: 'solid',
    borderRadius: 6,
    marginVertical: 10,
   },
   boton:{
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    bo: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
   },
   textboton:{
       color: '#fff',
   },
 }) 
 export default Register;