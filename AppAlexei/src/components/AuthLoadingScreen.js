import React, {Component} from 'react';
import AsyncStorage from '@react-native-community/async-storage';

import {
    View,
    ActivityIndicator,
} from 'react-native';

export default class AuthLoadingScreen extends Component {
    
    constructor(props) {
        super(props);
        this._bootstrapAsync();
    }

    _bootstrapAsync = async () => {
        const token = await AsyncStorage.getItem('token');
        this.props.navigation.navigate(token ? 'Feed' : 'Login');
    };

    render() {
        return (
            <View>
                <ActivityIndicator />
            </View>
        );
    }
}