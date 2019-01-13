import React, { Component } from 'react'
import { authService } from '../services/auth.service';
import { store } from '../redux';
import { setUser } from '../redux/actions';

export class Navbar extends Component {
    async logout(){
        await authService.logout();
        store.dispatch(setUser(null));
    }
    render() {
        return (
            <nav className="navbar navbar-dark bg-primary">
                <h3 className="text-white" onClick={this.logout} >foo</h3>
            </nav>
        )
    }
}

export default Navbar
