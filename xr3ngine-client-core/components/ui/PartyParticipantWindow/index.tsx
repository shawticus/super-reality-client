import React, {useEffect, useState, useRef} from 'react';
// @ts-ignore
import styles from './PartyParticipantWindow.module.scss';
import { bindActionCreators } from "redux";
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';
import {
    globalMuteProducer,
    globalUnmuteProducer,
    pauseConsumer,
    pauseProducer,
    resumeConsumer,
    resumeProducer
} from 'xr3ngine-engine/src/networking/functions/SocketWebRTCClientFunctions';

import {
    Mic,
    MicOff,
    RecordVoiceOver,
    Videocam,
    VideocamOff,
    VoiceOverOff,
    VolumeDown,
    VolumeOff,
    VolumeMute,
    VolumeUp,
    Launch,
} from '@material-ui/icons';
import { MediaStreamSystem } from 'xr3ngine-engine/src/networking/systems/MediaStreamSystem';
import {Network} from "xr3ngine-engine/src/networking/classes/Network";
import {MessageTypes} from "xr3ngine-engine/src/networking/enums/MessageTypes";
import { EngineEvents } from "xr3ngine-engine/src/ecs/classes/EngineEvents";
import {selectAppState} from '../../../redux/app/selector';
import {selectAuthState} from '../../../redux/auth/selector';
import {selectLocationState} from '../../../redux/location/selector';
import {selectMediastreamState} from "../../../redux/mediastream/selector";
import {updateCamVideoState, updateCamAudioState} from '../../../redux/mediastream/service';
import {selectUserState} from '../../../redux/user/selector';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import {PositionalAudioSystem} from "xr3ngine-engine/src/audio/systems/PositionalAudioSystem";
import { getAvatarURLFromNetwork } from "../UserMenu/util";
import Draggable from './Draggable';


interface ContainerProportions {
    width: number | string;
    height: number | string;
}

interface Props {
    harmony?: boolean;
    containerProportions?: ContainerProportions;
    peerId?: string;
    appState?: any;
    authState?: any;
    locationState?: any;
    userState?: any;
    mediastream?: any;
}

