import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    ScrollView,
    Button,
    TouchableOpacity,
    Text,
} from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';

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
        let url = `${REACT_APP_URL}/usuarios`;

        fetch(url)
        .then(response => response.json())
        .then(json => {
            this.setState({ usuarios: [].concat(json) });
        });
    }

    usuarioConsulta(idUsuario) {
        this.props.navigation.push('UsuarioConsulta', {
            idUsuario: idUsuario
        });
    }

    usuarioInclusao() {
        this.props.navigation.push('UsuarioInclusao');
    }

    usuarioAlteracao(idUsuario) {
        this.props.navigation.push('UsuarioAlteracao', {
            idUsuario: idUsuario
        });
    }

    usuarioExclusao(idUsuario) {
        const uri = `${REACT_APP_URL}/usuarios/${idUsuario}`;
        
        const requestInfo = {
            method: 'DELETE'
        }

        fetch(uri, requestInfo)
            .then(response => {
                // console.warn( 
                if(response.ok){
                    this.props.navigation.replace('Usuarios');
                    return;
                } 
                throw new Error("Não foi possível deletar o usuario.");
            })
            .catch(e => this.setState({mensagem: e.message}));
    }
    
    render() {
        return (
            <ScrollView>
                <FlatList 
                    style={styles.container} 
                    data={this.state.usuarios} 
                    keyExtractor={item => String(item.id)} 
                    renderItem={ ({item}) => 
                        <TouchableOpacity style={styles.container2} onPress={() => this.usuarioConsulta(item.id)}>
                            <Text style={styles.texto}>{item.login}</Text>
                            <TouchableOpacity onPress={() => this.usuarioAlteracao(item.id)}>
                                <Text>{'E'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.usuarioExclusao(item.id)}>
                                <Text>{'X'}</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    }
                />
                <Button title={`Incluir usuario`} onPress={this.usuarioInclusao.bind(this)}/>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    },
    container2: {
        justifyContent: 'space-between',
        flexDirection: 'row',
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