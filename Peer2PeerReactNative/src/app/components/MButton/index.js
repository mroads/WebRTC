import React from 'react';
import {
    TouchableOpacity,
    View,
    Text
} from 'react-native';
import styles from './styles';

export default class MButton extends React.Component {
    render() {
        return (
            <TouchableOpacity onPress={this.props.onClick} style={[styles.button]} underlayColor="#FFBD4B">
                <Text style={styles.buttonText}>Join!</Text>
            </TouchableOpacity>
        )
    }
}