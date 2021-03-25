import { CAM_VIDEO_SIMULCAST_ENCODINGS } from "xr3ngine-engine/src/networking/constants/VideoConstants";
import { MessageTypes } from "xr3ngine-engine/src/networking/enums/MessageTypes";
import { MediaStreamSystem } from "xr3ngine-engine/src/networking/systems/MediaStreamSystem";
import { DataProducer, Transport as MediaSoupTransport } from "mediasoup-client/lib/types";
import { EngineEvents } from "../../ecs/classes/EngineEvents";
import { Network } from "../classes/Network";
import {triggerUpdateConsumers} from "xr3ngine-client-core/redux/mediastream/service";

let networkTransport: any;

export async function createDataProducer(channel = "default", type = 'raw', customInitInfo: any = {}): Promise<DataProducer | Error> {
    networkTransport = Network.instance.transport as any;
    const sendTransport = channel === 'instance' ? networkTransport.instanceSendTransport : networkTransport.channelSendTransport;
    // else if (MediaStreamSystem.instance.dataProducers.get(channel)) return Promise.reject(new Error('Data channel already exists!'))
    const dataProducer = await sendTransport.produceData({
        appData: { data: customInitInfo },
        ordered: false,
        label: channel,
        maxPacketLifeTime: 3000,
        // maxRetransmits: 3,
        protocol: type // sub-protocol for type of data to be transmitted on the channel e.g. json, raw etc. maybe make type an enum rather than string
    });
    // dataProducer.on("open", () => {
    //     networkTransport.dataProducer.send(JSON.stringify({ info: 'init' }));
    // });
    dataProducer.on("transportclose", () => {
        Network.instance.dataProducers.delete(channel);
        if (channel === 'instance') networkTransport.instanceDataProducer?.close();
        else networkTransport.channelDataProducer?.close();
    });
    if (channel === 'instance') networkTransport.instanceDataProducer = dataProducer;
    else networkTransport.channelDataProducer = dataProducer;
    Network.instance.dataProducers.set(channel, networkTransport.dataProducer);
    return Promise.resolve(networkTransport.dataProducer);
}
// utility function to create a transport and hook up signaling logic
// appropriate to the transport's direction

export async function createTransport(direction: string, channelType?: string, channelId?: string) {
    networkTransport = Network.instance.transport as any;
    const request = channelType === 'instance' ? networkTransport.instanceRequest : networkTransport.channelRequest;

    // ask the server to create a server-side transport object and send
    // us back the info we need to create a client-side transport
    let transport;

    console.log('Requesting transport creation', direction, channelType, channelId);
    if (request != null) {
        const {transportOptions} = await request(MessageTypes.WebRTCTransportCreate.toString(), {
            direction,
            sctpCapabilities: networkTransport.mediasoupDevice.sctpCapabilities,
            channelType: channelType,
            channelId: channelId
        });

        if (direction === "recv")
            transport = await networkTransport.mediasoupDevice.createRecvTransport(transportOptions);
        else if (direction === "send")
            transport = await networkTransport.mediasoupDevice.createSendTransport(transportOptions);
        else
            throw new Error(`bad transport 'direction': ${direction}`);

        // mediasoup-client will emit a connect event when media needs to
        // start flowing for the first time. send dtlsParameters to the
        // server, then call callback() on success or errback() on failure.
        transport.on("connect", async ({dtlsParameters}: any, callback: () => void, errback: () => void) => {
            const connectResult = await request(MessageTypes.WebRTCTransportConnect.toString(),
                {transportId: transportOptions.id, dtlsParameters});

            if (connectResult.error) {
                console.log('Transport connect error');
                console.log(connectResult.error);
                return errback();
            }

            callback();
        });

        if (direction === "send") {
            // sending transports will emit a produce event when a new track
            // needs to be set up to start sending. the producer's appData is
            // passed as a parameter
            transport.on("produce",
                async ({
                           kind,
                           rtpParameters,
                           appData
                       }: any, callback: (arg0: { id: any; }) => void, errback: () => void) => {

                    // we may want to start out paused (if the checkboxes in the ui
                    // aren't checked, for each media type. not very clean code, here
                    // but, you know, this isn't a real application.)
                    let paused = false;
                    if (appData.mediaTag === "cam-video")
                        paused = MediaStreamSystem.instance.videoPaused;
                    else if (appData.mediaTag === "cam-audio")
                        paused = MediaStreamSystem.instance.audioPaused;

                    // tell the server what it needs to know from us in order to set
                    // up a server-side producer object, and get back a
                    // producer.id. call callback() on success or errback() on
                    // failure.
                    const {error, id} = await request(MessageTypes.WebRTCSendTrack.toString(), {
                        transportId: transportOptions.id,
                        kind,
                        rtpParameters,
                        paused,
                        appData
                    });
                    if (error) {
                        errback();
                        console.log(error);
                        return;
                    }
                    callback({id});
                });

            transport.on("producedata",
                async (parameters: any, callback: (arg0: { id: any; }) => void, errback: () => void) => {
                    const {sctpStreamParameters, label, protocol, appData} = parameters;
                    const {error, id} = await request(MessageTypes.WebRTCProduceData, {
                        transportId: transport.id,
                        sctpStreamParameters,
                        label,
                        protocol,
                        appData
                    });

                    if (error) {
                        console.log(error);
                        errback();
                        return;
                    }

                    return callback({id});
                }
            );
        }

        // any time a transport transitions to closed,
        // failed, or disconnected, leave the  and reset
        transport.on("connectionstatechange", async (state: string) => {
            if (networkTransport.leaving !== true && (state === "closed" || state === "failed" || state === "disconnected")) {
                await request(MessageTypes.WebRTCTransportClose.toString(), {transportId: transport.id});
            }
            if (networkTransport.leaving !== true && state === 'connected' && transport.direction === 'recv') {
                await request(MessageTypes.WebRTCRequestCurrentProducers.toString(), {
                    channelType: channelType,
                    channelId: channelId
                });
            }
        });

        transport.channelType = channelType;
        transport.channelId = channelId;
        return Promise.resolve(transport);
    }
    else return Promise.resolve();
}

