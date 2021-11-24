import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import MyCamera from '../components/MyCamera';
import { auth, db } from '../firebase/config';


class PostForm extends Component{
    constructor(props){
        super(props);
        this.state={
            textoPost: '',
            showCamera: true,
            url: ''
        }
    }

    submitPost(){
        db.collection('posts').add({
            owner: auth.currentUser.email,
            texto: this.state.textoPost,
            createdAt: Date.now(),
            username: auth.currentUser.displayName,
            photo: this.state.url,
        })
        .then(() =>{
            this.setState({
                textoPost: '',
            })
            // Redirección
            this.props.drawerProps.navigation.navigate('Home')
        })
        .catch( e => console.log(e))
    }

    onImageUpload(url){
        this.setState({
            showCamera: false,
            url: url,
        })
    }

    render(){
        return(
            <View style={styles.container}>
                {
                this.state.showCamera ?
                <MyCamera onImageUpload={(url)=> {this.onImageUpload(url)}}/> :
                <View style={styles.formContainer}>
                    <TextInput style={styles.input} 
                        keyboardType='default'
                        multiline
                        placeholder='Escribí aquí'
                        onChangeText={ text => this.setState({textoPost:text})}
                    />
                    <TouchableOpacity style={styles.button} onPress={() => this.submitPost()}>
                        <Text style={styles.textboton}> Guardar </Text> 
                    </TouchableOpacity> 
                </View>
                }
            </View>
        )
    }
}
     
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#4D4D4D',
    },
    formContainer:{
        paddingHorizontal: 10,
        marginBottom: 20,
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
        width: '90%',
        alignSelf: 'center',
    },
    textboton:{
       color: '#fff',
       fontWeight: 'bold',
    },
 }) 
 export default PostForm;