import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Input, Card, Text, Button, Overlay } from 'react-native-elements';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';
import DatePicker from 'react-native-datepicker';
import ListaFotos from '../component/ListaFotos';

export default class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            errMsg: '',
            post_titulo: '',
            post_data: '',
            post_categoria: '',
            texto: '',
            imagem: '',
            link: '',
            openConsultar: false,
            openAlterar: false,
            post: this.props.post,
            conteudo: JSON.parse(this.props.post.post_conteudo)
        }
    }

    componentDidMount() {
        this.setState({
            post_titulo: this.state.post.post_titulo,
            post_data: this.state.post.post_data,
            post_categoria: this.state.post.post_categoria,
            texto: this.state.conteudo.texto,
            imagem: this.state.conteudo.imagem,
            link: this.state.conteudo.link
        });
    }
    
    openCloseModalConsultar(isOpen){
        if(this.state.openAlterar) return;
        this.setState({ openConsultar: isOpen });
    }

    openCloseModalAlterar(isOpen){
        this.setState({ openAlterar: isOpen });
    }

    salvar(post) {
        let url = `${REACT_APP_URL}/posts/${post.id}`;

        let post_conteudo = JSON.stringify({
            texto: this.state.texto,
            imagem: this.state.imagem,
            link: this.state.link
        });

        AsyncStorage.getItem('token')
            .then(token => {
                return {
                    method: 'PUT',
                    body: JSON.stringify({
                        post_titulo: this.state.post_titulo,
                        post_data: this.state.post_data,
                        post_categoria: this.state.post_categoria,
                        post_conteudo: post_conteudo
                    }),
                    headers: new Headers({
                        'Content-type': 'application/json',
                        'Authorization': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(response => {
                if(response.ok){
                    let postNovo = {};
                    postNovo.post_titulo = this.state.post_titulo;
                    postNovo.post_data = this.state.post_data;
                    postNovo.post_categoria = this.state.post_categoria;
                    postNovo.post_conteudo = post_conteudo;
                    postNovo.id = this.state.post.id;
                    this.setState({conteudo: JSON.parse(post_conteudo)});
                    this.setState({openAlterar: false, post: postNovo, errMsg: ''});
                    this.props.recarregarPostsCallback();
                    return;
                } 
                throw new Error("Não foi possível alterar o post.");
            })
            .catch(e => this.setState({errMsg: e.message}));
    }

    excluir(idPost) {
        let url = `${REACT_APP_URL}/posts/${idPost}`;

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
                    this.setState({ openConsultar: false, errMsg: '' });
                    this.props.recarregarPostsCallback();
                    return;
                } 
                throw new Error("Não foi possível deletar o post.");
            })
            .catch(e => this.setState({errMsg: e.message}));
    }
    
    selecionarFotoGaleria(path){
        this.setState({imagem: path});
    }

    render() {
        let post = this.state.post;
        let conteudo = this.state.conteudo;

        return (
            <View>
                <TouchableOpacity onPress={this.openCloseModalConsultar.bind(this, true)}>
                    <Card title={post.post_titulo} image={{uri: REACT_APP_URL+conteudo.imagem}}>
                        <Text style={{marginBottom: 10}}>{conteudo.texto}</Text>
                        <Text style={{marginBottom: 10}}>{post.post_data} {post.post_categoria}</Text>
                    </Card>
                </TouchableOpacity>
                <Overlay isVisible={this.state.openConsultar} onBackdropPress={this.openCloseModalConsultar.bind(this, false)}>
                    <View>
                        <Card title={post.post_titulo} image={{uri: REACT_APP_URL+conteudo.imagem}}></Card>
                        <Text h4>{conteudo.texto}</Text>
                        <Text h6>{post.post_data} {post.post_categoria}</Text>
                        <Text h6>{conteudo.link}</Text>
                        <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                        <Button type="clear" title="Excluir" onPress={this.excluir.bind(this, this.state.post.id)}/>
                        <Button type="clear" title="Alterar" onPress={this.openCloseModalAlterar.bind(this, true)}/>
                        <Button type="clear" title="Cancelar" onPress={this.openCloseModalConsultar.bind(this, false)}/>
                    </View>
                </Overlay>
                <Overlay isVisible={this.state.openAlterar} onBackdropPress={this.openCloseModalAlterar.bind(this, false)}>
                    <View>
                        <Input placeholder="Título" defaultValue={post.post_titulo} autoCapitalize="none" onChangeText={texto => this.setState({post_titulo: texto})}/>
                        <Input placeholder="Link" defaultValue={conteudo.link} autoCapitalize="none" onChangeText={texto => this.setState({link: texto})}/>
                        <DatePicker date={this.state.post_data} format="YYYY-MM-DD" onDateChange={(date) => {this.setState({post_data: date})}}/>
                        <Input placeholder="Categoria" defaultValue={post.post_categoria} autoCapitalize="none" onChangeText={texto => this.setState({post_categoria: texto})}/>
                        <Input placeholder="Texto" defaultValue={conteudo.texto} autoCapitalize="none" onChangeText={texto => this.setState({texto: texto})}/>
                        <Input disabled={true} value={this.state.imagem} autoCapitalize="none" onChangeText={texto => this.setState({imagem: texto})}/>
                        <ListaFotos selecionarCallback={this.selecionarFotoGaleria.bind(this)}/>
                        <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                        <Button type="clear" title="Alterar" onPress={this.salvar.bind(this, this.state.post)}/>
                        <Button type="clear" title="Cancelar" onPress={this.openCloseModalAlterar.bind(this, false)}/>
                    </View>
                </Overlay>
            </View>
        );
    }
}

const styles = StyleSheet.create({
});