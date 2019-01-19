import React, { Component } from 'react';
import { authService } from '../services/auth.service';
import { setUser } from '../redux/actions';
import './auth-login.component.scss';

interface AuthLoginState{
  loginGoogleLoading:boolean
}

export default class AuthLogin extends Component<any, AuthLoginState> {
  constructor(props) {
    super(props);
    this.state = {
      loginGoogleLoading: false
    };
  }

  get googleLoading():boolean {
    return this.state.loginGoogleLoading;
  }
  set googleLoading(val: boolean) {
    this.setState({ ...this.state, loginGoogleLoading: val } as any)
  }

  async loginGoogle(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    this.googleLoading = true;
    await authService.loginGoogle().catch(e => this.googleLoading = false);
    this.googleLoading = false;
  }

  render() {
    return (
      <div className="mt-5">
        <div className="text-center">
          <h4>Sign in to ArNotes</h4>
        </div>
        <div className="auth-login card ml-5 mr-5 mt-4 mx-auto p-5">
          <button disabled={this.googleLoading} onClick={(e) => this.loginGoogle(e)} className="btn btn-signin btn-block btn-danger">
            {!this.googleLoading && 'Login with Google' || 'loading...'}
          </button>
        </div>
      </div>
    )
  }
}