export async function initReceiveTransport(channelType: string, channelId?: string): Promise<MediaSoupTransport | Error> {
    networkTransport = Network.instance.transport as any;
    let newTransport;
    if (channelType === 'instance')
        newTransport = networkTransport.instanceRecvTransport = await createTransport('recv', channelType);
    else
        newTransport = networkTransport.channelRecvTransport = await createTransport('recv', channelType, channelId);
    return Promise.resolve(newTransport);
}

export async function initSendTransport(channelType: string, channelId?: string): Promise<MediaSoupTransport | Error> {
    networkTransport = Network.instance.transport as any;
    let newTransport;
    if (channelType === 'instance')
        newTransport = networkTransport.instanceSendTransport = await createTransport('send', channelType);
    else
        newTransport = networkTransport.channelSendTransport = await createTransport('send', channelType, channelId);

    return Promise.resolve(newTransport);
}

export async function initRouter(channelType: string, channelId?: string): Promise<void> {
    networkTransport = Network.instance.transport as any;
    const request = channelType === 'instance' ? networkTransport.instanceRequest : networkTransport.channelRequest;
    await request(MessageTypes.InitializeRouter.toString(), {
        channelType: channelType,
        channelId: channelId
    });
    return Promise.resolve();
}

export async function configureMediaTransports(channelType, channelId?: string): Promise<boolean> {
    networkTransport = Network.instance.transport as any;

    if (MediaStreamSystem.instance.mediaStream == null) {
      await MediaStreamSystem.instance.startCamera()
    }

    if (MediaStreamSystem.instance.mediaStream == null) {
      console.warn("Media stream is null, camera must have failed");
      return false;
    }

    if (channelType !== 'instance' && (networkTransport.channelSendTransport == null || networkTransport.channelSendTransport.closed === true || networkTransport.channelSendTransport.connectionState === 'disconnected')) {
      await initRouter(channelType, channelId);
      await Promise.all([initSendTransport(channelType, channelId), initReceiveTransport(channelType, channelId)]);
    }
    return true;
  }

export async function createCamVideoProducer(channelType: string, channelId?: string): Promise<void> {
    if (MediaStreamSystem.instance.mediaStream !== null && networkTransport.videoEnabled === true) {
        const transport = channelType === 'instance' ? networkTransport.instanceSendTransport : networkTransport.channelSendTransport;
        if (transport != null) {
            MediaStreamSystem.instance.camVideoProducer = await transport.produce({
                track: MediaStreamSystem.instance.mediaStream.getVideoTracks()[0],
                encodings: CAM_VIDEO_SIMULCAST_ENCODINGS,
                appData: {mediaTag: "cam-video", channelType: channelType, channelId: channelId}
            });

            if (MediaStreamSystem.instance.videoPaused) await MediaStreamSystem.instance?.camVideoProducer.pause();
            else await resumeProducer(MediaStreamSystem.instance.camVideoProducer);
        }
    }
}

