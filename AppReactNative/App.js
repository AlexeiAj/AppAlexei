import {YellowBox} from "react-native";
import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';
import AuthLoadingScreen from './src/component/AuthLoadingScreen';

import Feed from './src/view/Feed';
import Galeria from './src/view/Galeria';
import Login from './src/view/Login';
import ListaUsuarios from './src/view/ListaUsuarios';

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

const AppStack = createStackNavigator(
    { 
        Feed: Feed,
        Galeria: Galeria
    }
);

const AuthStack = createStackNavigator(
    { 
        Login: Login,
        ListaUsuarios: ListaUsuarios
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));