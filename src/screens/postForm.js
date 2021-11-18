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
    console.log('posteando..');
    db.collection('posts').add({
        owner: auth.currentUser.email,
        texto: this.state.textoPost,
        createdAt: Date.now(),
        username: auth.currentUser.displayName,
        photo: this.state.url
    })
    .then(() =>{ // limpiar el form de cargo
        this.setState({
            textoPost: ''
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
            <MyCamera onImageUpload={(url)=> {this.onImageUpload(url)}}/>:
            <View style={styles.formContainer}>
            <TextInput style={styles.field} 
            keyboardType='default'
            multiline
            placeholder='Escribí aquí'
            onChangeText={ text => this.setState({textoPost:text}) }/>
        
            <TouchableOpacity style={styles.boton} onPress={() => this.submitPost()}>
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
    field:{
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor:'#f0f0f0',
        borderStyle: 'solid',
        borderRadius: 6,
        marginVertical: 10,
    },
    boton:{
        backgroundColor: '#6db1b3',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#6db1b3',
    },
    textboton:{
       color: '#fff',
    },
 }) 
 export default PostForm;