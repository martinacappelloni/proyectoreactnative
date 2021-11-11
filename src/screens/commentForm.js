import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';


class CommentForm extends Component{
constructor(props){
    super(props);
    this.state={
        comentario: '',
    }
}
onSubmit(){
    console.log(`El comentario ingresado es: ${this.state.comentario}`)
}
render(){
    return(
        <View style={styles.formContainer}>
         <Text>Comentario</Text>
        <TextInput style={styles.field} 
        keyboardType='default'
        placeholder='comentario'
        onChangeText={ text => this.setState({comentario:text}) }/>
    
            
        <TouchableOpacity style={styles.boton} onPress={() => this.onSubmit()}>
        <Text style={styles.textboton}> Haz click aquí </Text> 
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
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#28a745',
   },
   textboton:{
       color: '#fff',
   },
 }) 
 export default CommentForm;