import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native'
import { db, auth } from '../firebase/config';
import Post from '../components/Post';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            posteos: [],
            loading: true
        }
    }

componentDidMount(){
    db.collection('posts').where('owner', '==', auth.currentUser.email).orderBy('createdAt', 'desc').onSnapshot(
        docs => {
            let posts = [];
            docs.forEach( doc => {
                posts.push({
                    id: docs.id,
                    data: doc.data()
                })
                this.setState({
                    posteos: posts,
                    loading: false
                })
            })
        }
    )
}

    render(){
        console.log(this.props.userData)
        return(
            <View style={styles.container}>
                <View>
                    <Text>Email registrado: {this.props.userData.email}</Text>
                    <Text>User registrado: {this.props.userData.displayName}</Text>
                    {/* <Text>Usuario creado: {this.props.userData.metadata.creationTime}</Text> */}
                    <Text>Ultimo login: {this.props.userData.metadata.lastSignInTime}</Text>
                    {
                    this.state.posteos == undefined ?
                    <Text>El usuario no ha realizado ninguna publicación</Text> :
                    <Text>Cantidad de posteos del usuario: {this.state.posteos.length}</Text>
                    }
                    <FlatList 
                    data={this.state.posteos}
                    keyExtractor={post => post.id}
                    renderItem={({item}) => <Post postData={item} />} /> 
                    <TouchableOpacity style={styles.touchable} onPress={() => this.props.logout(this.state.email, this.state.password)} > 
                        <Text style={styles.text}>Logout</Text>
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
        height: 20,
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
    },
    container:{
        backgroundColor: '#302c2e',
    }
})

export default Profile