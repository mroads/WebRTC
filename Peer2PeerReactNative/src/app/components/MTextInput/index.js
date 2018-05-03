import React from 'react';
import {
    TextInput
} from 'react-native';
import styles from './styles';

export default class MTextInput extends React.Component {
    render() {
        return (
            <TextInput autoCapitalize={'none'} keyboardType="name-phone-pad" style={styles.textInputDimensions} placeholder={this.props.placeholder} placeholderTextColor="#333" onChangeText={this.props.onChangeText} value={this.props.value}></TextInput>
        )
    }
}