export async function createCamAudioProducer(channelType: string, channelId?: string): Promise<void> {
    if (MediaStreamSystem.instance.mediaStream !== null) {
        //To control the producer audio volume, we need to clone the audio track and connect a Gain to it.
        //This Gain is saved on MediaStreamSystem so it can be accessed from the user's component and controlled.
        const audioTrack = MediaStreamSystem.instance.mediaStream.getAudioTracks()[0];
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(new MediaStream([audioTrack]));
        const dst = ctx.createMediaStreamDestination();
        const gainNode = ctx.createGain();
        gainNode.gain.value = 1;
        [src, gainNode, dst].reduce((a, b) => a && (a.connect(b) as any));
        MediaStreamSystem.instance.audioGainNode = gainNode;
        MediaStreamSystem.instance.mediaStream.removeTrack(audioTrack);
        MediaStreamSystem.instance.mediaStream.addTrack(dst.stream.getAudioTracks()[0]);
        // same thing for audio, but we can use our already-created
        const transport = channelType === 'instance' ? networkTransport.instanceSendTransport : networkTransport.channelSendTransport;

        if (transport != null) {
            // Create a new transport for audio and start producing
            MediaStreamSystem.instance.camAudioProducer = await transport.produce({
                track: MediaStreamSystem.instance.mediaStream.getAudioTracks()[0],
                appData: {mediaTag: "cam-audio", channelType: channelType, channelId: channelId}
            });

            if (MediaStreamSystem.instance.audioPaused) MediaStreamSystem.instance?.camAudioProducer.pause();
            else await resumeProducer(MediaStreamSystem.instance.camAudioProducer);
        }
    }
}

export async function endVideoChat(options: { leftParty?: boolean, endConsumers?: boolean }): Promise<boolean> {
    if (Network.instance != null && Network.instance.transport != null) {
        try {
            networkTransport = Network.instance.transport as any;
            const isInstanceMedia = networkTransport.instanceSocket?.connected === true && (networkTransport.channelId == null || networkTransport.channelId.length === 0);
            const isChannelMedia = networkTransport.channelSocket?.connected === true && networkTransport.channelId != null && networkTransport.channelId.length > 0;
            const request = isInstanceMedia ? networkTransport.instanceRequest : networkTransport.channelRequest;
            if (MediaStreamSystem.instance?.camVideoProducer) {
                await request(MessageTypes.WebRTCCloseProducer.toString(), {
                    producerId: MediaStreamSystem.instance?.camVideoProducer.id
                });
                await MediaStreamSystem.instance?.camVideoProducer?.close();
            }

            if (MediaStreamSystem.instance?.camAudioProducer) {
                await request(MessageTypes.WebRTCCloseProducer.toString(), {
                    producerId: MediaStreamSystem.instance?.camAudioProducer.id
                });
                await MediaStreamSystem.instance?.camAudioProducer?.close();
            }

            if (MediaStreamSystem.instance?.screenVideoProducer) {
                await request(MessageTypes.WebRTCCloseProducer.toString(), {
                    producerId: MediaStreamSystem.instance.screenVideoProducer.id
                });
                await MediaStreamSystem.instance.screenVideoProducer?.close();
            }
            if (MediaStreamSystem.instance?.screenAudioProducer) {
                await request(MessageTypes.WebRTCCloseProducer.toString(), {
                    producerId: MediaStreamSystem.instance.screenAudioProducer.id
                });
                await MediaStreamSystem.instance.screenAudioProducer?.close();
            }

            if (options?.endConsumers === true) {
                MediaStreamSystem.instance?.consumers.map(async (c) => {
                    await request(MessageTypes.WebRTCCloseConsumer.toString(), {
                        consumerId: c.id
                    });
                    await c.close();
                });
            }

            if (options?.leftParty === true) {
                if (networkTransport.channelRecvTransport != null && networkTransport.channelRecvTransport.closed !== true)
                    await networkTransport.channelRecvTransport.close();
                if (networkTransport.channelSendTransport != null && networkTransport.channelSendTransport.closed !== true)
                    await networkTransport.channelSendTransport.close();
            }

            resetProducer();
            return true;
        } catch (err) {
            console.log('EndvideoChat error');
            console.log(err);
        }
    }
}

