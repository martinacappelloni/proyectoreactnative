import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Camera} from 'expo-camera';
import {db, storage} from '../firebase/config'; //conexion de base de datos y storage donde vamos a guardar las fotos

class MyCamera extends Component{
    constructor(props){
        super(props)
        this.state = {
            permission: false, //permisos de la camara en el dispositivo
            photo: '', //guardar la url/uri de la foto
            showCamera: true,
        }
        this.camera //la referencia a esta camara
    }
    componentDidMount(){
        Camera.requestCameraPermissionsAsync()
            .then (()=>{
                this.setState({
                    permission: true,
                })
            })
            .catch( error => console.log(error))

        //investigar
        // console.log(Camera)
        // console.log(this.camera)
    }

    takePicture(){
        this.camera.takePictureAsync()
            .then((photo)=>{
                this.setState({
                    photo: photo.uri, //la ruta interna temporal a la foto para mostrarsela al usuario
                    showCamera: false,
                })
            })
            .catch( error => console.log(error))
    }

    savePhoto(){
        //Tiene que buscar la foto de la uri temporal y subirla al storage
        fetch(this.state.photo)
            .then(res => res.blob()) //blob es lo mismo que json pero cuando usas archivos binarios
            .then( image =>{
                //vamos a guardar la foto en storage de firebase y obtener la url publica
                const ref = storage.ref(`photos/${Date.now()}.jpg`) //crear el nombre del archivo de la foto
                ref.put(image)
                    .then(()=>{
                        ref.getDownloadURL()
                            .then( url => {
                                this.props.onImageUpload(url)
                                this.setState({
                                    photo:'',
                                })
                            })
                            .catch(error => console.log(error))
                    })
                    .catch(error => console.log(error))
                })
            .catch(error => console.log(error))
    }

    clear(){
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
                            <TouchableOpacity onPress={()=>this.savePhoto()}>
                                <Text>Aceptar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>this.clear()}> 
                                <Text>Rechazar</Text>
                            </TouchableOpacity>
                        </View>
                    </React.Fragment> :
                //render de la camara
                <View style={styles.container}>
                    <Camera 
                        style={styles.cameraBody}
                        type={Camera.Constants.Type.back}
                        ref={ reference => this.camera = reference}
                    />
                    <TouchableOpacity style={styles.button} onPress={()=>this.takePicture()}>
                        <Text>Sacar foto</Text>
                    </TouchableOpacity>
                </View>
                :
                //render mensaje
                <Text>No tienes permisos para usar la camara</Text>
            }
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        flex: 1,
    },
    cameraBody:{
        flex: 7,
    },
    button:{
        flex: 1,
        justifyContent: 'center',
    },
})

export default MyCamera