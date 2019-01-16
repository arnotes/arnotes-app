import React, { Component } from 'react';
import { connect } from 'react-redux';
import logo from './logo.svg';
import './App.scss';
import 'react-quill/dist/quill.snow.css'; // ES6
import AuthLogin from './components/auth-login.component';
import { authService } from './services/auth.service';
import { StoreState } from './redux/reducers';
import { store } from './redux';
import { setUser, setActiveNote } from './redux/actions';
import Navbar from './components/navbar.component';
import NoteList from './components/note-list.component';
import { INote } from './models/note.interface';
import { NoteViewer } from './components/note-viewer.component';
import { dbService } from './services/database.service';

interface AppProps {
  user?: firebase.User;
}

interface AppState {
  appReady: boolean,
  selectedNote?: INote,
  notes?: INote[]
}

class App extends Component<AppProps, AppState> {

  constructor(props) {
    super(props);
    store.subscribe(() => console.log('getState', store.getState()));
    this.initAppAndAuth();
    this.state = {
      appReady: false,
      notes: []
    };
  }

  async initAppAndAuth() {
    await authService.getRedirectResult();
    let user = await authService.getAuthState();

    store.dispatch(setUser(user));
    if(user){
      await this.loadNotes();
    }
    this.setState({ ...this.state, appReady: true });
  }

  selectNote(note: INote) {
    this.setState({...this.state, selectedNote: note});
  }

  handleNewNote(note:INote){
    this.setState({...this.state, selectedNote: note});
  }

  async handleDeleteNote(note:INote){
    let notesWithRemovedDeleted = this.state.notes.filter(noteItem=>noteItem.ID!=note.ID);
    store.dispatch(setActiveNote(null));
    this.setState({...this.state, selectedNote: null, notes: notesWithRemovedDeleted});
    dbService.removeItem('notes', note);
  }
 
  async loadNotes(){
    dbService.getCollection<INote>('notes', qry=>qry.where('UID','==',this.props.user.uid)).then(notes => {
      this.setState({ ...this.state, notes: notes });
    });
  }

  renderAuth() {
    return <AuthLogin />;
  }

  renderAppBody() {
    return (
      <div className="container-fluid">
        <br/>
        <div className="row">
          <div className="col-xs-6 col-sm-5 col-md-4 col-lg-3">
            <NoteList notes={this.state.notes} onAddNote={this.handleNewNote.bind(this)} onSelectNote={this.selectNote.bind(this)} ></NoteList>
          </div>
          <div className="col-xs-6 col-sm-7 col-md-8 col-lg-9">
            <NoteViewer onClickDelete={e=>this.handleDeleteNote(e)} note={this.state.selectedNote} onTitleChange={e=>this.forceUpdate()} />
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (!this.state.appReady) {
      return (
        <div>loading...</div>
      );
    }
    return (
      <div id="app-container">
        <Navbar></Navbar>
        {this.props.user ? this.renderAppBody() : this.renderAuth()}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState): AppProps => {
  return {
    user: state.user
  }
}

const connectedApp = connect(mapStateToProps)(App);

export default connectedApp;
