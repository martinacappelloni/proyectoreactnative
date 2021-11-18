import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Modal, FlatList, TextInput, Image} from 'react-native'
import { db, auth } from '../firebase/config';
import firebase from 'firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farFaHeart} from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasFaHeart} from '@fortawesome/free-solid-svg-icons'
import { faUserCircle} from '@fortawesome/free-regular-svg-icons'

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

    eliminarPosteo(){
        db.collection('posts').where('createdAt', '==', this.props.postData.data.createdAt).onSnapshot(
            docs => {
                console.log(docs);

                //Array para crear datos en formato útil
                docs.forEach( doc => {
                    doc.ref.delete()
                })
            }
        )
    }

    render(){
        console.log(this.props.postData.data.comments);
        return(
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={{uri: `${this.props.postData.data.photo}`}}
                    resizeMode='contain'
                />

                <View style={styles.subcontainer}>
                    <Text style={styles.icon}> <FontAwesomeIcon icon={faUserCircle} /> </Text>
                    <Text style={styles.owner}>{this.props.postData.data.owner}</Text>
                    { // like - dislike
                        this.state.myLike === false ?
                        <TouchableOpacity  style={styles.icon} onPress={() => this.darLike() }> 
                            <FontAwesomeIcon icon={farFaHeart} />
                        </TouchableOpacity> :
                        <TouchableOpacity style={styles.icon} onPress={() => this.quitarLike() }> 
                            <FontAwesomeIcon icon={fasFaHeart} />
                        </TouchableOpacity>
                    }
                    <Text style={styles.likeNumber}>{this.state.likes}</Text>
                </View>

                <Text style={styles.caption}> {this.props.postData.data.texto}</Text>

                {/* Ver modal */}
                <TouchableOpacity style={styles.verComentarios} onPress={() => this.showModal() }> 
                {
                    this.props.postData.data.comments == undefined ?
                    <Text style={styles.textoVerComentarios}>Haz un comentario</Text> :
                    <Text style={styles.textoVerComentarios}>Ver {this.props.postData.data.comments.length} comentarios</Text> 
                } 
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
                        <FlatList 
                            data={this.props.postData.data.comments} //el array
                            keyExtractor={(comment) => comment.createdAt.toString()} //es equivalente a la prop key que necesitamos para el map y comment es cada uno de los elementos del array
                            renderItem={({item}) => <Text style={styles.comentarios}>{item.author}: {item.comment}</Text>}
                        />
                        
                        {/* Formulario para nuevo comentario */}
                        <View style={styles.inputContainer}>
                            <TextInput 
                                style={styles.input}
                                placeholder='Comentar...'
                                keyboardType='deafult'
                                multiline
                                onChangeText={text => this.setState({comment: text})}
                                value={this.state.comment}
                            />
                            {
                            this.state.comment == '' ?
                                <TouchableOpacity disabled={true}
                                    style={styles.comentarButton}
                                    onPress={() => this.guardarComentario() }> 
                                    <Text style={styles.textButton}>Publicar</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={styles.comentarButton}
                                    onPress={() => this.guardarComentario() }> 
                                    <Text style={styles.textButton}>Publicar</Text>
                                </TouchableOpacity>
                            }
                        </View>
                    </Modal> :
                    <Text> </Text>
                }

                { 
                   this.props.postData.data.owner == auth.currentUser.email ?
                   <TouchableOpacity style={styles.eliminar} onPress={() => this.eliminarPosteo() }> 
                            <Text style={styles.closeButton}>X</Text>
                    </TouchableOpacity> :
                    <Text></Text>
                } 
                <Text style={styles.fecha}>{new Date(this.props.postData.data.createdAt).toDateString().slice(4)} </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        borderRadius: 20,
        margin: 15,
        boxShadow: '5px 5px 10px #1b1a1b, -5px -5px 10px #6b686d',
        backgroundColor: '#333333',
    },
    image:{
        height: 258,
        borderRadius: 20,
        overflow: "hidden",
    },
    subcontainer:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 12,
    },
    owner:{
        color: 'white',
        fontSize: 16,
        width: '70%',
        fontWeight: 'bold',
    },
    icon:{
        color: '#5f9ea0',
        width: '10%',
        fontSize: 22,
    },
    likeNumber:{
        color: '#fff',
        width: '10%',
        fontSize: 16,
    },
    caption:{
        paddingLeft: 10,
        color: '#fff',
        marginBottom: 15,
    },
    verComentarios:{
        width: '45%',
        margin: '10',
        paddingVertical: 5,
        textAlign: 'center',
        borderRadius: 20,
        borderColor: '#5f9ea0',
        borderWidth: 1,
        borderStyle: 'solid',
        alignSelf: 'center',
    },
    textoVerComentarios:{
        color: '#fff'
    },
    modalContainer:{
        width: '97%',
        borderRadius: 20,
        padding: 10,
        alignSelf: 'center',
        boxShadow: '5px 5px 10px #1b1a1b, -5px -5px 10px #6b686d',
        borderColor: '#2F2F2F',
        backgroundColor: '#2F2F2F',
        marginTop: 20,
        marginBottom: 10,
    },
    closeButton:{
        color: '#fff',
        padding: 5,
        backgroundColor: '#dc4545',
        alignSelf: 'flex-end',
        borderRadius: 20,
        paddingHorizontal: 8,
    },
    comentarios:{
        color: '#fff',
        marginVertical: 5,
    },
    inputContainer:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    input:{
        height: 20,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        marginVertical: 10,
        width: '75%',
        lineHeight: 5,
        marginRight: 5,
    },
    comentarButton: {
        backgroundColor: '#6db1b3',
        padding: 5,
        textAlign: 'center',
        borderRadius: 10,
        width: '22%',
        height: 30,
    },
    textButton: {
        color: '#fff',
    },
    eliminar:{
        position: 'absolute',
        top: 10,
        alignSelf: 'flex-end',
        marginRight: 10,
    },
    fecha: {
        color: '#dadada',
        paddingLeft: 12,
        marginBottom: 10,
    }
})

export default Post