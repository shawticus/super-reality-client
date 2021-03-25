import { combineReducers } from 'redux-immutable';
import adminReducer from './admin/reducers';
import appReducer from './app/reducers';
import authReducer from './auth/reducers';
import chatReducer from './chat/reducers';
import videoReducer from './video/reducers';
import sceneReducer from './scenes/reducers';
import alertReducer from './alert/reducers';
import dialogReducer from './dialog/reducers';
import deviceDetectReducer from './devicedetect/reducers';
import channelConnectionReducer from './channelConnection/reducers';
import instanceConnectionReducer from './instanceConnection/reducers';

import friendReducer from './friend/reducers';
import groupReducer from './group/reducers';
import partyReducer from './party/reducers';
import inviteReducer from './invite/reducers';
import userReducer from './user/reducers';
import locationReducer from './location/reducers';
import feedReducer from './feed/reducers';
import feedFiresReducer from './feedFires/reducers';
import feedCommentsReducer from './feedComment/reducers';
import mediastreamReducer from './mediastream/reducers';
import transportReducer from './transport/reducers';
import creatorReducer from './creator/reducers';

export default combineReducers({
  admin: adminReducer,
  app: appReducer,
  auth: authReducer,
  chat: chatReducer,
  friends: friendReducer,
  groups: groupReducer,
  party: partyReducer,
  channelConnection: channelConnectionReducer,
  instanceConnection: instanceConnectionReducer,
  invite: inviteReducer,
  locations: locationReducer,
  videos: videoReducer,
  scenes: sceneReducer,
  alert: alertReducer,
  dialog: dialogReducer,
  devicedetect: deviceDetectReducer,
  user: userReducer,
  creators: creatorReducer,
  feeds: feedReducer,
  feedFires: feedFiresReducer,
  feedComments: feedCommentsReducer,
  mediastream: mediastreamReducer,
  transport: transportReducer
});
