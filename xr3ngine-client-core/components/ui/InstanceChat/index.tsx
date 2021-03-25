import React, { useState, useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import styles from './InstanceChat.module.scss';
import {
    Avatar,
    Badge,
    Button,
    Card,
    CardContent,
    Fab,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField
} from '@material-ui/core';
import {
    getInstanceChannel,
    createMessage,
    updateChatTarget,
    updateMessageScrollInit
} from '../../../redux/chat/service';
import { selectAuthState } from '../../../redux/auth/selector';
import { selectChatState } from '../../../redux/chat/selector';
import { selectInstanceConnectionState } from '../../../redux/instanceConnection/selector';
import {
    Message as MessageIcon,
    Send
} from '@material-ui/icons';
import moment from 'moment';
import { User } from "xr3ngine-common/interfaces/User";
import { Message } from 'xr3ngine-common/interfaces/Message';
import _ from 'lodash';
import classNames from 'classnames';
import { isMobileOrTablet } from 'xr3ngine-engine/src/common/functions/isMobile';


const mapStateToProps = (state: any): any => {
    return {
        authState: selectAuthState(state),
        chatState: selectChatState(state),
        instanceConnectionState: selectInstanceConnectionState(state),
    };
};

const mapDispatchToProps = (dispatch: Dispatch): any => ({
    getInstanceChannel: bindActionCreators(getInstanceChannel, dispatch),
    createMessage: bindActionCreators(createMessage, dispatch),
    updateChatTarget: bindActionCreators(updateChatTarget, dispatch),
    updateMessageScrollInit: bindActionCreators(updateMessageScrollInit, dispatch)
});

interface Props {
    authState?: any;
    setBottomDrawerOpen: any;
    chatState?: any;
    instanceConnectionState?: any;
    getInstanceChannel?: any;
    createMessage?: any;
    updateChatTarget?: any;
    updateMessageScrollInit?: any;
}

const InstanceChat = (props: Props): any => {
    const {
        authState,
        chatState,
        instanceConnectionState,
        getInstanceChannel,
        createMessage,
        setBottomDrawerOpen,
        updateChatTarget,
        updateMessageScrollInit
    } = props;

    let activeChannel;
    const messageRef = React.useRef<HTMLInputElement>();
    const user = authState.get('user') as User;
    const channelState = chatState.get('channels');
    const channels = channelState.get('channels');
    const [composingMessage, setComposingMessage] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(false);
    const activeChannelMatch = [...channels].find(([, channel]) => channel.channelType === 'instance');
    if (activeChannelMatch && activeChannelMatch.length > 0) {
        activeChannel = activeChannelMatch[1];
    }

    useEffect(() => {
        if (instanceConnectionState.get('connected') === true && channelState.get('fetchingInstanceChannel') !== true) {
            getInstanceChannel();
        }
    }, [instanceConnectionState]);

    const openBottomDrawer = (e: any): void => {
        setBottomDrawerOpen(true);
    };

    const handleComposingMessageChange = (event: any): void => {
        const message = event.target.value;
        setComposingMessage(message);
    };

    const packageMessage = (): void => {
        if (composingMessage.length > 0) {
            createMessage({
                targetObjectId: user.instanceId,
                targetObjectType: 'instance',
                text: composingMessage
            });
            setComposingMessage('');
        }
    };

    const setActiveChat = (channel): void => {
        updateMessageScrollInit(true);
        const channelType = channel.channelType;
        const target = channelType === 'user' ? (channel.user1?.id === user.id ? channel.user2 : channel.user2?.id === user.id ? channel.user1 : {}) : channelType === 'group' ? channel.group : channelType === 'instance' ? channel.instance : channel.party;
        updateChatTarget(channelType, target, channel.id);
        setComposingMessage('');
    };

    const [openMessageContainer, setOpenMessageContainer] = React.useState(false);
    const [isMultiline, setIsMultiline] = React.useState(false);
    const [cursorPosition, setCursorPosition] = React.useState(0);
    const hideShowMessagesContainer = () => {
        setOpenMessageContainer(!openMessageContainer);
        openMessageContainer && setUnreadMessages(false);
    };

    const getMessageUser = (message): string => {
        let returned = message.sender?.name;
        if (message.senderId === user.id) returned += ' (you)';
        returned += ': ';
        return returned;
    };

    useEffect(() => {
        activeChannel && activeChannel.messages && activeChannel.messages.length > 0 && !openMessageContainer && setUnreadMessages(true);
    }, [activeChannel?.messages]);

    useEffect(() => {
        if(isMultiline){
            (messageRef.current as HTMLInputElement).selectionStart = cursorPosition+1;
        }
    }, [isMultiline]);

    return (
        <>
            <div className={styles['instance-chat-container'] + ' ' + (!openMessageContainer && styles['messageContainerClosed'])}>
                <div className={styles['list-container']}>
                    <Card square={true} elevation={0} className={styles['message-wrapper']}>
                        <CardContent className={styles['message-container']}>
                            {activeChannel != null && activeChannel.messages &&
                                activeChannel.messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).slice(activeChannel.messages.length >= 3 ? activeChannel.messages?.length - 3 : 0, activeChannel.mesages?.length).map((message) => {
                                    return <ListItem
                                        className={classNames({
                                            [styles.message]: true,
                                            [styles.self]: message.senderId === user.id,
                                            [styles.other]: message.senderId !== user.id
                                        })}
                                        disableGutters={true}
                                        key={message.id}
                                    >
                                        <div>
                                            {!isMobileOrTablet() && <ListItemAvatar>
                                                <Avatar src={message.sender?.avatarUrl} />
                                            </ListItemAvatar>}
                                            <ListItemText
                                                primary={<p><span className={styles.userName} color="primary">{getMessageUser(message)}</span>{message.text}</p>}
                                            />
                                        </div>
                                    </ListItem>;
                                })
                            }
                        </CardContent>
                    </Card>
                    <Card className={styles['flex-center']}>
                        <CardContent className={styles['chat-box']}>
                            <div className={styles.iconContainer} >
                                <MessageIcon onClick={() => hideShowMessagesContainer()} />
                            </div>
                            <TextField
                                className={styles.messageFieldContainer}
                                margin="normal"
                                multiline={isMultiline}
                                fullWidth
                                id="newMessage"
                                label="World Chat..."
                                name="newMessage"
                                autoFocus
                                value={composingMessage}
                                inputProps={{
                                    maxLength: 1000,
                                    'aria-label': 'naked'
                                }}
                                InputLabelProps={{shrink: false,}}
                                onChange={handleComposingMessageChange}
                                inputRef={messageRef}
                                onClick={() => (messageRef as any)?.current?.focus()}
                                onKeyDown={(e) => {            
                                    if (e.key === 'Enter' && e.ctrlKey){
                                        e.preventDefault();                                                                              
                                        const selectionStart  = (e.target as HTMLInputElement).selectionStart;
                                        setCursorPosition(selectionStart);                                        
                                        setComposingMessage(composingMessage.substring(0, selectionStart) + '\n' + composingMessage.substring(selectionStart));      
                                        !isMultiline && setIsMultiline(true);                                         
                                    }else if(e.key === 'Enter' && !e.ctrlKey) {
                                        e.preventDefault();
                                        packageMessage(); 
                                        isMultiline && setIsMultiline(false);
                                        setCursorPosition(0);
                                    }
                                  }}
                            />
                            <Button variant="contained" color="primary" className={classNames({ [styles.iconContainerSend]: true, 'sendMessage': true })} onClick={packageMessage}  ><Send /></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            {!openMessageContainer && (<div className={styles.iconCallChat} >
                <Badge color="primary" variant="dot" invisible={!unreadMessages} anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
                    <Fab className="openChat" color="primary" onClick={() => hideShowMessagesContainer()}>
                        <MessageIcon />Chat
            </Fab>
                </Badge>
            </div>)}
        </>);
};

export default connect(mapStateToProps, mapDispatchToProps)(InstanceChat);