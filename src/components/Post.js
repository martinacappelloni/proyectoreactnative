import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator, TextInput, Modal } from 'react-native';
import { auth, db } from '../firebase/config';
import firebase from 'firebase';


class Post extends Component{
constructor(props){
    super(props);
    this.state={
        likes: 0,
        myLike: false,
        showModal: false, // para la vista del modal
        comment: '', // para limpiar el campo despues de enviar
        
    }
}
componentDidMount(){
    if(this.props.postData.data.likes){
        this.setState({
            likes: this.props.postData.data.likes.length,
            myLike: this.props.postData.data.likes.includes(auth.currentUser.email),
        })
    }
}
darLike(){
    // Agregar mi usuario a un array de usuarios que likearon
        // updatear el registro (documento)

    db.collection('posts').doc(this.props.postData.id).update({
        likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)

    })
    .then(()=>{
        this.setState({
            likes: this.state.likes + 1,
            // likes: this.props.postData.data.likes.length 
            myLike: true,
        })
    })
}
quitarLike(){
    // Quitar  mi usuario a un array de usuarios que likearon

    db.collection('posts').doc(this.props.postData.id).update({
        likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)

    })
    .then(()=>{
        this.setState({
            likes: this.state.likes - 1,
            // likes: this.props.postData.data.likes.length 
            myLike: false,
        })
    })
}
showModal(){
    this.setState({
        showModal: true,
    })
}
hideModal(){
    this.setState({
        showModal: false,
    })
}
guardarComentario(){
    console.log('guardando comentario')
    // armar el comentario que vamos a guardar
    let oneComment = {
        createdAt: Date.now(),
        author: auth.currentUser.email,
        comment: this.state.comment,
    }
    //Guardarlo en un coleccion: modificar un doc
    // indentificar el doc que queremos modificar
    db.collection('posts').doc(this.props.postData.id).update({
        comments: firebase.firestore.FieldValue.arrayUnion(oneComment)
    })
    // conseguir el estado y limpiar el estado
    .then(()=>{
        this.setState({
            comment: '',
        })
    })
}

render(){
    console.log(this.props)
    return(
        <View style={styles.container}>
            <Text>Texto del post: {this.props.postData.data.texto}</Text>
            <Text>User:{this.props.postData.data.owner}</Text>
            <Text>likes:{this.state.likes}</Text>
            { 
            this.state.myLike == false ? 
            <TouchableOpacity onPress={()=> this.darLike()}>
                <Text> Me gusta </Text> 
            </TouchableOpacity>:

            <TouchableOpacity onPress={()=> this.quitarLike()} style={styles.boton}>
                <Text > Quitar like </Text> 
            </TouchableOpacity>
            }

            <TouchableOpacity onPress={()=> this.showModal()} >
                <Text > Ver comentarios </Text> 
            </TouchableOpacity>

            { this.state.showModal ?
            <Modal 
                style={styles.modalContainer}
                visible={this.state.showModal}
                animationType="slide"
                transparent={false}>

                <TouchableOpacity onPress={()=> this.hideModal()}>
                <Text style={styles.closeButton}> X </Text> 
                </TouchableOpacity>
                {/* FlatList para list para mostrar comentarios */}
                <FlatList
                data={this.props.postData.data.comments} // el array
                keyExtractor={(comment)=> comment.createdAt.toString()} 
                renderItem={({item})=> <Text>{item.author}: {item.comment}</Text>}
                />

            <View>
                <TextInput 
                style={styles.field}
                placeholder="Comentar..."
                keyboardType="default"
                multiline
                onChangeText={(text)=> this.setState({comment:text})}
                value={this.state.comment}
                />
                <TouchableOpacity onPress={()=> this.guardarComentario()} style={styles.boton}>
                <Text style={styles.textboton}> Guardar Comentario</Text> 
                </TouchableOpacity>
            </View>

            </Modal>:
                <Text></Text>
            }
        </View>
        )  
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        borderRadius: 4,
        borderColor: '#ccc',
        borderWidth: 1,
        // paddingHorizontal: 10,
        // marginBottom: 20,
        padding: 10, 
   },
   image: {
    height: 250
    },
    modalContainer: {
        width: '97%',
        borderRadius: 4,
        padding: 5,
        alignSelf: 'center',
        boxShadow: 'rgb(204 204 204) 0px 0px 7px 9px', // solo funciona en la web, no mobile
        marginTop: 20, 
        marginBottom: 10,
    },
    closeButton: {
        color: '#fff',
        padding: 5,
        backgroundColor: '#dc3545',
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingHorizontal: 8,
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
 
export default Post;