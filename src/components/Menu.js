import React, {Component} from 'react'
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { auth } from "../firebase/config";

import Home from '../screens/home'
import Login from '../screens/login'
import Register from '../screens/register'
import Profile from '../screens/profile'
import PostForm from '../screens/postForm'

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

    register(email, pass){
        auth.createUserWithEmailAndPassword(email, pass)
            .then(() => {
                console.log('registrado')
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
            <NavigationContainer>
            {this.state.loggedIn == false ?
                <Drawer.Navigator>
                    <Drawer.Screen name='Login' component={() => <Login login={(email, pass) => this.login(email, pass)} errorMessage={this.state.errorMessage} errorCode={this.state.errorCode} />} />
                    <Drawer.Screen name='Registro' component={() => <Register register={(email, pass) => this.register(email, pass)} errorMessage={this.state.errorMessage} errorCode={this.state.errorCode}/>} />
                </Drawer.Navigator> :
                <Drawer.Navigator>
                    <Drawer.Screen name='Home' component={() => <Home />} />
                    <Drawer.Screen name='Nuevo Post' component={(drawerProps) => <PostForm drawerProps={drawerProps} />} />
                    <Drawer.Screen name='Mi Perfil' component={() => <Profile logout={ () => this.logout()} userData={this.state.userData} />} />
                </Drawer.Navigator>
            }
            </NavigationContainer> 
        )
    }
}

export default Menu