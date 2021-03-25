import React, { useState } from "react";
import {
    Mic,
    MicOff,
    Videocam,
    VideocamOff,
} from '@material-ui/icons';
import FaceIcon from '@material-ui/icons/Face';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectAppOnBoardingStep } from "../../../redux/app/selector";
// @ts-ignore
import styles from './MediaIconsBox.module.scss';
import { MediaStreamSystem } from "xr3ngine-engine/src/networking/systems/MediaStreamSystem";
import {
    configureMediaTransports,
    createCamAudioProducer,
    createCamVideoProducer,
    endVideoChat, leave,
    pauseProducer,
    resumeProducer
} from "xr3ngine-engine/src/networking/functions/SocketWebRTCClientFunctions";
import { selectAuthState } from "../../../redux/auth/selector";
import { selectLocationState } from "../../../redux/location/selector";
import { updateCamAudioState, updateCamVideoState, changeFaceTrackingState } from "../../../redux/mediastream/service";
import {
    startFaceTracking,
    startLipsyncTracking,
    stopFaceTracking,
    stopLipsyncTracking
} from "xr3ngine-engine/src/input/behaviors/WebcamInputBehaviors";
import { Network } from "xr3ngine-engine/src/networking/classes/Network";
import { VrIcon } from "../Icons/Vricon";
import { Engine } from "xr3ngine-engine/src/ecs/classes/Engine";
import { EngineEvents } from "xr3ngine-engine/src/ecs/classes/EngineEvents";
import { XRSystem } from "xr3ngine-engine/src/xr/systems/XRSystem";

const mapStateToProps = (state: any): any => {
    return {
        onBoardingStep: selectAppOnBoardingStep(state),
        authState: selectAuthState(state),
        locationState: selectLocationState(state),
        mediastream: state.get('mediastream'),
    };
};

const mapDispatchToProps = (dispatch): any => ({
    changeFaceTrackingState: bindActionCreators(changeFaceTrackingState, dispatch),
});

const MediaIconsBox = (props) => {
    const {
        authState,
        locationState,
        mediastream,
        changeFaceTrackingState
    } = props;
    const [xrSupported, setXRSupported] = useState(false);

    const user = authState.get('user');
    const currentLocation = locationState.get('currentLocation').get('location');

    const videoEnabled = currentLocation.locationSettings ? currentLocation.locationSettings.videoEnabled : false;
    const instanceMediaChatEnabled = currentLocation.locationSettings ? currentLocation.locationSettings.instanceMediaChatEnabled : false;

    const isFaceTrackingEnabled = mediastream.get('isFaceTrackingEnabled');
    const isCamVideoEnabled = mediastream.get('isCamVideoEnabled');
    const isCamAudioEnabled = mediastream.get('isCamAudioEnabled');

    const onEngineLoaded = () => {
      const onSceneEnabled = () => {
        setXRSupported(Engine.xrSupported);
        EngineEvents.instance.removeEventListener(EngineEvents.EVENTS.JOINED_WORLD, onSceneEnabled)
      }
      EngineEvents.instance.addEventListener(EngineEvents.EVENTS.JOINED_WORLD, onSceneEnabled)
      document.removeEventListener('ENGINE_LOADED', onEngineLoaded)
    }
    document.addEventListener('ENGINE_LOADED', onEngineLoaded)

    const checkMediaStream = async (partyId: string): Promise<boolean> => {
        return await configureMediaTransports(partyId);
    };

    const handleFaceClick = async () => {
      const partyId = currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId;
      if(await checkMediaStream(partyId)) {
        changeFaceTrackingState(!isFaceTrackingEnabled);
        if (!isFaceTrackingEnabled) {
          startFaceTracking();
          startLipsyncTracking();
        } else {
          stopFaceTracking();
          stopLipsyncTracking();
        }
      }
    };

    const checkEndVideoChat = async () => {
        if ((MediaStreamSystem.instance.audioPaused || MediaStreamSystem.instance?.camAudioProducer == null) && (MediaStreamSystem.instance.videoPaused || MediaStreamSystem.instance?.camVideoProducer == null)) {
            await endVideoChat({});
            if ((Network.instance.transport as any).channelSocket?.connected === true) await leave(false);
        }
    };
    const handleMicClick = async () => {
        const partyId = currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId;
        if(await checkMediaStream(partyId)) {
          if (MediaStreamSystem.instance?.camAudioProducer == null) await createCamAudioProducer(partyId);
          else {
              const audioPaused = MediaStreamSystem.instance.toggleAudioPaused();
              if (audioPaused === true) await pauseProducer(MediaStreamSystem.instance?.camAudioProducer);
              else await resumeProducer(MediaStreamSystem.instance?.camAudioProducer);
              checkEndVideoChat();
          }
          updateCamAudioState();
        }
    };

    const handleCamClick = async () => {
        const partyId = currentLocation?.locationSettings?.instanceMediaChatEnabled === true ? 'instance' : user.partyId;
        if(await checkMediaStream(partyId)) {
          
            if (MediaStreamSystem.instance?.camVideoProducer == null) await createCamVideoProducer(partyId);
            else {
                const videoPaused = MediaStreamSystem.instance.toggleVideoPaused();
                if (videoPaused === true) await pauseProducer(MediaStreamSystem.instance?.camVideoProducer);
                else await resumeProducer(MediaStreamSystem.instance?.camVideoProducer);
                checkEndVideoChat();
            }

            updateCamVideoState();
        }
    };

    const handleVRClick = () => EngineEvents.instance.dispatchEvent({ type: XRSystem.EVENTS.XR_START });

    const xrEnabled = Engine.renderer?.xr.enabled === true;
    const VideocamIcon = isCamVideoEnabled ? Videocam : VideocamOff;
    const MicIcon = isCamAudioEnabled ? Mic : MicOff;

    return (
        <section className={styles.drawerBox}>
            {instanceMediaChatEnabled
                ? <button type="button" className={styles.iconContainer + ' ' + (isCamAudioEnabled ? styles.on : '')} onClick={handleMicClick}>
                    <MicIcon />
                </button> : null}
            {videoEnabled
                ? <>
                    <button type="button" className={styles.iconContainer + ' ' + (isCamVideoEnabled ? styles.on : '')} onClick={handleCamClick}>
                        <VideocamIcon />
                    </button>
                    <button type="button" className={styles.iconContainer + ' ' + (isFaceTrackingEnabled ? styles.on : '')} onClick={handleFaceClick}>
                        <FaceIcon />
                    </button>
                </> : null}
            {xrSupported
                ? <button type="button" className={styles.iconContainer + ' ' + (!xrEnabled ? '' : styles.on)} onClick={handleVRClick}>
                    <VrIcon />
                    
                </button> : null}
        </section>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(MediaIconsBox);
