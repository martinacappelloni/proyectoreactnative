import React, {Component} from 'react'
import {Text, TouchableOpacity, View, StyleSheet, FlatList} from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope} from '@fortawesome/free-regular-svg-icons'
import { faUserCircle} from '@fortawesome/free-regular-svg-icons'
import { faHistory} from '@fortawesome/free-solid-svg-icons'
import { faImages} from '@fortawesome/free-regular-svg-icons'
import { db, auth } from '../firebase/config';
import Post from '../components/Post';

class Profile extends Component{
    constructor(props){
        super(props);
        this.state = {
            posteos: [],
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
                    })
                })
            }
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.text}> <FontAwesomeIcon icon={faEnvelope} /> {this.props.userData.email}</Text>
                <Text style={styles.text}> <FontAwesomeIcon icon={faUserCircle} /> {this.props.userData.displayName}</Text>
                <Text style={styles.text}> <FontAwesomeIcon icon={faHistory} /> {this.props.userData.metadata.lastSignInTime}</Text>            
                {
                    this.state.posteos.length == 0 ?
                    <Text style={styles.noPosts}>{this.props.userData.displayName} no ha realizado ninguna publicación</Text> :
                    <View style={styles.FlatListContainer}>
                    <FlatList 
                        data={this.state.posteos}
                        keyExtractor={post => post.id}
                        renderItem={({item}) => <Post postData={item} />}
                    /> 
                    <Text style={styles.text} > <FontAwesomeIcon icon={faImages} /> {this.state.posteos.length}</Text>
                    </View>
                }
                <TouchableOpacity style={styles.button} onPress={() => this.props.logout()} > 
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
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
    noPosts:{
        color:'#fff',
        fontSize: 15,
        alignSelf: 'center',
        marginVertical: 100,
    },
    FlatListContainer:{
        backgroundColor: '#4D4D4D',
        flex: 1,
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
        fontWeight: 'bold',
        color: '#fff',
    },
})

export default Profile