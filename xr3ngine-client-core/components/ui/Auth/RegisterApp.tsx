import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
// import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { registerUserByEmail } from '../../../redux/auth/service';
import styles from './Auth.module.scss';
// import { showDialog } from '../../../redux/dialog/service';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import { Visibility, VisibilityOff } from '@material-ui/icons';

const mapDispatchToProps = (dispatch: Dispatch): any => {
  return ({
    registerUserByEmail: bindActionCreators(registerUserByEmail, dispatch),
  })
};

interface Props {
  registerUserByEmail: typeof registerUserByEmail;
}

const SignUp = (props: Props): any => {
  const { registerUserByEmail } = props;

  const initialState = {
    email: '',
    password: '',
  };
  const [state, setState] = useState(initialState);

  const handleInput = (e: any): void => {
    e.preventDefault();
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: any): void => {
    e.preventDefault();
    console.log('handleRegister', {
      email: state.email,
      password: state.password
    })
    registerUserByEmail({
      email: state.email,
      password: state.password
    });
  };

  const [values, setValues] = useState({showPassword:false, showPasswordConfirm: false});
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleClickShowPasswordConfirm = () => {
    setValues({ ...values, showPasswordConfirm: !values.showPasswordConfirm });
  };

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };
  const password = useRef<HTMLInputElement>();
  const confirm_password = useRef<HTMLInputElement>();
  function validatePassword(){
    if(password.current.value != confirm_password.current.value) {
      confirm_password.current.setCustomValidity("Passwords Don't Match");
    } else {
      confirm_password.current.setCustomValidity('');
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={styles.paper}>
        <form className={styles.form} onSubmit={(e) => handleRegister(e)}>
          <Grid container>
            <Grid item xs={12}>
              <OutlinedInput
                margin="dense"
                required
                fullWidth
                id="email"
                placeholder="Email"
                name="email"
                autoComplete="email"
                onChange={(e) => handleInput(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <OutlinedInput
                margin="dense"
                required
                fullWidth
                name="password"
                placeholder="Password"
                type={values.showPassword ? 'text' : 'password'}
                id="password"
                inputRef={password}
                autoComplete="current-password"
                onChange={(e) => handleInput(e)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      color="secondary"
                    >
                      {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <OutlinedInput
                margin="dense"
                required
                fullWidth
                name="confirm_password"
                placeholder="Password Confirm"
                type={values.showPasswordConfirm ? 'text' : 'password'}
                id="confirm_password"
                inputRef={confirm_password}
                autoComplete="current-password"
                onChange={(e) => handleInput(e)}
                onKeyUp={validatePassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordConfirm}
                      onMouseDown={handleMouseDownPassword}
                      color="secondary"
                    >
                      {values.showPasswordConfirm ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={styles.submit}
              >
                Sign up
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

const SignUpWrapper = (props: any): any => <SignUp {...props} />;

export default connect(null, mapDispatchToProps)(SignUpWrapper);
