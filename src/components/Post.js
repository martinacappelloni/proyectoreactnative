import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Modal, FlatList, TextInput, Image} from 'react-native'
import { db, auth } from '../firebase/config';
import firebase from 'firebase'

class Post extends Component{
    constructor(props){
        super(props);
        this.state = {
            likes: 0,
            myLike: false, 
            showModal: false, //esto es para la vista del modal
            comment: '', //para limpiar el campo despues de enviar
        }
    }

    componentDidMount(){
        console.log(this.props.postData)
        if(this.props.postData.data.likes){
            this.setState({
                likes: this.props.postData.data.likes.length,
                myLike: this.props.postData.data.likes.includes(auth.currentUser.email), //mirando el array de posts de likes y se fija si esta el email del usuario logueado
            })
        }     
    }

    darLike(){
        //Agregar mi usuario a un array de usuarios que likearon
        //Updatear el registro (documento)
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)         //identificamos el posteo y le agregamos el usuario que le dio like
        })
        //Cambiar estado
        .then(() => (
            this.setState({
                likes: this.state.likes + 1,
                myLike: true, //aca decidimos si le mostramos el me gusta o el quitar like
            })
        ))        
    }

    quitarLike(){
        //Quitar mi usuario de un array de usuarios que likearon
        db.collection('posts').doc(this.props.postData.id).update({
            likes: firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)
        })
        //Cambiar estado
        .then(() => (
            this.setState({
                likes: this.state.likes - 1,
                myLike: false, 
            })
        ))   
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
        //armar el comentario que vamos a guardar
        let oneComment = {
            createdAt: Date.now(),
            author: auth.currentUser.email,
            comment: this.state.comment
        }
        //guardarlo en una coleccion: modificar un posteo
        //identificar el documento/post que queremos modificar
        db.collection('posts').doc(this.props.postData.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion(oneComment),
        })
        //conseguir el estado y limpiarlo
        .then(()=>{
            this.setState({
                comment: '',
            })
        })
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Texto del post: {this.props.postData.data.texto}</Text>
                <Text>User: {this.props.postData.data.owner}</Text>
                <Text>Fecha de creacion: {this.props.postData.data.createdAt}</Text>
                { //Cambio de botones me gusta / quitar like
                    this.state.myLike === false ?
                    <TouchableOpacity onPress={() => this.darLike() }> 
                        <Image style={styles.image}
                            source={require('../../assets/deslikeada.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity> :
                    <TouchableOpacity onPress={() => this.quitarLike() }> 
                        <Image style={styles.image}
                            source={require('../../assets/likeada.png')}
                            resizeMode='contain'
                        />
                    </TouchableOpacity>
                }
                <Text>{this.state.likes} Likes</Text>

                {/* Ver modal */}
                <TouchableOpacity onPress={() => this.showModal() }> 
                {/* {
                    this.props.postData.data.comments.length > 1 ?
                    <Text>Ver {this.props.postData.data.comments.length} comentarios</Text> :
                    <Text>Ver {this.props.postData.data.comments.length} comentario</Text> 
                } */}
                <Text>Ver comentarios</Text> 

                </TouchableOpacity>

                {/* Modal para comentarios */}
                { this.state.showModal ?
                    <Modal 
                        style={styles.modalContainer}
                        visible={this.state.showModal}
                        animationType='fade'
                        transparent={false}
                    > 
                        <TouchableOpacity onPress={() => this.hideModal() }> 
                            <Text style={styles.closeButton}>X</Text>
                        </TouchableOpacity>
                        {/* FlatList para mostrar comentarios */}
                        {
                            this.props.postData.data.comments === '' ?
                            <Text>Aún no hay comentarios. Sé el primero en opinar!</Text> :
                            <FlatList 
                                data={this.props.postData.data.comments} //el array
                                keyExtractor={(comment) => comment.createdAt.toString()} //es equivalente a la prop key que necesitamos para el map y comment es cada uno de los elementos del array
                                renderItem={({item}) => <Text>{item.author}: {item.comment}</Text>}
                            />
                        }
                        
                        {/* Formulario para nuevo comentario */}
                        <View>
                            <TextInput 
                                style={styles.input}
                                placeholder='Comentar...'
                                keyboardType='deafult'
                                multiline
                                onChangeText={text => this.setState({comment: text})}
                                value={this.state.comment}
                            />
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.guardarComentario() }> 
                                <Text style={styles.textButton}>Guardar comentario</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal> :
                    <Text> </Text>
                }
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginBottom: 20,
        borderRadius: 4,
        borderColor: '#ccc',
        borderWidth: 1,
        padding: 10,
    },
    modalContainer:{
        width: '97%',
        borderRadius: 4,
        padding: 5,
        alignSelf: 'center',
        boxShadow: 'rgb(204 204 204) 0px 0px 9px 7px',
        marginTop: 20,
        marginBottom: 10,
    },
    closeButton:{
        color: '#fff',
        padding: 5,
        backgroundColor: '#dc4545',
        alignSelf: 'flex-end',
        borderRadius: 4,
        paddingHorizontal: 8,
    },
    input: {
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#ccc',
        borderRadius: 6,
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        textAlign: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#28a745',
    },
    textButton: {
        color: '#fff',
    },
    image:{
        height: 25,
        // alignSelf: 'flex-start',
        // position: 'absolute',
        // left: 0,
        // top: 5,
    }

})

export default Post