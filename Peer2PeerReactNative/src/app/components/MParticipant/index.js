import React from 'react';
import {
    View,
    Text,
    TouchableHighlight
} from 'react-native';

import { RTCView } from 'react-native-webrtc';
import styles from './styles';

export default class MParticipant extends React.Component {
    render() {
        return (
            <TouchableHighlight style={[styles.container, this.props.selected ? styles.selected : {}]} onPress={this.props.onClick}>
                {/* <View style={styles.container}> */}
                <RTCView objectFit='cover' zOrder={2} style={styles.video} streamURL={this.props.streamURL}>
                    {/* <Text>{this.props.name}</Text> */}
                </RTCView>
                {/* </View> */}
            </TouchableHighlight>
        )
    }
}
