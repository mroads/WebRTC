
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        position: 'relative'
    },
    selected: {
        display: 'flex',
        // opacity: 1
    },
    pipContainer: {
        position: 'absolute',
        height: 100,
        bottom: 0,
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    iconContainer: {
        position: 'absolute',
        height: 100,
        bottom: 100,
        flexDirection: 'row',
        alignSelf: 'center',
    }
});

export default styles;