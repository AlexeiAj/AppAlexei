import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TextInput,
    Button,
    Text,
} from 'react-native';


const width = Dimensions.get('screen').width;

export default class UsuarioAlteracao extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            usuario: '',
            login: '',
            senha: '',
            mensagem: ''
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => this.load());
    }

    load() {
        let idUsuario = this.props.navigation.getParam('idUsuario');
        let url = `http://alexeiaj.duckdns.org:8800/usuarios/${idUsuario}`;

        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({ usuario: json });
        });
    }

    salvar() {
        const uri = `http://alexeiaj.duckdns.org:8800/usuarios/${this.state.usuario.id}`;
        
        const requestInfo = {
            method: 'PUT',
            body: JSON.stringify({
                login: this.state.login,
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
                throw new Error("Não foi possível alterar o usuario.");
            })
            .catch(e => this.setState({mensagem: e.message}));
    }

    render() {
        const usuario = this.state.usuario;
        return (
            <View style={styles.container}>
                <View style={styles.form}>
                    <TextInput style={styles.input} defaultValue={usuario.login} placeholder="Usuário.." autoCapitalize="none" onChangeText={texto => this.setState({login: texto})}/>
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