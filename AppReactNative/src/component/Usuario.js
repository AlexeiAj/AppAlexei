import React, { Component } from 'react';
import { Input, Text, Button, ListItem, Overlay } from 'react-native-elements';
import { StyleSheet, View } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Usuario extends Component {

    constructor(props) {
        super(props);
        this.state = {errMsg: '', usuario: this.props.usuario, login: '', senha: '', openConsultar: false, openAlterar: false};
    }

    openCloseModalConsultar(isOpen){
        if(this.state.openAlterar) return;
        this.setState({ openConsultar: isOpen });
    }

    openCloseModalAlterar(isOpen){
        if(this.state.openConsultar) return;
        this.setState({ openAlterar: isOpen });
    }

    salvar(usuario) {
        const uri = `${REACT_APP_URL}/usuarios/${usuario.id}`;

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
                    usuario.login = this.state.login;
                    usuario.senha = this.state.senha;
                    this.setState({ openAlterar: false, usuario: usuario, login: '', senha: '', errMsg: '' });
                    this.props.recarregarUsuariosCallback();
                    return;
                } 
                throw new Error("Não foi possível alterar o usuario.");
            })
            .catch(e => this.setState({mensagem: e.message}));
    }

    excluir(idUsuario) {
            const uri = `${REACT_APP_URL}/usuarios/${idUsuario}`;
            
            const requestInfo = {
                method: 'DELETE'
            }
        
            fetch(uri, requestInfo)
                .then(response => {
                    if(response.ok){
                        this.setState({ openConsultar: false, login: '', senha: '', errMsg: '' });
                        this.props.recarregarUsuariosCallback();
                        return;
                    } 
                    throw new Error("Não foi possível deletar o usuario.");
                })
                .catch(e => this.setState({mensagem: e.message}));
    }

    render() {
        let usuario = this.state.usuario;

        return (
            <View>
                <ListItem
                    key={usuario}
                    title={usuario.login}
                    bottomDivider
                    chevron={
                        <Icon name='edit' size={24} onPress={this.openCloseModalAlterar.bind(this, true)}/>
                    }
                    onPress={this.openCloseModalConsultar.bind(this, true)}
                />
                <Overlay isVisible={this.state.openConsultar} height={220} onBackdropPress={this.openCloseModalConsultar.bind(this, false)}>
                    <Text h2>{this.state.usuario.login}</Text>
                    <Text h2>{this.state.usuario.senha}</Text>
                    <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                    <Button type="clear" title="Excluir" onPress={this.excluir.bind(this, this.state.usuario.id)}/>
                    <Button type="clear" title="Cancelar" onPress={this.openCloseModalConsultar.bind(this, false)}/>
                </Overlay>
                <Overlay isVisible={this.state.openAlterar} height={220} onBackdropPress={this.openCloseModalAlterar.bind(this, false)}>
                    <Input placeholder="Usuário" value={this.state.usuario.login} autoCapitalize="none" onChangeText={texto => this.setState({login: texto})}/>
                    <Input placeholder="Senha" autoCapitalize="none" secureTextEntry={true} onChangeText={texto => this.setState({senha: texto})}/>
                    <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                    <Button type="clear" title="Alterar" onPress={this.salvar.bind(this, this.state.usuario)}/>
                    <Button type="clear" title="Cancelar" onPress={this.openCloseModalAlterar.bind(this, false)}/>
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});