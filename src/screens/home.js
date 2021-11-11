import React, {Component} from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator, TextInput } from 'react-native';
import Login from '../screens/login';
import Register from '../screens/register';
import CommentForm from '../screens/commentForm';
import Post from '../components/Post';
import { auth, db } from '../firebase/config';



class Home extends Component{
constructor(props){
    super(props);
    this.state={
        posteos: [],
    }
}
componentDidMount(){
    db.collection('posts').onSnapshot(
        docs => {
            // Array para crear datos en formato más útil
            let posts = [];
            docs.forEach( doc => {
                posts.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            console.log(posts);
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
            data = {this.state.posteos}
            keyExtractor = { post => post.id}
            renderItem = {({item}) => <Post postData={item} /> } 
            // <Text>{item.data.texto}</Text>} --> podriamos armar un componente mas complejo y renderizarlo con los datos de cada doc
            />
        

        </View>
        )  
    }
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        marginBottom: 20,
        padding: 10, 
   },
   image: {
    height: 250
    }
 }) 
 
export default Home;