export function resetProducer(): void {
    if (MediaStreamSystem) {
        if (MediaStreamSystem?.instance?.mediaStream != null) {
            const tracks = MediaStreamSystem.instance.mediaStream.getTracks();
            tracks.forEach((track) => track.stop());
        }
        MediaStreamSystem.instance.camVideoProducer = null;
        MediaStreamSystem.instance.camAudioProducer = null;
        MediaStreamSystem.instance.screenVideoProducer = null;
        MediaStreamSystem.instance.screenAudioProducer = null;
        MediaStreamSystem.instance.mediaStream = null;
        MediaStreamSystem.instance.localScreen = null;
        // MediaStreamSystem.instance.instance?.consumers = [];
    }
}

export function setRelationship(channelType: string, channelId: string): void {
    networkTransport = Network.instance.transport as any;
    networkTransport.channelType = channelType;
    networkTransport.channelId = channelId;
}

export async function subscribeToTrack(peerId: string, mediaTag: string, channelType: string, channelId: string) {
    networkTransport = Network.instance.transport as any;
    const request = channelType === 'instance' ? networkTransport.instanceRequest : networkTransport.channelRequest;

    if (request != null) {
        // if we do already have a consumer, we shouldn't have called this method
        let consumer = MediaStreamSystem.instance?.consumers.find
        ((c: any) => c.appData.peerId === peerId && c.appData.mediaTag === mediaTag);

        // ask the server to create a server-side consumer object and send us back the info we need to create a client-side consumer
        const consumerParameters = await request(MessageTypes.WebRTCReceiveTrack.toString(),
            {
                mediaTag,
                mediaPeerId: peerId,
                rtpCapabilities: networkTransport.mediasoupDevice.rtpCapabilities,
                channelType: channelType,
                channelId: channelId
            }
        );

        // Only continue if we have a valid id
        if (consumerParameters?.id == null) return;

        const transport = channelType === 'instance' ? networkTransport.instanceRecvTransport : networkTransport.channelRecvTransport;
        consumer = await transport.consume({
                ...consumerParameters,
                appData: {peerId, mediaTag, channelType},
                paused: true
            });

        if (MediaStreamSystem.instance?.consumers?.find(c => c?.appData?.peerId === peerId && c?.appData?.mediaTag === mediaTag) == null) {
            MediaStreamSystem.instance?.consumers.push(consumer);
            triggerUpdateConsumers();

            // okay, we're ready. let's ask the peer to send us media
            await resumeConsumer(consumer);
        } else await closeConsumer(consumer);
    }
}

export async function unsubscribeFromTrack(peerId: any, mediaTag: any) {
    const consumer = MediaStreamSystem.instance?.consumers.find(
        c => c.appData.peerId === peerId && c.appData.mediaTag === mediaTag
    );
    await closeConsumer(consumer);
}

