import React from 'react';
import {
    Platform,
    Text,
    View,
    Button,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    YellowBox
} from 'react-native';
import MButton from '../../components/MButton';
import MTextInput from '../../components/MTextInput';

import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    getUserMedia
} from 'react-native-webrtc';

import socket from '../../config/socket';

// import styles from './styles';

// const instructions = Platform.select({
//     ios: 'Press Cmd+R to reload,\n' +
//         'Cmd+D or shake for dev menu',
//     android: 'Double tap R on your keyboard to reload,\n' +
//         'Shake or press menu button for dev menu',
// });

export default class Home extends React.Component {

    static navigationOptions = {
        title: 'Home',
        headerBackTitle: 'Back',
    };

    constructor() {
        super();
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated'])
        this.state = { room: '', name: '' };
    }

    componentDidMount() {
        // this.joinRoom();
    }

    joinRoom = () => {
        this.props.navigation.navigate('Call', { name: this.state.name, room: this.state.room });
    }

    render() {
        return (
            <View style={[styles.stretchContainer, styles.pannaColor, styles.paddingTop]}>
                <View style={styles.centerContainer}>
                    <Text style={[styles.whiteText]}>Enter your name and room name.</Text>
                    <MTextInput placeholder="enter your name" onChangeText={(name) => this.setState({ name: name })} value={this.state.name} />
                    <MTextInput placeholder="enter room name" onChangeText={(room) => this.setState({ room: room })} value={this.state.room} />
                    <MButton onClick={this.joinRoom} />
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    stretchContainer: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center',
    },
    pannaColor: {
        backgroundColor: '#464556',
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    whiteText: {
        color: 'white'
    },
    pannaColor2: {
        backgroundColor: '#6b68bd'
    },
    whiteBackGround: {
        backgroundColor: 'white'
    },
    paddingTop: { paddingTop: 20 },
    marginTop: { marginTop: 20 },
    marginBottom: { marginBottom: 10 },
    padding: { padding: 10 },
    textAlignCenter: {
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#FF9900',
        // width: 100,
        borderRadius: 10
    },
    buttonText: {
        padding: 10,
        color: 'white'
    },
    buttonDisabled: {
        backgroundColor: '#FFBD4B'
    }
});