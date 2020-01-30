import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Card, Text, Button, Overlay, Header } from 'react-native-elements';
import { StyleSheet, FlatList, ScrollView, View } from 'react-native';
import { REACT_APP_URL } from 'react-native-dotenv';
import Icon from 'react-native-vector-icons/FontAwesome';
import Foto from '../component/Foto';
import ImagePicker from 'react-native-image-picker';

export default class Galeria extends Component {

    constructor(props){
        super(props);
        this.state = { 
            posts: [],
            openAdicionar: false,
            errMsg: '',
        }
    }

    static navigationOptions = { header: null };

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => this.recarregarGaleria());
    }

    recarregarGaleria() {
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

        AsyncStorage.getItem('usuario')
            .then(usuario => this.setState({usuario: usuario}));
    }

    removerToken() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }
    
    openCloseModalAdicionar(isOpen){
        this.setState({ openAdicionar: isOpen });
    }

    adicionar() {
        let url = `${REACT_APP_URL}/fotos`;

        const formData = new FormData();
        formData.append("photo", {
            name: this.state.foto.fileName,
            type: this.state.foto.type,
            uri: this.state.foto.uri
        });

        AsyncStorage.getItem('token')
            .then(token => {
                return {
                    method: 'POST',
                    body: formData,
                    headers: new Headers({
                        'Authorization': token
                    })
                }
            })
            .then(requestInfo => fetch(url, requestInfo))
            .then(response => {
                console.warn(response)
                if(response.ok){
                    this.openCloseModalAdicionar(false);
                    this.setState({foto: null, errMsg: ''});
                    this.recarregarGaleria();
                    return;
                } 
                throw new Error("Não foi possível adicionar a foto.");
            })
            .catch(e => this.setState({errMsg: e.message}));
    }

    home(){
        this.props.navigation.replace('Feed');
    }

    galeria(){
        this.props.navigation.replace('Galeria');
    }

    selecionarFoto(){
        const options = { title: 'Selecionar Foto'}
        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel || response.error || response.customButton){
                this.openCloseModalAdicionar(false);
                return;
            }

            this.setState({ foto: response });
            this.adicionar();
        });
    }

    render() {
        return (
            <ScrollView>
                <Header
                    leftComponent={<Icon name="home" size={24} onPress={this.home.bind(this)}/>}
                    centerComponent={{ text: "Alexei Aj", style: { color: "#fff" }}}
                    rightComponent={<Icon name="photo" size={24} onPress={this.galeria.bind(this)}/>}
                >
                </Header>
                <Card>
                    <FlatList 
                        data={this.state.fotos} 
                        keyExtractor={item => String(item.id)} 
                        renderItem={ ({item}) => 
                            <Foto foto={item} recarregarGaleriaCallback={() => this.recarregarGaleria()}/>
                        }
                    />
                    <Button type="clear" title="Adicionar" onPress={this.openCloseModalAdicionar.bind(this, true)}/>
                    <Button type="clear" title={`Deslogar de ${this.state.usuario}`} onPress={this.removerToken.bind(this)}/>
                </Card>
                <Overlay isVisible={this.state.openAdicionar} height={120} onBackdropPress={this.openCloseModalAdicionar.bind(this, false)}>
                    <View>
                        <Button title="Selecionar Foto" onPress={this.selecionarFoto.bind(this)}/>
                        <Text style={styles.errMsg}>{this.state.errMsg}</Text>
                        <Button type="clear" title="Cancelar" onPress={this.openCloseModalAdicionar.bind(this, false)}/>
                    </View>
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
