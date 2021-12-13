
import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar, Button, CssBaseline, Checkbox, Container,
  FormControlLabel, Grid, Link, TextField, Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';

import { 
  signInAsync,
  selectAccessToken
} from "../../slices/authSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignIn() {
  const history = useHistory();
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const accessToken = useSelector(selectAccessToken);
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    if (accessToken) {
      history.replace("/");
    }
  }, [accessToken])
  
  const handleUsernameChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUsername(event.currentTarget.value);
  };
  const handlePasswordChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(event.currentTarget.value);
  };
  const signIn = () => {
    if (username && password) {
        dispatch(signInAsync({
          username,
          password
        }));
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="User Name or Email Address"
            name="email"
            autoComplete="email"
            value={username || ''}
            onChange={handleUsernameChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password || ''}
            onChange={handlePasswordChange}
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={signIn}
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}