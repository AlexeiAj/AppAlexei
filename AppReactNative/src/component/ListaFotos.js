import React, { Component } from 'react';
import { Card, Button, Overlay } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';

export default class ListaFotos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errMsg: '',
            openConsultar: false,
            fotos: [],
        }
    }

    componentDidMount() {
        let url = `${REACT_APP_URL}/fotos`;

        AsyncStorage.getItem('token')
            .then(token => {
                return {
                    headers: new Headers({
                        'Authorization': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(response => response.json())
            .then(json => this.setState({ fotos: [].concat(json) }));
    }
    
    openCloseModalConsultar(isOpen){
        if(this.state.openAlterar) return;
        this.setState({ openConsultar: isOpen });
    }

    selecionarFoto(path){
        this.openCloseModalConsultar(false);
        this.props.selecionarCallback(path);
    }

    render() {
        return (
            <View>
                <Button type="clear" title="Galeria" onPress={this.openCloseModalConsultar.bind(this, true)}/>
                <Overlay isVisible={this.state.openConsultar} onBackdropPress={this.openCloseModalConsultar.bind(this, false)}>
                    <View>
                        <FlatList 
                            data={this.state.fotos} 
                            keyExtractor={item => String(item.id)} 
                            renderItem={ ({item}) => 
                                <TouchableOpacity onPress={() => this.selecionarFoto(item.imagem_path + item.imagem_name)}>
                                    <Card image={{uri: REACT_APP_URL + item.imagem_path + item.imagem_name}}></Card>
                                </TouchableOpacity>
                            }
                        />
                        <Button type="clear" title="Cancelar" onPress={this.openCloseModalConsultar.bind(this, false)}/>
                    </View>
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});