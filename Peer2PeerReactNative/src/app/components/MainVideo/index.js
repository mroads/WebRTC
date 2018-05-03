import React from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import { RTCView } from 'react-native-webrtc';
import styles from './styles';

export default class MainVideo extends React.Component {
    render() {
        return (
            <View style={[styles.container, this.props.selected ? styles.selected : {}]}>
                <RTCView objectFit='cover' style={[styles.video]} streamURL={this.props.streamURL} />
            </View>
        )
    }
}
