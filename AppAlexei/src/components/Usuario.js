import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';

export default class Usuario extends Component {

    constructor(props) {
        super(props);
    }

    exibeTouchable(usuario, perfilUsuarioCallback, isConsulting) {
        if(!isConsulting){
            return (<TouchableOpacity style={styles.container} onPress={() => perfilUsuarioCallback(usuario.id)}>
                        <Text style={styles.titulo}>{'Login'}</Text>
                        <Text style={styles.texto}>{usuario.login}</Text>
                        <Text style={styles.titulo}>{'Senha'}</Text>
                        {/* <Text style={styles.texto}>{usuario.senha}</Text><Text style={styles.texto}>{usuario.senha}</Text> */}
                        <Text style={styles.texto}>{'***'}</Text>
                        <TouchableOpacity>
                            <Text style={styles.titulo}>{'E'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.titulo}>{'X'}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>);
        }

        return (<View style={styles.container} onPress={() => perfilUsuarioCallback(usuario.id)}>
                    <Text style={styles.titulo}>{'Login'}</Text>
                    <Text style={styles.texto}>{usuario.login}</Text>
                    <Text style={styles.titulo}>{'Senha'}</Text>
                    <Text style={styles.texto}>{usuario.senha}</Text><Text style={styles.texto}>{usuario.senha}</Text>
                </View>);
    }

    render() {
        const {usuario, perfilUsuarioCallback, isConsulting} = this.props;
        return (
            <View>
                {this.exibeTouchable(usuario, perfilUsuarioCallback, isConsulting)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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