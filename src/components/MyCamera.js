import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Camera} from 'expo-camera'
import { auth, db, storage } from '../firebase/config';

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
                <View>
                <TouchableOpacity style={styles.camerabutton} onPress={()=> this.savePhoto()}>
                    <Text> Aceptar </Text> 
                </TouchableOpacity>
                <TouchableOpacity style={styles.camerabutton} onPress={()=> this.clear()}>
                    <Text> Rechazar </Text> 
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
                <TouchableOpacity style={styles.camerabutton} onPress={()=> this.takePicture()}>
                    <Text> Sacar Foto </Text> 
                </TouchableOpacity>
            </View>
            :
            // render mensaje
            <Text>No tienes permisos para usar la cámara</Text>
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
   camerabutton: {
    flex: 1,
    justifyContent: 'center',
    },   
})

export default MyCamera;