import React, { Component } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from '../screens/home';
import Register from '../screens/register';
import Login from '../screens/login';
import CommentForm from '../screens/commentForm';
import Profile from '../screens/profile';
import PostForm from '../screens/postForm';
import { auth } from '../firebase/config'

const Drawer = createDrawerNavigator();

class Menu extends Component{
    constructor(){
        super();
        this.state = {
            loggedIn: false,
            userData: '',
            errorMsj: '',
            errorCode: '',

        }
    }
    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(user){
          this.setState({
              loggedIn: true,
              userData: user,
                })
            }  
        })

    }


    register(email, pass){
        auth.createUserWithEmailAndPassword(email, pass)
        .then( ()=>{
            console.log('registrado');
        })
        .catch( error =>{
            console.log(error);
            this.setState({
                errorMsj: error.msj,
                errorCode: error.errorCode,
            })
        })
    }
    login(email, pass){
        auth.signInWithEmailAndPassword(email, pass)
        .then( (response)=>{
            console.log('logueado');
            console.log(response);
            this.setState({
                loggedIn: true,
                userData: response.user,
            })
        })
        .catch( error =>{
            console.log(error);
            this.setState({
                errorMsj: error.msj,
                errorCode: error.errorCode,
            })

        })  

    }
    logout(){
        auth.signOut() // logout de firebase
        .then( (res)=>{
            this.setState({
                loggedIn: false,
                user: '',
            })
        });
    }
    render(){
        return(
            this.state.loggedIn == false ?
        < NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name='Login' component={()=> <Login login={(email, pass)=> this.login(email, pass)} errorMsj={this.state.errorMsj} errorCode={this.state.errorCode}/>}/>
                <Drawer.Screen name='Registro' component={()=> < Register register={(email, pass)=> this.register(email, pass)} errorMsj={this.state.errorMsj} errorCode={this.state.errorCode}/>}/>
            </Drawer.Navigator>
        </NavigationContainer>:
        <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name='Home' component={()=> < Home />}/>
        <Drawer.Screen name='New Post' component={(drawerProps)=> < PostForm drawerProps={drawerProps}/>}/>
                <Drawer.Screen name='Mi Perfil'component={()=> <Profile logout={()=> this.logout()} userData={this.state.userData}/>}/>
                <Drawer.Screen name='Comentarios'component={()=> <CommentForm />}/>
            </Drawer.Navigator>
        </NavigationContainer> 
        )
    }

}
export default Menu