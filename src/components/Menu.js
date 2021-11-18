import React, {Component} from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { auth } from "../firebase/config";

import Home from '../screens/home'
import Login from '../screens/login'
import Register from '../screens/register'
import Profile from '../screens/profile'
import PostForm from '../screens/postForm'
import Buscador from '../screens/buscador';

const Drawer = createDrawerNavigator();

class Menu extends Component{
    constructor(){
        super();
        this.state = {
            loggedIn: false,
            userData: '',
            errorMessage: '',
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

    register(email, pass, username){
        auth.createUserWithEmailAndPassword(email, pass)
            .then((res) => {
                res.user.updateProfile({
                    displayName: username})
            })
            .catch(error => {
                console.log(error)
                this.setState({
                    errorMessage: error.message,
                    errorCode: error.code,
                })
            })
    }

    login(email, pass){
        auth.signInWithEmailAndPassword(email, pass)
        .then(res => {
            console.log('Logueado')
            console.log(res)
            this.setState({
                loggedIn: true,
                userData: res.user,
            })
        }) 
        .catch(error => {
            console.log(error)
            this.setState({
            errorMessage: error.message,
            errorCode: error.code,
            })
        })
    }

    logout(){
        auth.signOut() //deslogueamos de firebase y elimina los datos internos del usuario
        .then(res => {
            this.setState({
                loggedIn: false,
                userData: '',
            })
        }) 
    }

    render(){
        return(
            <NavigationContainer >
            {this.state.loggedIn == false ?
                <Drawer.Navigator screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#d4d4d4',
                    },
                }}
                >
                    <Drawer.Screen name='Login' component={() => <Login login={(email, pass) => this.login(email, pass)} errorMessage={this.state.errorMessage} errorCode={this.state.errorCode} />} />
                    <Drawer.Screen name='Registro' component={() => <Register register={(email, pass, username) => this.register(email, pass, username)} errorMessage={this.state.errorMessage} errorCode={this.state.errorCode}/>} />
                </Drawer.Navigator> :
                <Drawer.Navigator screenOptions={{
                    drawerStyle: {
                        backgroundColor: '#d4d4d4',
                    },
                }}>
                    <Drawer.Screen name='Home' component={() => <Home />} />
                    <Drawer.Screen name='Nuevo Post' component={(drawerProps) => <PostForm drawerProps={drawerProps} />} />
                    <Drawer.Screen name='Mi Perfil' component={() => <Profile logout={ () => this.logout()} userData={this.state.userData} />} />
                    <Drawer.Screen name='Buscador' component={() => <Buscador />} />
                </Drawer.Navigator>
            }
            </NavigationContainer> 
        )
    }
}

export default Menu