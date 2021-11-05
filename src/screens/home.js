import React, {Component} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Image, ActivityIndicator, FlatList, TextInput} from 'react-native'
import {db, auth} from '../firebase/config'
import Post from '../components/Post';

class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            posteos: [],
        }
    }

    componentDidMount(){
        db.collection('posts').orderBy('createdAt', 'desc').onSnapshot(
            docs => { 
                //Array para crear datos en formato mas util
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                console.log(posts)
                this.setState({
                    posteos: posts,
                })
            }
        )
    }

    render(){
        return(
            <View style={styles.container}> 
                <FlatList 
                    data={this.state.posteos}
                    keyExtractor={post => post.id}
                    renderItem={({item}) => <Post postData={item} />} />  
            </View>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: 10,
        display: 'flex',
    },
})

export default Home