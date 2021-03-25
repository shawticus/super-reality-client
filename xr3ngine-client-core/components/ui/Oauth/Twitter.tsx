import { useRouter, NextRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { loginUserByJwt, refreshConnections } from '../../../redux/auth/service';
import { Container } from '@material-ui/core';
import { selectAuthState } from '../../../redux/auth/selector';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

interface Props {
    auth: any;
    router: NextRouter;
    loginUserByJwt: typeof loginUserByJwt;
    refreshConnections: typeof refreshConnections;
  }
  
  const mapStateToProps = (state: any): any => {
    return {
      auth: selectAuthState(state)
    };
  };
  
  const mapDispatchToProps = (dispatch: Dispatch): any => ({
    loginUserByJwt: bindActionCreators(loginUserByJwt, dispatch),
    refreshConnections: bindActionCreators(refreshConnections, dispatch)
  });


  const TwitterCallbackComponent = (props: Props): any => {
    const { auth, loginUserByJwt, refreshConnections, router } = props;
  
    const initialState = { error: '', token: '' };
    const [state, setState] = useState(initialState);
  
    useEffect(() => {
      const error = router.query.error as string;
      const token = router.query.token as string;
      const type = router.query.type as string;
      const path = router.query.path as string;
      const instanceId = router.query.instanceId as string;
  
      if (!error) {
        if (type === 'connection') {
          const user = auth.get('user');
          refreshConnections(user.id);
        } else {
          let redirectSuccess = `${path}`;
          if (instanceId != null) redirectSuccess += `?instanceId=${instanceId}`;
          loginUserByJwt(token, redirectSuccess || '/', '/');
        }
      }
  
      setState({ ...state, error, token });
    }, []);
  
    return state.error && state.error !== '' ? (
      <Container>
        Twitter authentication failed.
        <br />
        {state.error}
      </Container>
    ) : (
      <Container>Authenticating...</Container>
    );
  };
  
  const TwitterHomeWrapper = (props: any): any => <TwitterCallbackComponent {...props} router={ useRouter() } />;
  
  export const TwitterCallback = connect(mapStateToProps, mapDispatchToProps)(TwitterHomeWrapper);
  