
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    iconWrapper: {
        width: 50,
        height: 50,
        backgroundColor: 'grey',
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    icon: {
        resizeMode: 'contain',
        height:22
    },
    iconDisabled: { backgroundColor: 'red' }
});

export default styles;