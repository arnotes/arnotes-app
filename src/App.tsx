import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.scss';
import AuthLogin from './components/auth-login.component';
import { authService } from './services/auth.service';
import { AppState } from './redux/reducers';
import { store } from './redux';
import { setUser } from './redux/actions';
import Navbar from './components/navbar.component';

interface AppProps {
  currentUser?: firebase.User;
}

class App extends Component<AppProps, any> {

  constructor(props) {
    super(props);
    store.subscribe(() => console.log('getState', store.getState()));
    authService.onAuthStateChanged(user => {
      console.log(user);
      store.dispatch(setUser(user));
    });
    setTimeout(() => {
      this.appReady = true;
      this.setState({...this.state});
    }, 1000);
  }

  appReady:boolean = false;

  renderAuth() {
    return <AuthLogin />;
  }

  renderAppBody() {
    return <div>hello world</div>
  }

  render() {
    if(!this.appReady){
      return (
        <div>loading...</div>
      );
    }
    return (
      <div id="app-container">
        <Navbar></Navbar>
        {this.props.currentUser ? this.renderAppBody(): this.renderAuth()}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    currentUser: state.user
  }
}

const connectedApp = connect(mapStateToProps)(App);

export default connectedApp;
