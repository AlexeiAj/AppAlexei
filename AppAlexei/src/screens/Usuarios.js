import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    ScrollView,
    Button,
} from 'react-native';

import Usuario from '../components/Usuario';

export default class Usuarios extends Component {

    constructor(props){
        super(props);
        this.state = {
            usuarios: []
        }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => this.load());
    }

    load() {
        let url = 'http://alexeiaj.duckdns.org:8800/usuarios';
        
        if(this.props.navigation.getParam('idUsuario')){
            url = `${url}/${this.props.navigation.getParam('idUsuario')}`;
        }

        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({ usuarios: [].concat(json) });
        });
    }

    cadastrarUsuario() {
        this.props.navigation.push('CadastroDeUsuario');
    }

    perfilUsuario(idUsuario) {
        this.props.navigation.push('PerfilUsuario', {
            idUsuario: idUsuario
        });
    }

    render() {
        return (
            <ScrollView>
                <FlatList 
                    style={styles.container} 
                    data={this.state.usuarios} 
                    keyExtractor={item => String(item.id)} 
                    renderItem={ ({item}) => 
                        <Usuario usuario={item} perfilUsuarioCallback={this.perfilUsuario.bind(this)} isConsulting={!!this.props.navigation.getParam('idUsuario')}/>
                    }
                />
                <Button title={`Cadastrar usuario`} onPress={this.cadastrarUsuario.bind(this)}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    }
});