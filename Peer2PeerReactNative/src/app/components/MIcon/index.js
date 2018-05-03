import React from 'react';
import {
    Image,
    TouchableHighlight
} from 'react-native';

import { RTCView } from 'react-native-webrtc';
import styles from './styles';

export default class MIcon extends React.Component {
    render() {
        return (
            <TouchableHighlight style={[styles.iconWrapper, this.props.disabled ? styles.iconDisabled : {}]} onPress={this.props.onPress}>
                <Image style={styles.icon} source={this.props.source} />
            </TouchableHighlight>
        )
    }
}
