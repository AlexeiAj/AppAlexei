import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
    StyleSheet,
    FlatList,
    ScrollView,
    Button,
} from 'react-native';

import Post from '../component/Post';
import { REACT_APP_URL } from 'react-native-dotenv';

export default class Feed extends Component {

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            usuario: '',
            url: `${REACT_APP_URL}`
        }
    }

    componentDidMount() {
        const uri = this.state.url + '/posts';

        AsyncStorage.getItem('token')
            .then(token => {
                return {
                    headers: new Headers({
                        'Authorization': token
                    })
                }
            })
            .then(requestInfo => fetch(uri, requestInfo))
            .then(response => response.json())
            .then(json => this.setState({ posts: json }));

        AsyncStorage.getItem('usuario')
            .then(usuario => this.setState({usuario: usuario}));
    }

    removerToken() {
        AsyncStorage.clear();
        this.props.navigation.navigate('Login');
    }

    render() {
        return (
            <ScrollView>
                <FlatList 
                    style={styles.container} 
                    data={this.state.posts} 
                    keyExtractor={item => String(item.id)} 
                    renderItem={ ({item}) => 
                        <Post post={item} url={this.state.url}/>
                    }
                />
                <Button title={`Deslogar de ${this.state.usuario}`} onPress={this.removerToken.bind(this)}/>
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
