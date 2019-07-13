import React, {Component} from 'react';
import {
    StyleSheet,
    FlatList,
    Alert,
} from 'react-native';

import Post from '../components/Post';

export default class Feed extends Component {

    constructor(){
        super();
        this.state = {
            posts: [],
            url: 'http://alexeiaj.duckdns.org:8800'
        }
    }

    // componentDidMount() {
    //     fetch(this.state.url + '/posts')
    //         .then(resposta => resposta.json())
    //         .then(json => this.setState({ posts: json }))
    //         .catch(error => Alert.alert(error));
    // }

    render() {
        return (
            <FlatList 
                style={styles.container} 
                data={this.state.posts} 
                keyExtractor={item => String(item.id)} 
                renderItem={ ({item}) => 
                    <Post post={item} url={this.state.url}/>
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgray',
    }
});