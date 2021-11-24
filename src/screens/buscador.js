import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput, FlatList } from 'react-native';
import { db } from '../firebase/config';
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
                <TextInput style={styles.input} 
                    keyboardType='email-address'
                    placeholder='Buscar usuario'
                    onChangeText={ text => this.setState({textSearch:text})}
                />
                <TouchableOpacity style={styles.button} onPress={() => this.submitSearch()}>
                    <Text style={styles.textButton}> Buscar </Text> 
                </TouchableOpacity> 
                {
                    this.state.posteos.length == 0 && this.state.textSearch.length > 0 ?
                    <Text style={styles.noUser}> ¡Lo siento, usuario inexistente! </Text> :
                    <FlatList 
                        data={this.state.posteos}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => <Post postData={item} />}
                    />  
                }      
            </View>
        )
    }
}
     
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#4D4D4D',    
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: 10,
    },
    input:{
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor:'#f0f0f0',
        backgroundColor: '#f0f0f0',
        borderStyle: 'solid',
        borderRadius: 10,
        width: '74%',
        marginRight: 5,
    },
    button:{
        backgroundColor: '#6db1b3',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 10,
        width: '24%',
        height: 30,
    },
    textButton:{
        color: '#fff',
    },
    noUser:{
        color: '#fff',
    }
 }) 
 export default Buscador;