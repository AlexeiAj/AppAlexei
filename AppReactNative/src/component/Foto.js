import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Card, Text, Button, Overlay } from 'react-native-elements';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';

export default class Foto extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errMsg: '',
            foto: this.props.foto
        }
    }

    excluir(idFoto) {
        let url = `${REACT_APP_URL}/fotos/${idFoto}`;

        AsyncStorage.getItem('token')
            .then(token => {
                return {
                    method: 'DELETE',
                    headers: new Headers({
                        'Authorization': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(response => {
                if(response.ok){
                    this.props.recarregarGaleriaCallback();
                    return;
                } 
                throw new Error("Não foi possível deletar a foto.");
            })
            .catch(e => this.setState({errMsg: e.message}));
    }

    render() {
        let foto = this.state.foto;

        return (
            <Card image={{uri: REACT_APP_URL + foto.imagem_path + foto.imagem_name}}><Button type="clear" title="Excluir" onPress={this.excluir.bind(this, this.state.foto.id)}/></Card>
        );
    }
}

const styles = StyleSheet.create({
});