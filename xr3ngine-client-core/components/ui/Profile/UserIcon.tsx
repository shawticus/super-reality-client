import React, { useState } from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import styles from './Profile.module.scss';
import TextField from '@material-ui/core/TextField';
import { uploadAvatar, updateUsername } from '../../../redux/auth/service';
import classNames from 'classnames';

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  uploadAvatar: bindActionCreators(uploadAvatar, dispatch),
  updateUsername: bindActionCreators(updateUsername, dispatch)
});

interface Props {
  avatarUrl: string;
  uploadAvatar?: typeof uploadAvatar;
  updateUsername?: typeof updateUsername;
  auth: any;
}

const UserProfile = (props: Props): any => {
  const { auth } = props;
  const user = auth.get('user');

  const [file, setFile] = useState({});
  const [fileUrl, setFileUrl] = useState('');
  const [username, setUsername] = useState(user.name);
  const handleChange = (e: any): void => {
    const efile = e.target.files[0];
    const formData = new FormData();
    if (efile != null) {
      formData.append('file', efile, efile.type);
      formData.append('name', efile.name);
      formData.append('type', 'user-thumbnail');

      const file = formData;

      setFile(file);
      setFileUrl(efile);
    } else {
      setFile({});
      setFileUrl('');
    }
  };

  const handleSubmit = async (): Promise<void> => {
    await props.uploadAvatar(file);
  };

  const handleUsernameChange = (e: any): void => {
    const name = e.target.value;
    setUsername(name);
  };
  const updateUsername = async (): Promise<void> => {
    await props.updateUsername(user.id, username);
  };
  return (
      <div className={styles['user-container']}>
        <div className={styles.username}>
          <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="username"
              label="Your Name"
              name="name"
              autoFocus
              defaultValue={user.name}
              onChange={(e) => handleUsernameChange(e)}
          />
          <Button variant="contained" color="primary" onClick={updateUsername}>
            Update
          </Button>
        </div>
        <div className={styles['user-id']}>
          <div>User ID: {user.id}</div>
        </div>
        <div className={styles.uploadform}>
          {fileUrl ? (
              <img
                  src={URL.createObjectURL(fileUrl)}
                  className={classNames({
                    [styles.rounded]: true,
                    [styles['mx-auto']]: true,
                    [styles['d-block']]: true,
                    [styles['max-size-200']]: true
                  })}
              />
          ) : props.avatarUrl ? (
              <img src={props.avatarUrl} className={classNames({
                [styles.rounded]: true,
                [styles['mx-auto']]: true,
                [styles['d-block']]: true,
                [styles['max-size-200']]: true
              })} />
          ) : (
              <AccountCircleIcon style={{ fontSize: 150 }} />
          )}
          <input
              id="fileInput"
              accept="image/*"
              name="file"
              placeholder="Upload Product Image"
              type="file"
              className={styles['signup__fileField']}
              onChange={handleChange}
          />

          <label htmlFor="fileInput">
            <Button variant="contained" component="span" color="secondary">
              Select Avatar
            </Button>
          </label>
          <Button disabled={fileUrl.length === 0} variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </div>
      </div>
  );
};

export default connect(null, mapDispatchToProps)(UserProfile);
