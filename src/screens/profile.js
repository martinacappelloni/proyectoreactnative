import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native'
import { db, auth } from '../firebase/config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope} from '@fortawesome/free-regular-svg-icons'
import { faUserCircle} from '@fortawesome/free-regular-svg-icons'
import { faHistory} from '@fortawesome/free-solid-svg-icons'
import { faImages} from '@fortawesome/free-regular-svg-icons'
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
                    <Image 
                        style={styles.image}
                        source={require('../../assets/retrica.png')}
                        resizeMode="contain"
                    />
                    <Text style={styles.text}> <FontAwesomeIcon icon={faEnvelope} /> {this.props.userData.email}</Text>
                    <Text style={styles.text}> <FontAwesomeIcon icon={faUserCircle} /> {this.props.userData.displayName}</Text>
                    <Text style={styles.text}> <FontAwesomeIcon icon={faHistory} /> {this.props.userData.metadata.lastSignInTime}</Text>
                    <FlatList 
                        data={this.state.posteos}
                        keyExtractor={post => post.id}
                        renderItem={({item}) => <Post postData={item} />}
                    /> 
                    {
                        this.state.posteos == undefined ?
                        <Text style={styles.text}>El usuario no ha realizado ninguna publicación</Text> :
                        <Text style={styles.text} > <FontAwesomeIcon icon={faImages} /> {this.state.posteos.length}</Text>
                    }
                    <TouchableOpacity style={styles.button} onPress={() => this.props.logout(this.state.email, this.state.password)} > 
                        <Text style={styles.logout}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#4D4D4D',
        flex: 1,
        padding: 10,
    },
    image:{
        height: 100,
        alignSelf: 'center',
        margin: 30,
    },
    text:{
        color:'#fff',
        fontSize: 16,
        marginHorizontal: 10,
        marginVertical: 2,
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
    logout: {
        color: '#fff'
    },
})

export default Profile