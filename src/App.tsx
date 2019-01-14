import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.scss';
import AuthLogin from './components/auth-login.component';
import { authService } from './services/auth.service';
import { StoreState } from './redux/reducers';
import { store } from './redux';
import { setUser } from './redux/actions';
import Navbar from './components/navbar.component';

interface AppProps {
  user?: firebase.User;
}

interface AppState{
  appReady: boolean
}

class App extends Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    store.subscribe(() => console.log('getState', store.getState()));
    this.initAppAndAuth();
    this.state = {
      appReady : false
    };
  }


  async initAppAndAuth(){
    await authService.getRedirectResult();
    let user = await authService.getAuthState();

    store.dispatch(setUser(user));
    this.setState({...this.state, appReady: true});
  }

  renderAuth() {
    return <AuthLogin />;
  }

  renderAppBody() {
    return <div>hello world</div>
  }

  render() {
    if(!this.state.appReady){
      return (
        <div>loading...</div>
      );
    }
    return (
      <div id="app-container">
        <Navbar></Navbar>
        {this.props.user ? this.renderAppBody(): this.renderAuth()}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState):AppProps => {
  return {
    user: state.user
  }
}

const connectedApp = connect(mapStateToProps)(App);

export default connectedApp;
