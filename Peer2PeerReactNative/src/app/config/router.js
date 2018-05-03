import { StatusBar } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Home from '../screens/home';
import Call from '../screens/call';


export default StackNavigator(
    {
        Home: {
            screen: Home
        },
        Call: {
            screen: Call
        },
    },
    {
        initialRouteName: 'Home',
        navigationOptions: {
            headerStyle: {
                backgroundColor: '#464556',
                borderBottomWidth: 0
            },
            headerTintColor: 'black',
            headerLeft: null
        }
    }
);