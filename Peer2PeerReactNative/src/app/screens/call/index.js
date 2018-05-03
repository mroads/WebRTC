import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Video,
    Dimensions,
    Image,
    TouchableHighlight,
    Alert,
    YellowBox,
    Animated
} from 'react-native';

import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
} from 'react-native-webrtc';

import styles from './styles';
import MParticipant from '../../components/MParticipant';
import MainVideo from '../../components/MainVideo';
import socket from '../../config/socket';
import Participant from '../../models/Participant';
import media from '../../models/MediaService';
import { StatusBar } from 'react-native';
import MIcon from '../../components/MIcon';

const { width, height } = Dimensions.get('window');


export default class Call extends React.Component {


    static navigationOptions = ({ navigation }) => {
        const { params } = navigation.state;
        data = params;
        return {
            title: params ? params.room : 'Room',
        }
    };

    constructor() {
        super();
        YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated']);
        this.state = {
            participants: {},
            selectedParticipant: '',
            localParticipant: undefined
        };
        this.listenerList = [];
    }

    componentDidMount() {
        this.addListeners();
        this.joinRoom();
    }

    componentWillUnmount = () => {
        console.info('component unmounted');
        socket.removeListeners();
    }

    receiveVideo(sender) {
        const participant = new Participant(sender, false);
        participant.subscribe(this.participantEventCallback.bind(this));
        this.state.participants[sender] = participant;
        participant.createPeers(this.localStream);
        this.setState({ selectedParticipant: sender });
    }

    receiveVideoAndGenerateSdp(sender) {
        this.receiveVideo(sender.name);
        this.state.participants[sender.name].generateSdp();
    }

    participantEventCallback(message) {
        console.info('event from participant', message);
        switch (message.id) {
            case 'iceCandidate':
                console.info('sending ice candidate to', message.sender);
                sendMessage(message);
                break;
            case 'sdp':
                console.info('sending sdp to', message.sender);
                sendMessage(message);
                break;
            case 'updateZone':
                this.setState({});
                break;
        }
    }

    addListeners = () => {
        socket.ee.addListener('existingParticipants', (message) => {
            console.info('in existing participants');
            const participant = new Participant(data.name, true);
            this.state.participants = this.state.participants
            this.state.participants[data.name] = participant;
            this.state.localParticipant = participant;
            const that = this;
            media.gum('noVideo', true).then(function (stream) {
                console.info('got media');
                participant.stream = stream;
                that.localStream = stream;
                message.data.forEach(element => {
                    that.receiveVideoAndGenerateSdp(element);
                });
                that.setState({
                    participants: that.state.participants
                })
            }).catch(function (error) {
                console.error('error', error);
                alert(error.name);
            });
            this.setState({
                participants: this.state.participants,
                selectedParticipant: data.name
            })
        });
        socket.ee.addListener('sdp', (params) => {
            const sdp = new RTCSessionDescription(params.sdp);
            this.state.participants[params.sender].setSdp(sdp);
        });
        socket.ee.addListener('iceCandidate', (params) => {
            console.info(params);
        });
        socket.ee.addListener('newParticipantArrived', (params) => {
            this.receiveVideo(params.name);
        });
        socket.ee.addListener('participantLeft', (request) => {
            console.log('Participant ' + request.name + ' left');
            const participant = this.state.participants[request.name];
            participant.dispose();
            delete this.state.participants[request.name];
            const keys = Object.keys(this.state.participants);
            this.state.selectedParticipant = keys.pop();
            this.setState({
                participants: this.state.participants,
                selectedParticipant: this.state.selectedParticipant
            })
        });
    }

    joinRoom = () => {
        console.info('joining room', data.name, data.room)
        sendMessage({ id: 'joinRoom', name: data.name, room: data.room });
    }

    onClick = (key) => {
        console.info('clicked on ', key);
        this.setState({ selectedParticipant: key });
    }

    toggleTrack = (type) => {
        console.info('toggling track', type, this.localStream, this.localStream.getTracks())
        if (!this.localStream) {
            return;
        }
        this.localStream.getTracks().forEach((track) => {
            if (track.kind === type) {
                track.enabled = !track.enabled;
                this.state.localParticipant.states[type] = track.enabled;
            }
        });
        this.setState({ localParticipant: this.state.localParticipant });
    }

    leaveRoom = () => {
        sendMessage({
            id: 'leaveRoom'
        });
        // window.reload();
        for (key in this.state.participants) {
            this.state.participants[key].dispose();
            this.state.participants[key].removeAllListeners()
        }

        Object.keys(this.state.participants).map((key) => {
            delete this.state.participants[key];
        });

        if (this.localStream) {
            this.localStream.getTracks().forEach((track) => {
                track.stop();
            });
            this.localStream.release();
        }


        this.setState({
            participants: {},
            selectedParticipant: '',
            localParticipant: undefined
        });
        this.props.navigation.goBack();
    }

    render() {
        const mainVideos = Object.keys(this.state.participants).map((key) => {
            return (
                <MainVideo key={key} selected={this.state.selectedParticipant === key} streamURL={this.state.participants[key] && this.state.participants[key].stream ? this.state.participants[key].stream.toURL() : ''}></MainVideo>
            )

        });
        const pipVideos = Object.keys(this.state.participants).map((key) => {
            return <MParticipant selected={this.state.selectedParticipant === key} onClick={() => this.onClick(key)} key={key} streamURL={this.state.participants[key].stream ? this.state.participants[key].stream.toURL() : ''} name={key} />

        });
        const participants = this.state.participants;
        const selectedParticipant = this.state.selectedParticipant;
        return (
            <View style={styles.container}>
                {mainVideos}
                <View style={[styles.iconContainer]}>
                    <MIcon source={require('../../../assets/images/video-symbol.png')} onPress={() => { this.toggleTrack('video') }} disabled={!(this.state.localParticipant && this.state.localParticipant.states.video)} />
                    <MIcon source={require('../../../assets/images/end-call-red.png')} onPress={() => { this.leaveRoom() }} />
                    <MIcon source={require('../../../assets/images/mic-symbol.png')} onPress={() => { this.toggleTrack('audio') }} disabled={!(this.state.localParticipant && this.state.localParticipant.states.audio)} />
                </View>
                <View style={[styles.pipContainer]}>
                    {pipVideos}
                </View>
            </View>
        );
    }
}
