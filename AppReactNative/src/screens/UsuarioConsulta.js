import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';

export default class UsuarioConsulta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            usuario: ''
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => this.load());
    }

    load() {
        let idUsuario = this.props.navigation.getParam('idUsuario');
        let url = `${REACT_APP_URL}/usuarios/${idUsuario}`;

        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({ usuario: json });
        });
    }

    render() {
        const usuario = this.state.usuario;
        return (
            <View  style={styles.container2}>
                <View style={styles.container}>
                    <Text style={styles.titulo}>{'Login'}</Text>
                    <Text style={styles.texto}>{usuario.login}</Text>
                </View>
                <View style={styles.container}>
                    <Text style={styles.titulo}>{'Senha'}</Text>
                    <Text style={styles.texto}>{usuario.senha}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'lightgray',
    },
    container2: {
        flex: 1,
        backgroundColor: 'lightgray',
    },
    titulo: {
        fontSize: 15,
        margin: 5,
        color: 'black',
    },
    texto: {
        fontSize: 15,
        margin: 5,
    },
});