import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { auth, db } from '../firebase/config';
import Post from '../components/Post';


class Buscador extends Component{
constructor(props){
    super(props);
    this.state={
        textSearch: '',
        posteos: [],

    }
}

submitSearch(){
    db.collection('posts').where('owner', '==', this.state.textSearch).onSnapshot(
        docs => {
            let posts = [];
            docs.forEach( doc => {
                posts.push({
                    id: docs.id,
                    data: doc.data()
                })
                this.setState({
                    posteos: posts,
                })
            })
        }
    )
}

render(){
    return(
    <View style={styles.container}>
       <TextInput style={styles.field} 
            keyboardType='email-address'
            placeholder='Buscar usuario'
            onChangeText={ text => this.setState({textSearch:text})}/>
            <TouchableOpacity style={styles.boton} onPress={() => this.submitSearch()}>
            <Text style={styles.textboton}> Buscar </Text> 
            </TouchableOpacity> 
                {
                   this.state.posteos.length == 0 && this.state.textSearch.length > 0 ?
                    <Text> ¡Lo siento, usuario inexistente! </Text> :
                    <FlatList 
                    data={this.state.posteos}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <Post postData={item} />} />  

                }  
                 
           
    </View>
    )
}
}
     
const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginBottom: 100,
        backgroundColor: '#302c2e',
        
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