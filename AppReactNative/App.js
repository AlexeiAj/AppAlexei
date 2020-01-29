import {YellowBox} from "react-native";
import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';
import AuthLoadingScreen from './src/component/AuthLoadingScreen';

import Feed from './src/view/Feed';
import Login from './src/view/Login';
import ListaUsuarios from './src/view/ListaUsuarios';

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

const AppStack = createStackNavigator(
    { 
        Login: Login,
        ListaUsuarios: ListaUsuarios,
        Feed: Feed,
    }
);

export default createAppContainer(createSwitchNavigator(
    {
        AuthLoading: AuthLoadingScreen,
        App: AppStack,
    },
    {
        initialRouteName: 'AuthLoading',
    }
));