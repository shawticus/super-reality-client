import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Avatar,
    Button,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText, SwipeableDrawer,
    TextField,
    Tooltip,
    Typography
} from '@material-ui/core';
import {
    Add,
    Call,
    CallEnd,
    Clear,
    Close,
    Delete,
    Edit,
    ExpandMore,
    Forum,
    Grain,
    Group,
    GroupAdd,
    GroupWork,
    Mic,
    PeopleOutline,
    Person,
    Public,
    Save,
    Send,
    Settings,
    ThreeDRotation,
    Videocam,
    VideocamOff
} from '@material-ui/icons';
import PartyParticipantWindow from 'xr3ngine-client-core/components/ui/PartyParticipantWindow';
import { selectAuthState } from 'xr3ngine-client-core/redux/auth/selector';
import { doLoginAuto } from 'xr3ngine-client-core/redux/auth/service';
import { selectChatState } from 'xr3ngine-client-core/redux/chat/selector';
import {
    createMessage,
    getChannelMessages,
    getChannels,
    patchMessage,
    removeMessage,
    updateChatTarget,
    updateMessageScrollInit
} from 'xr3ngine-client-core/redux/chat/service';
import { selectChannelConnectionState } from 'xr3ngine-client-core/redux/channelConnection/selector';
import {
    connectToChannelServer,
    provisionChannelServer,
    resetChannelServer
} from 'xr3ngine-client-core/redux/channelConnection/service';
import { selectUserState } from 'xr3ngine-client-core/redux/user/selector';
import { Message } from 'xr3ngine-common/interfaces/Message';
import { User } from 'xr3ngine-common/interfaces/User';
import { DefaultInitializationOptions, initializeEngine } from 'xr3ngine-engine/src/initialize';
import { SocketWebRTCClientTransport } from 'xr3ngine-engine/src/networking/classes/SocketWebRTCClientTransport';
import {
    configureMediaTransports,
    createCamAudioProducer,
    createCamVideoProducer,
    endVideoChat,
    pauseProducer,
    resumeProducer,
    leave,
    setRelationship
} from 'xr3ngine-engine/src/networking/functions/SocketWebRTCClientFunctions';
import {NetworkSchema} from 'xr3ngine-engine/src/networking/interfaces/NetworkSchema';
import { MediaStreamSystem } from 'xr3ngine-engine/src/networking/systems/MediaStreamSystem';
import {DefaultNetworkSchema} from 'xr3ngine-engine/src/templates/networking/DefaultNetworkSchema';
import classNames from 'classnames';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
//@ts-ignore
import styles from './Harmony.module.scss';
import { Network } from 'xr3ngine-engine/src/networking/classes/Network';
import { EngineEvents } from 'xr3ngine-engine/src/ecs/classes/EngineEvents';
import {getFriends, unfriend} from "../../../redux/friend/service";
import {createGroup, getGroups, patchGroup, removeGroup, removeGroupUser} from "../../../redux/group/service";
import {createParty, getParty, removeParty, removePartyUser, transferPartyOwner} from "../../../redux/party/service";
import {updateInviteTarget} from "../../../redux/invite/service";
import {getLayerUsers} from "../../../redux/user/service";
import {banUserFromLocation} from "../../../redux/location/service";
import {updateCamVideoState, updateCamAudioState} from '../../../redux/mediastream/service';
import {updateChannelTypeState, changeChannelTypeState} from "../../../redux/transport/service";
import {selectFriendState} from "../../../redux/friend/selector";
import {selectGroupState} from "../../../redux/group/selector";
import {selectLocationState} from "../../../redux/location/selector";
import {selectPartyState} from "../../../redux/party/selector";
import {selectTransportState} from '../../../redux/transport/selector';
import {selectMediastreamState} from "../../../redux/mediastream/selector";
import {Group as GroupType} from "../../../../common/interfaces/Group";
import { isMobileOrTablet } from 'xr3ngine-engine/src/common/functions/isMobile';
import ProfileMenu from "../UserMenu/menus/ProfileMenu";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const engineRendererCanvasId = 'engine-renderer-canvas';

const mapStateToProps = (state: any): any => {
    return {
        authState: selectAuthState(state),
        chatState: selectChatState(state),
        channelConnectionState: selectChannelConnectionState(state),
        userState: selectUserState(state),
        friendState: selectFriendState(state),
        groupState: selectGroupState(state),
        locationState: selectLocationState(state),
        partyState: selectPartyState(state),
        transportState: selectTransportState(state),
        mediastream: selectMediastreamState(state)
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    doLoginAuto: bindActionCreators(doLoginAuto, dispatch),
    getChannels: bindActionCreators(getChannels, dispatch),
    getChannelMessages: bindActionCreators(getChannelMessages, dispatch),
    createMessage: bindActionCreators(createMessage, dispatch),
    removeMessage: bindActionCreators(removeMessage, dispatch),
    updateChatTarget: bindActionCreators(updateChatTarget, dispatch),
    provisionChannelServer: bindActionCreators(provisionChannelServer, dispatch),
    connectToChannelServer: bindActionCreators(connectToChannelServer, dispatch),
    resetChannelServer: bindActionCreators(resetChannelServer, dispatch),
    patchMessage: bindActionCreators(patchMessage, dispatch),
    updateMessageScrollInit: bindActionCreators(updateMessageScrollInit, dispatch),
    getFriends: bindActionCreators(getFriends, dispatch),
    unfriend: bindActionCreators(unfriend, dispatch),
    getGroups: bindActionCreators(getGroups, dispatch),
    createGroup: bindActionCreators(createGroup, dispatch),
    patchGroup: bindActionCreators(patchGroup, dispatch),
    removeGroup: bindActionCreators(removeGroup, dispatch),
    removeGroupUser: bindActionCreators(removeGroupUser, dispatch),
    getParty: bindActionCreators(getParty, dispatch),
    createParty: bindActionCreators(createParty, dispatch),
    removeParty: bindActionCreators(removeParty, dispatch),
    removePartyUser: bindActionCreators(removePartyUser, dispatch),
    transferPartyOwner: bindActionCreators(transferPartyOwner, dispatch),
    updateInviteTarget: bindActionCreators(updateInviteTarget, dispatch),
    getLayerUsers: bindActionCreators(getLayerUsers, dispatch),
    banUserFromLocation: bindActionCreators(banUserFromLocation, dispatch),
    changeChannelTypeState: bindActionCreators(changeChannelTypeState, dispatch)
});

