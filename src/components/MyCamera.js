import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Camera} from 'expo-camera'
import { storage } from '../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faThumbsUp} from '@fortawesome/free-solid-svg-icons'
import { faThumbsDown} from '@fortawesome/free-solid-svg-icons'

class MyCamera extends Component{
    constructor(props){
        super(props);
        this.state = {
            permission: false, // permisos de la cámara en el dispositivo
            photo: '', // para guardar la url o uri de la foto
            showCamera: true,
        }
        this.camera // la referencia a esta cámara
    }

    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
        .then(()=>{
            this.setState({
                permission: true,
            })
        })
        .catch( error => console.log(error))
    }

    takePicture(){
        this.camera.takePictureAsync()
        .then((photo)=>{
            this.setState({
                photo: photo.uri, // la ruta interna temporal a la foto
                showCamera: false,
            })
        })
        .catch( error => console.log(error))
    }

    savePhoto(){
        // Tiene que buscar la foto de la uri temporal y subirla al storage
        fetch(this.state.photo)
        .then(res => res.blob()) //blob es para archivos binarios (no esta hecho con textos, es binario)
        .then( image =>{
            // vamos a guardar la foto en storage y obtener la url pública
            const ref = storage.ref(`photos/${Date.now()}.jpg`)
            ref.put(image) // como PUT es un metodo asincronico va a tener su then y catch
                .then(()=>{
                    ref.getDownloadURL() // como getDownloadURL es un metodo asincronico va a tener su then y catch
                        .then(url =>{
                            this.props.onImageUpload(url);
                            this.setState({
                                photo: '',
                            })
                        })
                        .catch( error => console.log(error))
                })
                .catch( error => console.log(error))
        })
        .catch( error => console.log(error))
    }

    clear(){
        // cambiar el estado de photo a '' (cadena de texto vacia)
        // cambiar showCamera a true
        this.setState({
            photo: '',
            showCamera: true, 
        })
    }

    render(){
        return(
            <View style={styles.container}>
                {
                this.state.permission ?
                this.state.showCamera === false ? 
                <React.Fragment>
                    <Image
                        style={styles.cameraBody}
                        source={{uri:this.state.photo}}
                    />
                    <View style={styles.upDownContainer}>
                        <TouchableOpacity style={styles.thumbsUp} onPress={()=> this.savePhoto()}>
                            <FontAwesomeIcon icon={faThumbsUp} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.thumbsDown} onPress={()=> this.clear()}>
                            <FontAwesomeIcon icon={faThumbsDown} />
                        </TouchableOpacity>
                    </View>
                </React.Fragment> :
                // render de la cámara
                <View style={styles.container}>
                    <Camera 
                        style={styles.cameraBody}
                        type={Camera.Constants.Type.back}
                        ref={(reference)=> this.camera = reference} 
                    />
                    <TouchableOpacity style={styles.takePicture} onPress={()=> this.takePicture()}>
                        <Text style={styles.texto}> Sacar Foto </Text> 
                    </TouchableOpacity>
                </View>
                :
                // render mensaje
                <Text style={styles.texto}>No tienes permisos para usar la cámara</Text>
            }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cameraBody: {
        flex: 7,
    },
    upDownContainer:{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        padding: 20,
    },
    thumbsUp:{
       color: '#6db1b3',
       fontSize: 50,
    },
    thumbsDown:{
        color: '#dc4545',
        fontSize: 50,
    },
    takePicture:{
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
    texto:{
        color: '#fff',
        alignSelf: 'center',
    }
})

export default MyCamera;