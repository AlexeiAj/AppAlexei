import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    Button,
    Text,
} from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';

const width = Dimensions.get('screen').width;

export default class UsuarioInclusao extends Component {

    constructor() {
        super();

        this.state = {
            usuario: '',
            senha: '',
            mensagem: ''
        }
    }

    salvar() {
        const uri = `${REACT_APP_URL}/usuarios`;
        
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
                if(response.ok){
                    this.props.navigation.pop();
                    return;
                } 
                throw new Error("Não foi possível cadastrar o usuario.");
            })
            .catch(e => this.setState({mensagem: e.message}));
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput style={styles.input} placeholder="Usuário.." autoCapitalize="none" onChangeText={texto => this.setState({usuario: texto})}/>
                    <TextInput style={styles.input} placeholder="Senha.." autoCapitalize="none" secureTextEntry={true} onChangeText={texto => this.setState({senha: texto})}/>
                    <Button title="Salvar" onPress={this.salvar.bind(this)}/>
                </View>

                <Text style={styles.mensagem}>{this.state.mensagem}</Text>
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