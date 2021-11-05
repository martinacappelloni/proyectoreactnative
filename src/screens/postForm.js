import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native'
import {auth, db} from '../firebase/config'

class PostForm extends Component{
    constructor(props){
        super(props);
        this.state = {
            textoPost:'',
        }
    }

    submitPost(){
        db.collection('posts').add({
            owner: auth.currentUser.email,
            texto: this.state.textoPost,
            createdAt: Date.now(),
        })
        .then( () => {
            this.setState({
                textoPost: ''
            })
            //Redireccion
            this.props.drawerProps.navigation.navigate('Home')
        })
        .catch()
    }

    render(){
        return(
            <View>
                <Text>Nuevo Post</Text>
                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.field}
                        keyboardType='default'
                        placeholder='Escribe Aqui'
                        onChangeText={text => this.setState({textoPost: text})}
                        multiline
                        value={this.state.textoPost}
                    />
                    <Text>{this.props.errorMessage}</Text>
                    <TouchableOpacity style={styles.touchable} onPress={() => this.submitPost() } > 
                        <Text style={styles.text}>Guardar</Text>
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
        height: 100,
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

export default PostForm