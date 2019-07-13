import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    Button,
    Text,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('screen').width;

export default class Login extends Component {

    constructor() {
        super();

        this.state = {
            usuario: '',
            senha: '',
            mensagem: ''
        }
    }

    logar() {
        const uri = "http://alexeiaj.duckdns.org:8800/auth";
        
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                login: this.state.usuario,
                senha: this.state.senha,
            }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        }

        fetch(uri, requestInfo)
            .then(response => {
                if(response.ok) return response.text();
                throw new Error("Não foi possível efetuar login.");
            })
            .then(json => {
                let tokenObj = JSON.parse(json);
                return `${tokenObj.tipo} ${tokenObj.token}`;
            })
            .then(token => {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('usuario', this.state.usuario);

                this.props.navigation.push('Feed');
            })
            .catch(e => this.setState({mensagem: e.message}));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Usuário.." autoCapitalize="none" onChangeText={texto => this.setState({usuario: texto})}/>
                    <TextInput style={styles.input} placeholder="Senha.." autoCapitalize="none" secureTextEntry={true} onChangeText={texto => this.setState({senha: texto})}/>
                    <Button title="Login" onPress={this.logar.bind(this)}/>
                </View>

                <Text style={styles.mensagem}>
                    {this.state.mensagem}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: width * 0.8,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    mensagem: {
        color: 'red',
        marginTop: 15,
        fontSize: 10,
    },
});