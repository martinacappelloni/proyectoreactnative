import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';


class Profile extends Component{
constructor(props){
    super(props);
    this.state={
        userData: this.props.userData,
    }
}

render(){
    return(
        <View style={styles.formContainer}>
         <Text> Email registrado: {this.props.userData.email}</Text>
        {/* <Text> Usuario creado el: {this.props.userData.user.metadata.creationTime} </Text>
        <Text> Último login: {this.props.userData.user.metadata.lastSignInTime}</Text> */}
            
        <TouchableOpacity style={styles.boton} onPress={() => this.props.logout(this.state.email, this.state.password)}>
        <Text style={styles.textboton}> Logout </Text> 
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
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'red',
   },
   textboton:{
       color: '#fff',
   },
 }) 
 export default Profile;