export async function pauseConsumer(consumer: { appData: { peerId: any; mediaTag: any; }; id: any; pause: () => any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCPauseConsumer.toString(), { consumerId: consumer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCPauseConsumer.toString(), { consumerId: consumer.id });
    await consumer.pause();
}

export async function resumeConsumer(consumer: { appData: { peerId: any; mediaTag: any; }; id: any; resume: () => any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCResumeConsumer.toString(), { consumerId: consumer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCResumeConsumer.toString(), { consumerId: consumer.id });
    await consumer.resume();
}

export async function pauseProducer(producer: { appData: { mediaTag: any; }; id: any; pause: () => any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCPauseProducer.toString(), { producerId: producer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCPauseProducer.toString(), { producerId: producer.id });
    await producer.pause();
}

export async function resumeProducer(producer: { appData: { mediaTag: any; }; id: any; resume: () => any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCResumeProducer.toString(), { producerId: producer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCResumeProducer.toString(), { producerId: producer.id });
    await producer.resume();
}

export async function globalMuteProducer(producer: { id: any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCPauseProducer.toString(), { producerId: producer.id, globalMute: true });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCPauseProducer.toString(), { producerId: producer.id, globalMute: true });
}

export async function globalUnmuteProducer(producer: { id: any; }) {
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCResumeProducer.toString(), { producerId: producer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCResumeProducer.toString(), { producerId: producer.id });
}

export async function closeConsumer(consumer: any) {
    // tell the server we're closing this consumer. (the server-side
    // consumer may have been closed already, but that's okay.)
    networkTransport = Network.instance.transport as any;
    if ((networkTransport.channelId == null || networkTransport.channelId === '') && networkTransport.instanceRequest != null) await networkTransport.instanceRequest(MessageTypes.WebRTCCloseConsumer.toString(), { consumerId: consumer.id });
    if (networkTransport.channelId != null && networkTransport.channelId.length > 0 && networkTransport.channelRequest != null) await networkTransport.channelRequest(MessageTypes.WebRTCCloseConsumer.toString(), { consumerId: consumer.id });
    await consumer.close();

    const filteredConsumers = MediaStreamSystem.instance?.consumers.filter(
        (c: any) => !(c.id === consumer.id)
    ) as any[];
    MediaStreamSystem.instance.consumers = filteredConsumers;
}

export async function leave(instance: boolean): Promise<boolean> {
    if (Network.instance?.transport != null) {
        try {
            networkTransport = Network.instance.transport as any;
            networkTransport.leaving = true;
            const socket = instance === true ? networkTransport.instanceSocket : networkTransport.channelSocket;

            const request = instance === true ? networkTransport.instanceRequest : networkTransport.channelRequest;
            if (request) {
                // close everything on the server-side (transports, producers, consumers)
                const result = await request(MessageTypes.LeaveWorld.toString());
                if (result.error) console.error(result.error);
                EngineEvents.instance.dispatchEvent({ type: EngineEvents.EVENTS.LEAVE_WORLD })
            }

            networkTransport.leaving = false;

            //Leaving the world should close all transports from the server side.
            //This will also destroy all the associated producers and consumers.
            //All we need to do on the client is null all references.
            if (instance === true) {
                networkTransport.instanceRecvTransport = null;
                networkTransport.instanceSendTransport = null;
            }
            else {
                networkTransport.channelRecvTransport = null;
                networkTransport.channelSendTransport = null;
            }
            networkTransport.lastPollSyncData = {};
            if (MediaStreamSystem) {
                if (MediaStreamSystem?.instance?.mediaStream != null) {
                    const tracks = MediaStreamSystem.instance.mediaStream.getTracks();
                    tracks.forEach((track) => track.stop());
                }
                MediaStreamSystem.instance.camVideoProducer = null;
                MediaStreamSystem.instance.camAudioProducer = null;
                MediaStreamSystem.instance.screenVideoProducer = null;
                MediaStreamSystem.instance.screenAudioProducer = null;
                MediaStreamSystem.instance.mediaStream = null;
                MediaStreamSystem.instance.localScreen = null;
                MediaStreamSystem.instance.consumers = [];
            }

            if (socket && socket.close)
                socket.close();

            if (instance !== true && request != null) {
                if (process.env.NODE_ENV !== 'development') await networkTransport.instanceRequest(MessageTypes.WebRTCRequestCurrentProducers.toString(), { channelType: 'instance' });
            }
            return true;
        } catch (err) {
            console.log('Error with leave()');
            console.log(err);
            networkTransport.leaving = false;
        }
    }
}

// async startScreenshare(): Promise<boolean> {
//   console.log("start screen share");
//
//   // make sure we've joined the  and that we have a sending transport
//   if (!transport.sendTransport) transport.sendTransport = await transport.createTransport("send");
//
//   // get a screen share track
//   MediaStreamSystem.localScreen = await (navigator.mediaDevices as any).getDisplayMedia(
//     { video: true, audio: true }
//   );
//
//   // create a producer for video
//   MediaStreamSystem.screenVideoProducer = await transport.sendTransport.produce({
//     track: MediaStreamSystem.localScreen.getVideoTracks()[0],
//     encodings: [], // TODO: Add me
//     appData: { mediaTag: "screen-video" }
//   });
//
//   // create a producer for audio, if we have it
//   if (MediaStreamSystem.localScreen.getAudioTracks().length) {
//     MediaStreamSystem.screenAudioProducer = await transport.sendTransport.produce({
//       track: MediaStreamSystem.localScreen.getAudioTracks()[0],
//       appData: { mediaTag: "screen-audio" }
//     });
//   }
//
//   // handler for screen share stopped event (triggered by the
//   // browser's built-in screen sharing ui)
//   MediaStreamSystem.screenVideoProducer.track.onended = async () => {
//     console.log("screen share stopped");
//     await MediaStreamSystem.screenVideoProducer.pause();
//
//     const { error } = await transport.request(MessageTypes.WebRTCCloseProducer.toString(), {
//       producerId: MediaStreamSystem.screenVideoProducer.id
//     });
//
//     await MediaStreamSystem.screenVideoProducer.close();
//     MediaStreamSystem.screenVideoProducer = null;
//     if (MediaStreamSystem.screenAudioProducer) {
//       const { error: screenAudioProducerError } = await transport.request(MessageTypes.WebRTCCloseProducer.toString(), {
//         producerId: MediaStreamSystem.screenAudioProducer.id
//       });
//
//       await MediaStreamSystem.screenAudioProducer.close();
//       MediaStreamSystem.screenAudioProducer = null;
//     }
//   };
//   return true;
// }