const mapStateToProps = (state: any): any => {
    return {
        appState: selectAppState(state),
        authState: selectAuthState(state),
        locationState: selectLocationState(state),
        userState: selectUserState(state),
        mediastream: selectMediastreamState(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({});


const PartyParticipantWindow = (props: Props): JSX.Element => {
    const [videoStream, _setVideoStream] = useState(null);
    const [audioStream, _setAudioStream] = useState(null);
    const [videoStreamPaused, setVideoStreamPaused] = useState(false);
    const [audioStreamPaused, setAudioStreamPaused] = useState(false);
    const [videoProducerPaused, setVideoProducerPaused] = useState(false);
    const [audioProducerPaused, setAudioProducerPaused] = useState(false);
    const [videoProducerGlobalMute, setVideoProducerGlobalMute] = useState(false);
    const [audioProducerGlobalMute, setAudioProducerGlobalMute] = useState(false);
    const [audioTrackClones, setAudioTrackClones] = useState([]);
    const [videoTrackClones, setVideoTrackClones] = useState([]);
    const [toggle, setToggle] = useState(0);
    const [volume, setVolume] = useState(100);
    const {
        harmony,
        peerId,
        appState,
        authState,
        locationState,
        userState,
        mediastream,
    } = props;
    const videoRef = React.createRef<HTMLVideoElement>();
    const audioRef = React.createRef<HTMLAudioElement>();
    const videoStreamRef = useRef(videoStream);
    const audioStreamRef = useRef(audioStream);

    const userHasInteracted = appState.get('userHasInteracted');
    const selfUser = authState.get('user');
    const currentLocation = locationState.get('currentLocation').get('location');
    const enableGlobalMute = currentLocation?.locationSettings?.locationType === 'showroom' && selfUser?.locationAdmins?.find(locationAdmin => currentLocation.id === locationAdmin.locationId) != null;
    const user = userState.get('layerUsers').find(user => user.id === peerId);

    const isCamVideoEnabled = mediastream.get('isCamVideoEnabled');
    const isCamAudioEnabled = mediastream.get('isCamAudioEnabled');
    const consumers = mediastream.get('consumers');

    const setVideoStream = value => {
        videoStreamRef.current = value;
        _setVideoStream(value);
    };

    const setAudioStream = value => {
        audioStreamRef.current = value;
        _setAudioStream(value);
    };

    const pauseConsumerListener = (consumerId: string) => {
        if (consumerId === videoStreamRef?.current?.id) {
            setVideoProducerPaused(true);
        } else if (consumerId === audioStreamRef?.current?.id) {
            setAudioProducerPaused(true);
        }
    };

    const resumeConsumerListener = (consumerId: string) => {
        if (consumerId === videoStreamRef?.current?.id) {
            setVideoProducerPaused(false);
        } else if (consumerId === audioStreamRef?.current?.id) {
            setAudioProducerPaused(false);
        }
    };

    const pauseProducerListener = (producerId: string, globalMute: boolean) => {
        if (producerId === videoStreamRef?.current?.id && globalMute === true) {
            setVideoProducerPaused(true);
            setVideoProducerGlobalMute(true);
        } else if (producerId === audioStreamRef?.current?.id && globalMute === true) {
            setAudioProducerPaused(true);
            setAudioProducerGlobalMute(true);
        }
    };

    const resumeProducerListener = (producerId: string) => {
        if (producerId === videoStreamRef?.current?.id) {
            setVideoProducerPaused(false);
            setVideoProducerGlobalMute(false);
        } else if (producerId === audioStreamRef?.current?.id) {
            setAudioProducerPaused(false);
            setAudioProducerGlobalMute(false);
        }
    };

    useEffect(() => {
        if (peerId === 'me_cam') {
            setVideoStream(MediaStreamSystem.instance?.camVideoProducer);
            setVideoStreamPaused(MediaStreamSystem.instance?.videoPaused);
        }
        else if (peerId === 'me_screen') setVideoStream(MediaStreamSystem.instance?.screenVideoProducer);
    }, [isCamVideoEnabled]);

    useEffect(() => {
        if (peerId === 'me_cam') {
            setAudioStream(MediaStreamSystem.instance?.camAudioProducer);
            setAudioStreamPaused(MediaStreamSystem.instance?.audioPaused);
        }
        else if (peerId === 'me_screen') setAudioStream(MediaStreamSystem.instance?.screenAudioProducer);
    }, [isCamAudioEnabled]);

    useEffect(() => {
        if (peerId !== 'me_cam' && peerId !== 'me_screen') {
            setVideoStream(MediaStreamSystem.instance?.consumers?.find((c: any) => c.appData.peerId === peerId && c.appData.mediaTag === 'cam-video'));
            setAudioStream(MediaStreamSystem.instance?.consumers?.find((c: any) => c.appData.peerId === peerId && c.appData.mediaTag === 'cam-audio'));
        }
    }, [consumers])

    useEffect(() => {
        if (userHasInteracted === true && peerId !== 'me_cam' && peerId !== 'me_screen') {
            videoRef.current?.play();
            audioRef.current?.play();
        }
    }, [userHasInteracted]);

    useEffect(() => {
        if (harmony !== true && (selfUser?.user_setting?.spatialAudioEnabled === true || selfUser?.user_setting?.spatialAudioEnabled === 1) && audioRef.current != null) audioRef.current.volume = 0;
        else if ((selfUser?.user_setting?.spatialAudioEnabled === false || selfUser?.user_setting?.spatialAudioEnabled === 0) && PositionalAudioSystem.instance != null) audioRef.current.volume = volume / 100;
    }, [selfUser]);

    useEffect(() => {
        const socket = (Network.instance?.transport as any)?.channelType === 'instance' ? (Network.instance?.transport as any)?.instanceSocket : (Network.instance?.transport as any)?.channelSocket;
        socket?.on(MessageTypes.WebRTCPauseConsumer.toString(), pauseConsumerListener);
        socket?.on(MessageTypes.WebRTCResumeConsumer.toString(), resumeConsumerListener);
        socket?.on(MessageTypes.WebRTCPauseProducer.toString(), pauseProducerListener);
        socket?.on(MessageTypes.WebRTCResumeProducer.toString(), resumeProducerListener);
    }, []);

    useEffect(() => {
        if (audioRef.current != null) {
            audioRef.current.id = `${peerId}_audio`;
            audioRef.current.autoplay = true;
            audioRef.current.setAttribute('playsinline', 'true');
            if (peerId === 'me_cam' || peerId === 'me_screen') {
                audioRef.current.muted = true;
            }
            if (audioStream != null) {
                const newAudioTrack = audioStream.track.clone();
                const updateAudioTrackClones = audioTrackClones.concat(newAudioTrack);
                setAudioTrackClones(updateAudioTrackClones);
                audioRef.current.srcObject = new MediaStream([newAudioTrack]);
            }
            // TODO: handle 3d audio switch on/off
            if (harmony !== true && (selfUser?.user_setting?.spatialAudioEnabled === true || selfUser?.user_setting?.spatialAudioEnabled === 1)) audioRef.current.volume = 0;
            if (selfUser?.user_setting?.spatialAudioEnabled === false || selfUser?.user_setting?.spatialAudioEnabled === 0 && PositionalAudioSystem.instance != null) {
                audioRef.current.volume = volume / 100;
                PositionalAudioSystem.instance?.suspend();
            }
            setVolume(volume);
        }

        return () => {
            audioTrackClones.forEach((track) => track.stop());
        }
    }, [audioStream]);

    useEffect(() => {
        if (videoRef.current != null) {
            videoRef.current.id = `${peerId}_video`;
            videoRef.current.autoplay = true;
            videoRef.current.muted = true;
            videoRef.current.setAttribute('playsinline', 'true');
            if (videoStream != null) {
                const newVideoTrack = videoStream.track.clone();
                const updateVideoTrackClones = videoTrackClones.concat(newVideoTrack);
                setVideoTrackClones(updateVideoTrackClones);
                videoRef.current.srcObject = new MediaStream([newVideoTrack]);
                setVideoProducerPaused(false);
            }
        }

        return () => {
            videoTrackClones.forEach((track) => track.stop());
        }
    }, [videoStream]);

    useEffect(() => {
        if (peerId === 'me_cam' || peerId === 'me_screen') setAudioStreamPaused(MediaStreamSystem.instance?.audioPaused);
        if (harmony === true && audioStream != null && audioRef.current != null) {
            const newAudioTrack = audioStream.track.clone();
            const updateAudioTrackClones = audioTrackClones.concat(newAudioTrack);
            setAudioTrackClones(updateAudioTrackClones);
            audioRef.current.srcObject = new MediaStream([newAudioTrack]);
        }
    }, [MediaStreamSystem.instance?.audioPaused]);

    useEffect(() => {
        if (peerId === 'me_cam' || peerId === 'me_screen') setVideoStreamPaused(MediaStreamSystem.instance?.videoPaused);
        if (harmony === true && videoStream != null && videoRef.current != null) {
            const newVideoTrack = videoStream.track.clone();
            const updateVideoTrackClones = videoTrackClones.concat(newVideoTrack);
            setVideoTrackClones(updateVideoTrackClones);
            videoRef.current.srcObject = new MediaStream([newVideoTrack]);
        }
    }, [MediaStreamSystem.instance?.videoPaused]);

    const toggleVideo = async (e) => {
        e.stopPropagation();
        if (peerId === 'me_cam') {
            const videoPaused = MediaStreamSystem.instance.toggleVideoPaused();
            if (videoPaused === true) await pauseProducer(MediaStreamSystem.instance?.camVideoProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camVideoProducer);
            updateCamVideoState();
        } else if (peerId === 'me_screen') {
            const videoPaused = MediaStreamSystem.instance.toggleScreenShareVideoPaused();
            if (videoPaused === true) await pauseProducer(MediaStreamSystem.instance.screenVideoProducer);
            else await resumeProducer(MediaStreamSystem.instance.screenVideoProducer);
            setVideoStreamPaused(videoPaused);
        } else {
            if (videoStream.paused === false) await pauseConsumer(videoStream);
            else await resumeConsumer(videoStream);
            setVideoStreamPaused(videoStream.paused);
        }
    };

    const toggleAudio = async (e) => {
        e.stopPropagation();
        if (peerId === 'me_cam') {
            const audioPaused = MediaStreamSystem.instance.toggleAudioPaused();
            if (audioPaused === true) await pauseProducer(MediaStreamSystem.instance?.camAudioProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camAudioProducer);
            updateCamAudioState();
        } else if (peerId === 'me_screen') {
            const audioPaused = MediaStreamSystem.instance.toggleScreenShareAudioPaused();
            if (audioPaused === true) await pauseProducer(MediaStreamSystem.instance.screenAudioProducer);
            else await resumeProducer(MediaStreamSystem.instance.screenAudioProducer);
            setAudioStreamPaused(audioPaused);
        } else {
            if (audioStream.paused === false) await pauseConsumer(audioStream);
            else await resumeConsumer(audioStream);
            setAudioStreamPaused(audioStream.paused);
        }
    };

    const toggleGlobalMute = async (e) => {
        e.stopPropagation();
        if (audioProducerGlobalMute === false) {
            await globalMuteProducer({id: audioStream.producerId});
            setAudioProducerGlobalMute(true);
        } else if (audioProducerGlobalMute === true) {
            await globalUnmuteProducer({id: audioStream.producerId});
            setAudioProducerGlobalMute(false);
        }
    };

    const adjustVolume = (e, newValue) => {
        if (peerId === 'me_cam' || peerId === 'me_screen') {
            MediaStreamSystem.instance.audioGainNode.gain.setValueAtTime(newValue / 100, MediaStreamSystem.instance.audioGainNode.context.currentTime + 1);
        } else {
            audioRef.current.volume = newValue / 100;
        }
        setVolume(newValue);
    };

    const [isPiP, setPiP] = useState(false);

    const togglePiP = () => setPiP(!isPiP);

    const isSelfUser = peerId === 'me_cam' || peerId === 'me_screen';

    return (
        <Draggable isPiP={isPiP}>
        <div
            tabIndex={0}
            id={peerId + '_container'}
            className={classNames({
                [styles['party-chat-user']]: true,
                [styles['harmony']]: harmony === true,
                [styles['self-user']]: isSelfUser,
                [styles['no-video']]: videoStream == null,
                [styles['video-paused']]: (videoStream && (videoProducerPaused === true || videoStreamPaused === true)),
                [styles.pip]: isPiP,
            })}
        >

            <div className={styles['video-wrapper']}>
                { (videoStream == null || videoStreamPaused == true || videoProducerPaused == true || videoProducerGlobalMute == true) && <img src={getAvatarURLFromNetwork(Network.instance, isSelfUser ? selfUser?.id : user?.id)} draggable={false} /> }
                <video key={peerId + '_cam'} ref={videoRef} draggable={false} />
            </div>
            <audio key={peerId + '_audio'} ref={audioRef}/>
            <div className={styles['user-controls']}>
                <div className={styles['username']}>{peerId === 'me_cam' ? 'You' : user?.name}</div>
                <div className={styles['controls']}>
                    <div className={styles['mute-controls']}>
                        {videoStream && videoProducerPaused === false
                            ? <Tooltip title={videoProducerPaused === false && videoStreamPaused === false ? 'Pause Video' : 'Resume Video'}>
                                <IconButton
                                    color="secondary"
                                    size="small"
                                    className={styles['video-control']}
                                    onClick={toggleVideo}
                                >
                                    {videoStreamPaused ? <VideocamOff/> : <Videocam/>}
                                </IconButton>
                            </Tooltip> : null}
                            {enableGlobalMute && peerId !== 'me_cam' && peerId !== 'me_screen'&& audioStream &&
                                <Tooltip title={audioProducerGlobalMute === false ? 'Mute for everyone' : 'Unmute for everyone'}>
                                <IconButton
                                    color="secondary"
                                    size="small"
                                    className={styles['audio-control']}
                                    onClick={toggleGlobalMute}
                                >
                                    {audioProducerGlobalMute ? <VoiceOverOff/> : <RecordVoiceOver/>}
                                </IconButton>
                            </Tooltip>}
                            {audioStream && audioProducerPaused === false
                                ? <Tooltip title={(isSelfUser) && audioStream?.paused === false ? 'Mute me' : (isSelfUser) && audioStream?.paused === true ? 'Unmute me' : (peerId !== 'me_cam' && peerId !== 'me_screen') && audioStream?.paused === false ? 'Mute this person' : 'Unmute this person'}>
                                    <IconButton
                                        color="secondary"
                                        size="small"
                                        className={styles['audio-control']}
                                        onClick={toggleAudio}
                                    >
                                        {isSelfUser
                                            ? audioStreamPaused ? <MicOff /> : <Mic />
                                            : audioStreamPaused ? <VolumeOff /> : <VolumeUp />}
                                    </IconButton>
                                </Tooltip> : null}
                            {harmony !== true && <Tooltip title="Open Picture in Picture">
                                <IconButton
                                    color="secondary"
                                    size="small"
                                    className={styles['audio-control']}
                                    onClick={togglePiP}
                                >
                                    <Launch className={styles.pipBtn}/>
                                </IconButton>
                            </Tooltip> }
                    </div>
                    {audioProducerGlobalMute === true && <div className={styles['global-mute']}>Muted by Admin</div>}
                    {audioStream && audioProducerPaused === false && audioProducerGlobalMute === false &&
                        (harmony === true || selfUser?.user_setting?.spatialAudioEnabled === false || selfUser?.user_setting?.spatialAudioEnabled === 0) &&
                        <div className={styles['audio-slider']}>
                            {volume > 0 && <VolumeDown/>}
                            {volume === 0 && <VolumeMute/>}
                            <Slider value={volume} onChange={adjustVolume} aria-labelledby="continuous-slider"/>
                            <VolumeUp/>
                        </div>}
                </div>
            </div>
        </div>
        </Draggable>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(PartyParticipantWindow);
