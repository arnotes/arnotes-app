import React, { Component } from 'react'
import { authService } from '../services/auth.service';
import { store } from '../redux';
import { setUser } from '../redux/actions';
import { StoreState } from '../redux/reducers';
import { connect } from 'react-redux';
import './navbar.component.scss';

interface NavbarProps{
    user?:firebase.User;
}

class Navbar extends Component<NavbarProps> {
    constructor(props){
        super(props);
    }

    async logout(){
        await authService.logout();
        store.dispatch(setUser(null));
    }

    render() {
        return (
            <nav className="navbar navbar-dark bg-primary">
                { 
                    this.props.user &&
                    <h5 className="text-white user-banner" onClick={this.logout} >
                        {this.props.user.email} <i className="fas fa-sign-out-alt"></i>
                    </h5> ||
                    <h5 className="text-white">{'\u00A0'}</h5>
                }
            </nav>
        )
    }
}

const mapStateToProps = (state:StoreState):NavbarProps =>{
    return{
        user: state.user
    }
}

const connectedApp = connect(mapStateToProps)(Navbar) as typeof Navbar;

export default connectedApp;
