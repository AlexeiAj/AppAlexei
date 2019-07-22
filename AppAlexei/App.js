import {YellowBox} from "react-native";
import {createSwitchNavigator, createStackNavigator, createAppContainer} from 'react-navigation';
import AuthLoadingScreen from './src/components/AuthLoadingScreen';
import Feed from './src/screens/Feed';
import Login from './src/screens/Login';
import Usuarios from './src/screens/Usuarios';
import CadastroDeUsuario from './src/screens/CadastroDeUsuario';

// ignore specific yellowbox warnings
YellowBox.ignoreWarnings(["Require cycle:", "Remote debugger"]);

const AppStack = createStackNavigator(
    { 
        Login: Login,
        Feed: Feed,
        Usuarios: Usuarios,
        PerfilUsuario: Usuarios,
        CadastroDeUsuario: CadastroDeUsuario,
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