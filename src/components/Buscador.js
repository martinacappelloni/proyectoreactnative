import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { auth, db } from '../firebase/config';


class Buscador extends Component{
constructor(props){
    super(props);
    this.state={
        textSearch: ''

    }
}

/* submitSearch(){
    db.collection('posts').where('createdAt', '==', this.props.postData.data.createdAt).onSnapshot(

        
    )
} */

render(){
    return(
    <View style={styles.container}>
       <TextInput style={styles.field} 
            keyboardType='default'
            placeholder='Buscar'
            onChangeText={ text => this.setState({textSearch:text})}/>
            <TouchableOpacity style={styles.boton} onPress={() => this.submitSearch()}>
            <Text style={styles.textboton}> Buscar </Text> 
            </TouchableOpacity> 

           
    </View>
    )
}
}
     
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginBottom: 100,
    },
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
 export default Buscador;