import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { REACT_APP_URL } from 'react-native-dotenv';
import { Input, Text, Card, Button } from 'react-native-elements';
import {
    StyleSheet,
    Dimensions,
} from 'react-native';

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
        const uri = `${REACT_APP_URL}/auth`;

        if(this.state.usuario === '' || this.state.senha === ''){
            this.setState({mensagem: "Por favor preencha login e senha!"});
            return;
        }
        
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

    cadastrar() {
        this.props.navigation.push('Usuarios');
    }

    render() {
        return (
            <Card image={require("../images/header.jpg")}>
                <Input placeholder="Usuário" autoCapitalize="none" onChangeText={texto => this.setState({usuario: texto})}/>
                <Input placeholder="Senha" autoCapitalize="none" secureTextEntry={true} onChangeText={texto => this.setState({senha: texto})}/>
                <Button type="clear" title="Login" buttonStyle={styles.botao_login} onPress={this.logar.bind(this)}/>
                <Button type="clear" title="Cadastrar" onPress={this.cadastrar.bind(this)}/>
                <Text style={styles.mensagem}>{this.state.mensagem}</Text>
            </Card>
        );
    }
}

const styles = StyleSheet.create({
    mensagem: {
        color: 'red',
    },
    botao_login: {
        marginTop: 15,
        marginBottom: 5
    }
});