interface Props {
    authState?: any;
    doLoginAuto?: typeof doLoginAuto;
    setLeftDrawerOpen: any;
    setRightDrawerOpen: any;
    chatState?: any;
    channelConnectionState?: any;
    getChannels?: any;
    getChannelMessages?: any;
    createMessage?: any;
    removeMessage?: any;
    updateChatTarget?: any;
    patchMessage?: any;
    updateMessageScrollInit?: any;
    userState?: any;
    provisionChannelServer?: typeof provisionChannelServer;
    connectToChannelServer?: typeof connectToChannelServer;
    resetChannelServer?: typeof resetChannelServer;
    friendState?: any;
    getFriends?: any;
    groupState?: any;
    getGroups?: any;
    partyState?: any;
    removeParty?: any;
    removePartyUser?: any;
    transferPartyOwner?: any;
    setDetailsType?: any;
    setGroupFormMode?: any;
    setGroupFormOpen?: any;
    setGroupForm?: any;
    setSelectedUser?: any;
    setSelectedGroup?: any;
    locationState?: any;
    transportState?: any;
    changeChannelTypeState?: any;
    mediastream?: any;
    setHarmonyOpen?: any;
    isHarmonyPage?: boolean;
}

const Harmony = (props: Props): any => {
    const {
        authState,
        chatState,
        channelConnectionState,
        getChannels,
        getChannelMessages,
        createMessage,
        removeMessage,
        setLeftDrawerOpen,
        setRightDrawerOpen,
        updateChatTarget,
        patchMessage,
        updateMessageScrollInit,
        userState,
        provisionChannelServer,
        connectToChannelServer,
        resetChannelServer,
        friendState,
        getFriends,
        groupState,
        getGroups,
        partyState,
        setDetailsType,
        setGroupFormOpen,
        setGroupFormMode,
        setGroupForm,
        setSelectedUser,
        setSelectedGroup,
        locationState,
        transportState,
        changeChannelTypeState,
        mediastream,
        setHarmonyOpen,
        isHarmonyPage
    } = props;

    const messageRef = React.useRef();
    const messageEl = messageRef.current;
    const selfUser = authState.get('user') as User;
    const channelState = chatState.get('channels');
    const channels = channelState.get('channels');
    const targetObject = chatState.get('targetObject');
    const targetObjectType = chatState.get('targetObjectType');
    const targetChannelId = chatState.get('targetChannelId');
    const messageScrollInit = chatState.get('messageScrollInit');
    const [messageScrollUpdate, setMessageScrollUpdate] = useState(false);
    const [topMessage, setTopMessage] = useState({});
    const [messageCrudSelected, setMessageCrudSelected] = useState('');
    const [messageDeletePending, setMessageDeletePending] = useState('');
    const [messageUpdatePending, setMessageUpdatePending] = useState('');
    const [editingMessage, setEditingMessage] = useState('');
    const [composingMessage, setComposingMessage] = useState('');
    const activeChannel = channels.get(targetChannelId);
    const [producerStarting, _setProducerStarting] = useState('');
    const [activeAVChannelId, _setActiveAVChannelId] = useState('');
    const [channelAwaitingProvision, _setChannelAwaitingProvision] = useState({
        id: '',
        audio: false,
        video: false
    });
    const [selectedAccordion, setSelectedAccordion] = useState('friends');
    const [tabIndex, setTabIndex] = useState(0);
    const [videoPaused, setVideoPaused] = useState(false);
    const [audioPaused, setAudioPaused] = useState(false);
    const [selectorsOpen, setSelectorsOpen] = useState(false);
    const [dimensions, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth
    });
    const [engineInitialized, setEngineInitialized] = useState(false);
    const [lastConnectToWorldId, _setLastConnectToWorldId] = useState('');
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const instanceLayerUsers = userState.get('layerUsers') ?? [];
    const channelLayerUsers = userState.get('channelLayerUsers') ?? [];
    const layerUsers = channels.get(activeAVChannelId)?.channelType === 'instance' ? instanceLayerUsers : channelLayerUsers;
    const friendSubState = friendState.get('friends');
    const friends = friendSubState.get('friends');
    const groupSubState = groupState.get('groups');
    const groups = groupSubState.get('groups');
    const party = partyState.get('party');
    const currentLocation = locationState.get('currentLocation').get('location');

    const setProducerStarting = value => {
        producerStartingRef.current = value;
        _setProducerStarting(value);
    };

    const setActiveAVChannelId = value => {
        activeAVChannelIdRef.current = value;
        _setActiveAVChannelId(value);
    };

    const setChannelAwaitingProvision = value => {
        channelAwaitingProvisionRef.current = value;
        _setChannelAwaitingProvision(value);
    }

    const setLastConnectToWorldId = value => {
        lastConnectToWorldIdRef.current = value;
        _setLastConnectToWorldId(value);
    }

    const producerStartingRef = useRef(producerStarting);
    const activeAVChannelIdRef = useRef(activeAVChannelId);
    const channelAwaitingProvisionRef = useRef(channelAwaitingProvision);
    const lastConnectToWorldIdRef = useRef(lastConnectToWorldId);
    const videoEnabled = isHarmonyPage === true ? true : currentLocation.locationSettings ? currentLocation.locationSettings.videoEnabled : false;
    const isCamVideoEnabled = mediastream.get('isCamVideoEnabled');
    const isCamAudioEnabled = mediastream.get('isCamAudioEnabled');

    useEffect(() => {
        if (EngineEvents.instance != null) {
            setEngineInitialized(true);
            createEngineListeners();
        }
        window.addEventListener('resize', () => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })
        });

        return () => {
            if (EngineEvents.instance != null) {
                setEngineInitialized(false);
                EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, connectToWorldHandler);

                EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD_TIMEOUT, (e: any) => {
                    if (e.instance === true) resetChannelServer();
                })

                EngineEvents.instance?.removeEventListener(EngineEvents.EVENTS.LEAVE_WORLD, () => {
                    resetChannelServer();
                    if (channelAwaitingProvisionRef.current.id.length === 0) _setActiveAVChannelId('');
                });
            }

            window.removeEventListener('resize', () => {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                })
            });
        }
    }, []);

    useEffect(() => {
        if ((Network.instance.transport as any)?.channelType === 'instance') {
            const channelEntries = [...channels.entries()];
            const instanceChannel = channelEntries.find((entry) => entry[1].instanceId != null);
            if (instanceChannel != null && (MediaStreamSystem.instance.camAudioProducer != null || MediaStreamSystem.instance.camVideoProducer != null)) setActiveAVChannelId(instanceChannel[0]);
        } else {
            setActiveAVChannelId(transportState.get('channelId'));
        }
    }, [transportState])

    useEffect(() => {
        if (channelConnectionState.get('connected') === false && channelAwaitingProvision?.id?.length > 0) {
            provisionChannelServer(null, channelAwaitingProvision.id);
            if (channelAwaitingProvision?.audio === true) setProducerStarting('audio');
            if (channelAwaitingProvision?.video === true) setProducerStarting('video');
            setChannelAwaitingProvision({
                id: '',
                audio: false,
                video: false
            });
        }
    }, [channelConnectionState]);


    useEffect(() => {
        if (messageScrollInit === true && messageEl != null && (messageEl as any).scrollTop != null) {
            (messageEl as any).scrollTop = (messageEl as any).scrollHeight;
            updateMessageScrollInit(false);
            setMessageScrollUpdate(false);
        }
        if (messageScrollUpdate === true) {
            setMessageScrollUpdate(false);
            if (messageEl != null && (messageEl as any).scrollTop != null) {
                (messageEl as any).scrollTop = (topMessage as any).offsetTop;
            }
        }
    }, [chatState]);

    useEffect(() =>  {
        if (channelState.get('updateNeeded') === true) {
            getChannels();
        }
    }, [channelState]);

    useEffect(() => {
        channels.forEach((channel) => {
            if (chatState.get('updateMessageScroll') === true) {
                chatState.set('updateMessageScroll', false);
                if (channel.id === targetChannelId && messageEl != null && (((messageEl as any).scrollHeight - (messageEl as any).scrollTop - (messageEl as any).firstElementChild?.offsetHeight) <= (messageEl as any).clientHeight + 20)) {
                    (messageEl as any).scrollTop = (messageEl as any).scrollHeight;
                }
            }
            if (channel.updateNeeded === true) {
                getChannelMessages(channel.id);
            }
        });
    }, [channels]);

    useEffect(() => {
        setVideoPaused(!isCamVideoEnabled);
    }, [isCamVideoEnabled]);

    useEffect(() => {
        setAudioPaused(!isCamAudioEnabled);
    }, [isCamAudioEnabled]);

    const handleComposingMessageChange = (event: any): void => {
        const message = event.target.value;
        setComposingMessage(message);
    };

    const handleEditingMessageChange = (event: any): void => {
        const message = event.target.value;
        setEditingMessage(message);
    };

    const packageMessage = (): void => {
        if (composingMessage.length > 0) {
            createMessage({
                targetObjectId: targetObject.id,
                targetObjectType: targetObjectType,
                text: composingMessage
            });
            setComposingMessage('');
        }
    };

    const setActiveChat = (channelType, target): void => {
        updateMessageScrollInit(true);
        updateChatTarget(channelType, target);
        setMessageDeletePending('');
        setMessageUpdatePending('');
        setEditingMessage('');
        setComposingMessage('');
    };

    const connectToWorldHandler = async(): Promise<void> => {
        if (lastConnectToWorldIdRef.current !== activeAVChannelIdRef.current) {
            setLastConnectToWorldId(activeAVChannelIdRef.current);
            await toggleAudio(activeAVChannelIdRef.current);
            await toggleVideo(activeAVChannelIdRef.current);
            updateChannelTypeState();
            updateCamVideoState();
            updateCamAudioState();
        }
    }

    const createEngineListeners = (): void => {
        EngineEvents.instance.addEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD, connectToWorldHandler);

        EngineEvents.instance.addEventListener(EngineEvents.EVENTS.CONNECT_TO_WORLD_TIMEOUT, (e: any) => {
            if (e.instance === true) resetChannelServer();
        })

        EngineEvents.instance.addEventListener(EngineEvents.EVENTS.LEAVE_WORLD, () => {
            resetChannelServer();
            setLastConnectToWorldId('');
            if (channelAwaitingProvisionRef.current.id.length === 0) _setActiveAVChannelId('');
            updateChannelTypeState();
            updateCamVideoState();
            updateCamAudioState();
        });
    }

    const onChannelScroll = (e): void => {
        if ((e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight ) {
            nextChannelPage();
        }
    };

    const onMessageScroll = (e): void => {
        if (e.target.scrollTop === 0 && (e.target.scrollHeight > e.target.clientHeight) && messageScrollInit !== true && (activeChannel.skip + activeChannel.limit) < activeChannel.total) {
            setMessageScrollUpdate(true);
            setTopMessage((messageEl as any).firstElementChild);
            nextMessagePage();
        }
    };

    const nextChannelPage = (): void => {
        if ((channelState.get('skip') + channelState.get('limit')) < channelState.get('total')) {
            getChannels(channelState.get('skip') + channelState.get('limit'));
        }
    };

    const nextMessagePage = (): void => {
        if ((activeChannel.skip + activeChannel.limit) < activeChannel.total) {
            getChannelMessages(targetChannelId, activeChannel.skip + activeChannel.limit);
        }
        else {
            setMessageScrollUpdate(false);
        }
    };

    const generateMessageSecondary = (message: Message): string => {
        const date = moment(message.createdAt).format('MMM D YYYY, h:mm a');
        if (message.senderId !== selfUser.id) {
            return `${message?.sender?.name ? message.sender.name : 'A former user'} on ${date}`;
        }
        else {
            return date;
        }
    };

    const loadMessageEdit = (e: any, message: Message) => {
        e.preventDefault();
        setMessageUpdatePending(message.id);
        setEditingMessage(message.text);
        setMessageDeletePending('');
    };

    const showMessageDeleteConfirm = (e: any, message: Message) => {
        e.preventDefault();
        setMessageDeletePending(message.id);
        setMessageUpdatePending('');
    };

    const cancelMessageDelete = (e: any) => {
        e.preventDefault();
        setMessageDeletePending('');
    };

    const confirmMessageDelete = (e: any, message: Message) => {
        e.preventDefault();
        setMessageDeletePending('');
        removeMessage(message.id, message.channelId);
    };

    const cancelMessageUpdate = (e: any) => {
        e.preventDefault();
        setMessageUpdatePending('');
        setEditingMessage('');
    };

    const confirmMessageUpdate = (e: any, message: Message) => {
        e.preventDefault();
        patchMessage(message.id, editingMessage);
        setMessageUpdatePending('');
        setEditingMessage('');
    };

    const toggleMessageCrudSelect = (e: any, message: Message) => {
        e.preventDefault();
        if (message.senderId === selfUser.id) {
            if (messageCrudSelected === message.id && messageUpdatePending !== message.id) {
                setMessageCrudSelected('');
            } else {
                setMessageCrudSelected(message.id);
            }
        }
    };

    const checkMediaStream = async (channelType: string, channelId?: string) => {
        if (!MediaStreamSystem.instance?.mediaStream) {
            console.log('Configuring media transports', channelType, channelId);
            await configureMediaTransports(channelType, channelId);
        }
    };

    const handleMicClick = async (e: any) => {
        e.stopPropagation();
        if (MediaStreamSystem.instance?.camAudioProducer == null) {
            const channel = channels.get(targetChannelId);
            if (channel.instanceId == null) await createCamAudioProducer('channel', targetChannelId);
            else await createCamAudioProducer('instance');
            setAudioPaused(false);
            await resumeProducer(MediaStreamSystem.instance?.camAudioProducer);
        } else {
            const msAudioPaused = MediaStreamSystem.instance?.toggleAudioPaused();
            setAudioPaused(MediaStreamSystem.instance?.mediaStream === null || MediaStreamSystem.instance?.camAudioProducer == null || MediaStreamSystem.instance?.audioPaused === true);
            if (msAudioPaused === true) await pauseProducer(MediaStreamSystem.instance?.camAudioProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camAudioProducer);
        }
        updateCamAudioState();
    };

    const handleCamClick = async (e: any) => {
        e.stopPropagation();
        if (MediaStreamSystem.instance?.camVideoProducer == null) {
            const channel = channels.get(targetChannelId);
            if (channel.instanceId == null) await createCamVideoProducer('channel', targetChannelId);
            else await createCamVideoProducer('instance');
            setVideoPaused(false);
            await resumeProducer(MediaStreamSystem.instance?.camVideoProducer);
        } else {
            const msVideoPaused = MediaStreamSystem.instance?.toggleVideoPaused();
            setVideoPaused(MediaStreamSystem.instance?.mediaStream === null || MediaStreamSystem.instance?.camVideoProducer == null || MediaStreamSystem.instance?.videoPaused === true);
            if (msVideoPaused === true) await pauseProducer(MediaStreamSystem.instance?.camVideoProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camVideoProducer);
        }
        updateCamVideoState();
    };

    const handleStartCall = async(e: any) => {
        e.stopPropagation();
        const channel = channels.get(targetChannelId);
        const channelType = channel.instanceId != null ? 'instance' : 'channel';
        changeChannelTypeState(channelType, targetChannelId);
        await endVideoChat({});
        await leave(false);
        setActiveAVChannelId(targetChannelId);
        if (channel.instanceId == null) provisionChannelServer(null, targetChannelId);
        else {
            await checkMediaStream('instance');
            await createCamVideoProducer('instance');
            await createCamAudioProducer('instance');
            updateCamVideoState();
            updateCamAudioState();
        }
    }

    const handleEndCall = async(e: any) => {
        e.stopPropagation();
        changeChannelTypeState('', '');
        await endVideoChat({});
        await leave(false);
        setActiveAVChannelId('');
        updateCamVideoState();
        updateCamAudioState();
    }

    const toggleAudio = async(channelId) => {
        await checkMediaStream('channel', channelId);

        if (MediaStreamSystem.instance?.camAudioProducer == null) await createCamAudioProducer('channel', channelId);
        else {
            const audioPaused = MediaStreamSystem.instance?.toggleAudioPaused();
            setAudioPaused(MediaStreamSystem.instance?.mediaStream === null || MediaStreamSystem.instance?.camAudioProducer == null || MediaStreamSystem.instance?.audioPaused === true);
            if (audioPaused === true) await pauseProducer(MediaStreamSystem.instance?.camAudioProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camAudioProducer);
        }
    };

    const toggleVideo = async(channelId) => {
        await checkMediaStream('channel', channelId);
        if (MediaStreamSystem.instance?.camVideoProducer == null) await createCamVideoProducer('channel', channelId);
        else {
            const videoPaused = MediaStreamSystem.instance?.toggleVideoPaused();
            setVideoPaused(MediaStreamSystem.instance?.mediaStream === null || MediaStreamSystem.instance?.camVideoProducer == null || MediaStreamSystem.instance?.videoPaused === true);
            if (videoPaused === true) await pauseProducer(MediaStreamSystem.instance?.camVideoProducer);
            else await resumeProducer(MediaStreamSystem.instance?.camVideoProducer);
        }
    };

    const openChat = (targetObjectType: string, targetObject: any): void => {
        setTimeout(() => {
            updateChatTarget(targetObjectType, targetObject);
            updateMessageScrollInit(true);
        }, 100);
    };

    const handleAccordionSelect = (accordionType: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
        if (accordionType === selectedAccordion) {
            setSelectedAccordion('');
        } else {
            setSelectedAccordion(accordionType);
        }
    };

    const openInvite = (targetObjectType?: string, targetObjectId?: string): void => {
        updateInviteTarget(targetObjectType, targetObjectId);
        setLeftDrawerOpen(false);
        setRightDrawerOpen(true);
    };

    const openDetails = (e, type, object) => {
        e.stopPropagation();
        setLeftDrawerOpen(true);
        setDetailsType(type);
        if (type === 'user') {
            setSelectedUser(object);
        } else if (type === 'group') {
            setSelectedGroup(object);
        }
    };

    const openGroupForm = (mode: string, group?: GroupType) => {
        setLeftDrawerOpen(true);
        setGroupFormOpen(true);
        setGroupFormMode(mode);
        if (group != null) {
            setGroupForm({
                id: group.id,
                name: group.name,
                groupUsers: group.groupUsers,
                description: group.description
            });
        }
    };

    async function init(): Promise<any> {
        if (Network.instance.isInitialized !== true) {
            const networkSchema: NetworkSchema = {
                ...DefaultNetworkSchema,
                transport: SocketWebRTCClientTransport,
            };

            const InitializationOptions = {
                ...DefaultInitializationOptions,
                networking: {
                    schema: networkSchema,
                },
                renderer: {}
            };

            await initializeEngine(InitializationOptions);
            if (engineInitialized === false) createEngineListeners();
        }
    }

    function getChannelName(): string {
        const channel = channels.get(targetChannelId);
        if (channel && channel.channelType !== 'instance') {
            if (channel.channelType === 'group') return channel[channel.channelType].name;
            if (channel.channelType === 'party') return 'Current party';
            if (channel.channelType === 'user') return channel.user1.id === selfUser.id ? channel.user2.name : channel.user1.name;
        } else return 'Current Layer';
    }

    function getAVChannelName(): string {
        const channel = channels.get(activeAVChannelId);
        if (channel && channel.channelType !== 'instance') {
            if (channel.channelType === 'group') return channel[channel.channelType].name;
            if (channel.channelType === 'party') return 'Current party';
            if (channel.channelType === 'user') return channel.user1.id === selfUser.id ? channel.user2.name : channel.user1.name;
        } else return 'Current Layer';
    }

    function calcWidth(): 12 | 6 | 4 | 3 {
        return layerUsers.length === 1 ? 12 : layerUsers.length <= 4 ? 6 : layerUsers.length <= 9 ? 4 : 3;
    }


    const nextFriendsPage = (): void => {
        if ((friendSubState.get('skip') + friendSubState.get('limit')) < friendSubState.get('total')) {
            getFriends(friendSubState.get('skip') + friendSubState.get('limit'));
        }
    };

    const nextGroupsPage = (): void => {
        if ((groupSubState.get('skip') + groupSubState.get('limit')) < groupSubState.get('total')) {
            getGroups(groupSubState.get('skip') + groupSubState.get('limit'));
        }
    };

    const onListScroll = (e): void => {
        if ((e.target.scrollHeight - e.target.scrollTop) === e.target.clientHeight) {
            if (tabIndex === 0) {
                nextFriendsPage();
            } else if (tabIndex === 1) {
                nextGroupsPage();
            }
        }
    };

    const isActiveChat = (channelType: string, targetObjectId: string): boolean => {
        const channelEntries = [...channels.entries()];
        const channelMatch = channelType === 'instance' ? channelEntries.find((entry) => entry[1].instanceId === targetObjectId) :
                             channelType === 'group' ? channelEntries.find((entry) => entry[1].groupId === targetObjectId) :
                             channelType === 'friend' ? channelEntries.find((entry) => (entry[1].userId1 === targetObjectId || entry[1].userId2 === targetObjectId)) :
                             channelEntries.find((entry) => entry[1].partyId === targetObjectId);
        return channelMatch != null && channelMatch[0] === targetChannelId;
    }

    const isActiveAVCall = (channelType: string, targetObjectId: string): boolean => {
        const channelEntries = [...channels.entries()];
        const channelMatch = channelType === 'instance' ? channelEntries.find((entry) => entry[1].instanceId === targetObjectId) :
            channelType === 'group' ? channelEntries.find((entry) => entry[1].groupId === targetObjectId) :
                channelType === 'friend' ? channelEntries.find((entry) => (entry[1].userId1 === targetObjectId || entry[1].userId2 === targetObjectId)) :
                    channelEntries.find((entry) => entry[1].partyId === targetObjectId);
        return channelMatch != null && channelMatch[0] === activeAVChannelId;
    }

    const closeHarmony = (): void => {
        const canvas = document.getElementById(engineRendererCanvasId) as HTMLCanvasElement;
        if (canvas?.style != null) canvas.style.width = '100%';
        setHarmonyOpen(false);
    }

    const openProfileMenu = (): void => {
        setProfileMenuOpen(true);
    }

    useEffect(() => {
        if (
            channelConnectionState.get('instanceProvisioned') === true &&
            channelConnectionState.get('updateNeeded') === true &&
            channelConnectionState.get('instanceServerConnecting') === false &&
            channelConnectionState.get('connected') === false
        ) {
            init().then(() => {
                connectToChannelServer(channelConnectionState.get('channelId'), isHarmonyPage)
                updateCamVideoState();
                updateCamAudioState();
            });
        }
    }, [channelConnectionState]);

    const chatSelectors = <div className={classNames({
        [styles['list-container']]: true,
        [styles['chat-selectors']]: true
    })}>
        <div className={styles.partyInstanceButtons}>
            <div className={classNames({
                [styles.partyButton]: true,
                [styles.activeChat]: party != null && isActiveChat('party', party.id)
            })}
                 onClick={(e) => {
                     if (party != null) {
                         setActiveChat('party', party);
                         if (isMobileOrTablet() === true || dimensions.width <= 768) setSelectorsOpen(false);
                     } else openDetails(e, 'party', party)}}
            >
                <PeopleOutline className={styles['icon-margin-right']}/>
                <span>Party</span>
                <div className={classNames({
                    [styles.activeAVCall]: party != null && isActiveAVCall('party', party.id)
                })} />
                { party != null && party.id != null && party.id !== '' && <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e,'party', party)}><Settings/></ListItemIcon>}
            </div>
            { selfUser.instanceId != null && <div className={classNames({
                    [styles.instanceButton]: true,
                    [styles.activeChat]: isActiveChat('instance', selfUser.instanceId)
                })}
                onClick={() => {
                    setActiveChat('instance', {
                        id: selfUser.instanceId
                    });
                    if (isMobileOrTablet() === true || dimensions.width <= 768) setSelectorsOpen(false);
                }}
            >
                <Grain className={styles['icon-margin-right']}/>
                <span>Here</span>
                <div className={classNames({
                    [styles.activeAVCall]: isActiveAVCall('instance', selfUser.instanceId)
                })} />
            </div> }
        </div>
        {selfUser.userRole !== 'guest' &&
        <Accordion expanded={selectedAccordion === 'user'} onChange={handleAccordionSelect('user') } className={styles['MuiAccordion-root']}>
            <AccordionSummary
                id="friends-header"
                expandIcon={<ExpandMore/>}
                aria-controls="friends-content"
            >
                <Group className={styles['icon-margin-right']}/>
                <Typography>Friends</Typography>
            </AccordionSummary>
            <AccordionDetails className={styles['list-container']}>
                <div className={styles['flex-center']}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add/>}
                        onClick={() => openInvite('user')}>
                        Invite Friend
                    </Button>
                </div>
                <List
                    onScroll={(e) => onListScroll(e)}
                >
                    {friends && friends.length > 0 && friends.sort((a, b) => a.name - b.name).map((friend, index) => {
                        return <div key={friend.id}>
                            <ListItem className={classNames({
                                [styles.selectable]: true,
                                [styles.activeChat]: isActiveChat('user', friend.id)
                            })}
                                      onClick={() => {
                                          setActiveChat('user', friend);
                                          if (isMobileOrTablet() === true || dimensions.width <= 768) setSelectorsOpen(false);
                                      }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={friend.avatarUrl}/>
                                </ListItemAvatar>
                                <ListItemText primary={friend.name}/>
                                <div className={classNames({
                                    [styles.activeAVCall]: isActiveAVCall('user', friend.id)
                                })} />
                                <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e,'user', friend)}><Settings/></ListItemIcon>
                            </ListItem>
                            {index < friends.length - 1 && <Divider/>}
                        </div>;
                    })
                    }
                </List>
            </AccordionDetails>
        </Accordion>
        }
        {selfUser.userRole !== 'guest' &&
        <Accordion expanded={selectedAccordion === 'group'} onChange={handleAccordionSelect('group')} className={styles['MuiAccordion-root']}>
            <AccordionSummary
                id="groups-header"
                expandIcon={<ExpandMore/>}
                aria-controls="groups-content"
            >
                <GroupWork className={styles['icon-margin-right']}/>
                <Typography>Groups</Typography>
            </AccordionSummary>
            <AccordionDetails className={styles['list-container']}>
                <div className={styles['flex-center']}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Add/>}
                        onClick={() => openGroupForm('create')}>
                        Create Group
                    </Button>
                </div>
                <List
                    onScroll={(e) => onListScroll(e)}
                >
                    {groups && groups.length > 0 && groups.sort((a, b) => a.name - b.name).map((group, index) => {
                        return <div key={group.id}>
                            <ListItem
                                className={classNames({
                                    [styles.selectable]: true,
                                    [styles.activeChat]: isActiveChat('group', group.id)
                                })}
                                onClick={() => {
                                    setActiveChat('group', group);
                                    if (isMobileOrTablet() === true || dimensions.width <= 768) setSelectorsOpen(false);
                                }}
                            >
                                <ListItemText primary={group.name}/>
                                <div className={classNames({
                                    [styles.activeAVCall]: isActiveAVCall('group', group.id)
                                })} />
                                <ListItemIcon className={styles.groupEdit} onClick={(e) => openDetails(e,'group', group)}><Settings/></ListItemIcon>
                            </ListItem>
                            {index < groups.length - 1 && <Divider/>}
                        </div>;
                    })
                    }
                </List>
            </AccordionDetails>
        </Accordion>
        }
        {
            selfUser && selfUser.instanceId &&
            <Accordion expanded={selectedAccordion === 'layerUsers'}
                       onChange={handleAccordionSelect('layerUsers')}>
                <AccordionSummary
                    id="layer-user-header"
                    expandIcon={<ExpandMore/>}
                    aria-controls="layer-user-content"
                >
                    <Public className={styles['icon-margin-right']}/>
                    <Typography>Layer Users</Typography>
                </AccordionSummary>
                <AccordionDetails className={classNames({
                    [styles.flexbox]: true,
                    [styles['flex-column']]: true,
                    [styles['flex-center']]: true
                })}>
                    <div className={styles['list-container']}>
                        <div className={styles.title}>Users on this Layer</div>
                        <List
                            className={classNames({
                                [styles['flex-center']]: true,
                                [styles['flex-column']]: true
                            })}
                            onScroll={(e) => onListScroll(e)}
                        >
                            {instanceLayerUsers && instanceLayerUsers.length > 0 && instanceLayerUsers.sort((a, b) => a.name - b.name).map((layerUser) => {
                                    return <ListItem key={layerUser.id}>
                                        <ListItemAvatar>
                                            <Avatar src={layerUser.avatarUrl}/>
                                        </ListItemAvatar>
                                        {selfUser.id === layerUser.id &&
                                        <ListItemText primary={layerUser.name + ' (you)'}/>}
                                        {selfUser.id !== layerUser.id &&
                                        <ListItemText primary={layerUser.name}/>}
                                        {/*{*/}
                                        {/*    locationBanPending !== layerUser.id &&*/}
                                        {/*    isLocationAdmin === true &&*/}
                                        {/*    selfUser.id !== layerUser.id &&*/}
                                        {/*    layerUser.locationAdmins?.find(locationAdmin => locationAdmin.locationId === currentLocation.id) == null &&*/}
                                        {/*    <Tooltip title="Ban user">*/}
                                        {/*        <Button onClick={(e) => showLocationBanConfirm(e, layerUser.id)}>*/}
                                        {/*            <Block/>*/}
                                        {/*        </Button>*/}
                                        {/*    </Tooltip>*/}
                                        {/*}*/}
                                        {/*{locationBanPending === layerUser.id &&*/}
                                        {/*<div>*/}
                                        {/*    <Button variant="contained"*/}
                                        {/*            color="primary"*/}
                                        {/*            onClick={(e) => confirmLocationBan(e, layerUser.id)}*/}
                                        {/*    >*/}
                                        {/*        Ban User*/}
                                        {/*    </Button>*/}
                                        {/*    <Button variant="contained"*/}
                                        {/*            color="secondary"*/}
                                        {/*            onClick={(e) => cancelLocationBan(e)}*/}
                                        {/*    >*/}
                                        {/*        Cancel*/}
                                        {/*    </Button>*/}
                                        {/*</div>*/}
                                        {/*}*/}
                                    </ListItem>;
                                }
                            )
                            }
                        </List>
                    </div>
                </AccordionDetails>
            </Accordion>
        }
    </div>

    return (
        <div className={styles['harmony-component']}>
            <style> {`
                .Mui-selected {
                    background-color: rgba(0, 0, 0, 0.4) !important;
                }
                .MuiOutlinedInput-notchedOutline {
                    border-color: rgba(127, 127, 127, 0.7);
                }
            `}</style>
            { (isMobileOrTablet() === true || dimensions.width <= 768) && <SwipeableDrawer
                className={classNames({
                    [styles['flex-column']]: true,
                    [styles['list-container']]: true
                })}
                BackdropProps={{invisible: true}}
                anchor="left"
                open={selectorsOpen === true}
                onClose={() => {
                    setSelectorsOpen(false);
                }}
                onOpen={() => {
                    setSelectedAccordion('friends')
                }}
            >
                <div className={styles['close-button']} onClick={() => setSelectorsOpen(false)}><Close /></div>
                {chatSelectors}
            </SwipeableDrawer> }
            { (isMobileOrTablet() !== true && dimensions.width > 768) && chatSelectors}
            <div className={styles['chat-window']}>
                <div className={styles['harmony-header']}>
                    { (isMobileOrTablet() === true || dimensions.width <= 768) && <div className={classNames({
                        [styles['chat-toggle']]: true,
                        [styles.iconContainer]: true
                    })} onClick={() => setSelectorsOpen(true)}><Group /></div> }
                    { targetChannelId?.length > 0 && <header className={styles.mediaControls}>
                        { activeAVChannelId === '' &&
                            <div className={classNames({
                                [styles.iconContainer]: true,
                                [styles.startCall]: true
                            })} onClick={(e) => handleStartCall(e)}>
                                <Call/>
                            </div>
                        }
                        { activeAVChannelId !== '' &&
                            <div className={styles.activeCallControls}>
                                <div className={classNames({
                                    [styles.iconContainer]: true,
                                    [styles.endCall]: true
                                })} onClick={(e) => handleEndCall(e)}>
                                    <CallEnd />
                                </div>
                                <div className={styles.iconContainer + ' ' + (audioPaused ? styles.off : styles.on)}>
                                    <Mic id='micOff' className={styles.offIcon} onClick={(e) => handleMicClick(e)} />
                                    <Mic id='micOn' className={styles.onIcon} onClick={(e) => handleMicClick(e)} />
                                </div>
                                {videoEnabled && <div className={styles.iconContainer + ' ' + (videoPaused ? styles.off : styles.on)}>
                                    <Videocam id='videoOff' className={styles.offIcon} onClick={(e) => handleCamClick(e)} />
                                    <Videocam id='videoOn' className={styles.onIcon} onClick={(e) => handleCamClick(e)} />
                                </div>}
                            </div>
                        }
                        </header>
                    }
                    { targetChannelId?.length === 0 && <div />}

                    <div className={styles.controls}>
                        <div className={classNames({
                            [styles['profile-toggle']]: true,
                            [styles.iconContainer]: true
                        })} onClick={() => openProfileMenu()}><Person /></div>
                        <div className={classNames({
                            [styles['invite-toggle']]: true,
                            [styles.iconContainer]: true
                        })} onClick={() => openInvite()}><GroupAdd /></div>
                        { isHarmonyPage !== true && <div className={classNames({
                            [styles['harmony-toggle']]: true,
                            [styles.iconContainer]: true
                        })} onClick={() => closeHarmony()}><ThreeDRotation /></div> }
                    </div>
                </div>
                { activeAVChannelId !== '' && <div className={styles['video-container']}>
                    <div className={ styles['active-chat-plate']} >{ getAVChannelName() }</div>
                    <Grid className={ styles['party-user-container']} container direction="row">
                        <Grid item className={
                            classNames({
                                [styles['grid-item']]: true,
                                [styles.single]: layerUsers.length == null || layerUsers.length <= 1,
                                [styles.two]: layerUsers.length === 2,
                                [styles.four]: layerUsers.length === 3 && layerUsers.length === 4,
                                [styles.six]: layerUsers.length === 5 && layerUsers.length === 6,
                                [styles.nine]: layerUsers.length >= 7 && layerUsers.length <= 9,
                                [styles.many]: layerUsers.length > 9
                            })
                        }>
                            <PartyParticipantWindow
                                harmony={true}
                                peerId={'me_cam'}
                            />
                        </Grid>
                        { layerUsers.filter(user => user.id !== selfUser.id).map((user) => (
                            <Grid item
                                  key={user.id}
                                  className={
                                classNames({
                                    [styles['grid-item']]: true,
                                    [styles.single]: layerUsers.length == null || layerUsers.length <= 1,
                                    [styles.two]: layerUsers.length === 2,
                                    [styles.four]: layerUsers.length === 3 && layerUsers.length === 4,
                                    [styles.six]: layerUsers.length === 5 && layerUsers.length === 6,
                                    [styles.nine]: layerUsers.length >= 7 && layerUsers.length <= 9,
                                    [styles.many]: layerUsers.length > 9
                                })
                            }>
                                <PartyParticipantWindow
                                    harmony={true}
                                    peerId={user.id}
                                    key={user.id}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </div> }
                <div className={styles['list-container']}>
                    { targetChannelId != null && targetChannelId !== '' && <div className={ styles['active-chat-plate']} >{ getChannelName() }</div> }
                    <List ref={(messageRef as any)} onScroll={(e) => onMessageScroll(e)} className={styles['message-container']}>
                        { activeChannel != null && activeChannel.messages && activeChannel.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map((message) => {
                            return <ListItem
                                className={classNames({
                                    [styles.message]: true,
                                    [styles.self]: message.senderId === selfUser.id,
                                    [styles.other]: message.senderId !== selfUser.id
                                })}
                                key={message.id}
                                onMouseEnter={(e) => toggleMessageCrudSelect(e, message)}
                                onMouseLeave={(e) => toggleMessageCrudSelect(e, message)}
                                onTouchEnd={(e) => toggleMessageCrudSelect(e, message)}
                            >
                                <div>
                                    { message.senderId !== selfUser.id &&
                                    <ListItemAvatar>
                                        <Avatar src={message.sender?.avatarUrl}/>
                                    </ListItemAvatar>
                                    }
                                    {messageUpdatePending !== message.id &&
                                    <ListItemText
                                        primary={message.text}
                                        secondary={generateMessageSecondary(message)}
                                    />
                                    }
                                    {message.senderId === selfUser.id && messageUpdatePending !== message.id &&
                                    <div className='message-crud'>
                                        { messageDeletePending !== message.id && messageCrudSelected === message.id &&
                                        <div className={styles['crud-controls']}>
                                            {messageDeletePending !== message.id &&
                                            <Edit className={styles.edit}
                                                  onClick={(e) => loadMessageEdit(e, message)}
                                                  onTouchEnd={(e) => loadMessageEdit(e, message)}
                                            />
                                            }
                                            {messageDeletePending !== message.id &&
                                            <Delete className={styles.delete}
                                                    onClick={(e) => showMessageDeleteConfirm(e, message)}
                                                    onTouchEnd={(e) => showMessageDeleteConfirm(e, message)}
                                            />
                                            }
                                        </div>
                                        }
                                        {messageDeletePending === message.id &&
                                        <div className={styles['crud-controls']}>
                                            {messageDeletePending === message.id &&
                                            <Delete className={styles.delete}
                                                    onClick={(e) => confirmMessageDelete(e, message)}
                                                    onTouchEnd={(e) => confirmMessageDelete(e, message)}
                                            />
                                            }
                                            {messageDeletePending === message.id &&
                                            <Clear className={styles.cancel}
                                                   onClick={(e) => cancelMessageDelete(e)}
                                                   onTouchEnd={(e) => cancelMessageDelete(e)}
                                            />
                                            }
                                        </div>
                                        }
                                    </div>
                                    }
                                    {messageUpdatePending === message.id &&
                                    <div className={styles['message-edit']}>
                                        <TextField
                                            variant="outlined"
                                            margin="normal"
                                            multiline
                                            fullWidth
                                            id="editingMessage"
                                            placeholder="Abc"
                                            name="editingMessage"
                                            autoFocus
                                            value={editingMessage}
                                            inputProps={{
                                                maxLength: 1000
                                            }}
                                            onChange={handleEditingMessageChange}
                                        />
                                        <div className={styles['editing-controls']}>
                                            <Clear className={styles.cancel} onClick={(e) => cancelMessageUpdate(e)} onTouchEnd={(e) => cancelMessageUpdate(e)}/>
                                            <Save className={styles.save} onClick={(e) => confirmMessageUpdate(e, message)} onTouchEnd={(e) => confirmMessageUpdate(e, message)}/>
                                        </div>
                                    </div>
                                    }
                                </div>
                            </ListItem>;
                        })
                        }
                        { targetChannelId.length === 0 && targetObject.id != null &&
                        <div className={styles['first-message-placeholder']}>
                            <div>{targetChannelId}</div>
                            Start a chat with {(targetObjectType === 'user' || targetObjectType === 'group') ? targetObject.name : targetObjectType === 'instance' ? 'your current layer' : 'your current party'}
                        </div>
                        }
                    </List>
                    {targetObject != null && targetObject.id != null &&
                    <div className={styles['flex-center']}>
                        <div className={styles['chat-box']}>
                            <TextField
                                variant="outlined"
                                margin="normal"
                                multiline
                                fullWidth
                                id="newMessage"
                                placeholder="Abc"
                                name="newMessage"
                                autoFocus
                                value={composingMessage}
                                inputProps={{
                                    maxLength: 1000
                                }}
                                onKeyPress={(e) => {
                                    if (e.shiftKey === false && e.charCode === 13) {
                                        e.preventDefault()
                                        packageMessage();
                                    }
                                }}
                                onChange={handleComposingMessageChange}
                            />
                            <Button variant="contained"
                                    color="primary"
                                    className={styles['send-button']}
                                    startIcon={<Send/>}
                                    onClick={packageMessage}
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                    }
                    { (targetObject == null || targetObject.id == null) &&
                    <div className={styles['no-chat']}>
                        <div>
                            Start a chat with a friend or group from the side panel
                        </div>
                    </div>
                    }
                </div>
            </div>
            { profileMenuOpen &&
            <ClickAwayListener onClickAway={() => setProfileMenuOpen(false)}>
                <div className={styles.profileMenu}>
                    <ProfileMenu setProfileMenuOpen={setProfileMenuOpen}/>
                </div>
            </ClickAwayListener>
            }
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Harmony);
