import React, {Component} from 'react';
import { Input, Card, Text, Button, ListItem, Overlay } from 'react-native-elements';
import { StyleSheet, FlatList, ScrollView } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';
import Usuario from '../component/Usuario';

export default class ListaUsuarios extends Component {

    constructor(props){
        super(props);
        this.state = { usuarios: [], openAdicionar: false, login: '', senha: '', errMsg: '' }
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => this.recarregarUsuarios());
    }

    recarregarUsuarios() {
        let url = `${REACT_APP_URL}/usuarios`;

        fetch(url)
            .then(response => response.json())
            .then(json => this.setState({ usuarios: [].concat(json) }));
    }

    adicionar() {
        const uri = `${REACT_APP_URL}/usuarios`;
        
        const requestInfo = {
            method: 'POST',
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
                    this.setState({ openAdicionar: false, login: '', senha: '', errMsg: '' });
                    this.recarregarUsuarios();
                    return;
                } 
                throw new Error("Não foi possível adicionar o usuario.");
            })
            .catch(e => this.setState({errMsg: e.message}));
    }

    openCloseModalAdicionar(isOpen){
        this.setState({ openAdicionar: isOpen });
    }
    
    render() {
        return (
            <ScrollView>
                <Card>
                    <FlatList 
                        data={this.state.usuarios} 
                        keyExtractor={item => String(item.id)} 
                        renderItem={ ({item}) => 
                            <Usuario usuario={item} recarregarUsuariosCallback={() => this.recarregarUsuarios()}/>
                        }
                    />
                    <Button type="clear" title="Adicionar" onPress={this.openCloseModalAdicionar.bind(this, true)}/>
                </Card>
                <Overlay isVisible={this.state.openAdicionar} height={220} onBackdropPress={this.openCloseModalAdicionar.bind(this, false)}>
                    <Input placeholder="Usuário" autoCapitalize="none" onChangeText={texto => this.setState({login: texto})}/>
                    <Input placeholder="Senha" autoCapitalize="none" secureTextEntry={true} onChangeText={texto => this.setState({senha: texto})}/>
                    <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                    <Button type="clear" title="Adicionar" onPress={this.adicionar.bind(this)}/>
                    <Button type="clear" title="Cancelar" onPress={this.openCloseModalAdicionar.bind(this, false)}/>
                </Overlay>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    errMsg: {
        color: 'red',
    }
});