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
  searchInputFocused?: boolean;
}

interface AppState {
  appReady: boolean,
  selectedNote?: INote,
  saving?: boolean,
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

    document.addEventListener("keydown", (e) => {
      if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        this.saveNote();
      }
    }, false);
  }

  async initAppAndAuth() {
    await authService.getRedirectResult();
    let user = await authService.getAuthState();

    store.dispatch(setUser(user));
    if (user) {
      await this.loadNotes();
    }
    this.setState({ ...this.state, appReady: true });
  }

  async saveNoteBody(body: string) {
    let note = this.state.selectedNote;
    note.Body = body;

    this.setState({
      ...this.state,
      selectedNote: note
    });
    await this.saveNote();
  }

  async saveNoteTitle(title: string) {
    let note = this.state.selectedNote;
    note.Title = title;

    this.setState({
      ...this.state,
      selectedNote: note
    });
    await this.saveNote();
  }

  async saveNote(){
    if(!this.state.selectedNote){
      return;
    }
    
    this.setState({
      ...this.state,
      saving: true
    });
    await dbService.updateItem('notes', this.state.selectedNote);
    this.setState({
      ...this.state,
      saving: false
    });    
  }

  selectNote(note: INote) {
    this.setState({ ...this.state, selectedNote: note });
  }

  handleNewNote(note: INote) {
    this.setState({ ...this.state, selectedNote: note });
  }

  async handleDeleteNote(note: INote) {
    let notesWithRemovedDeleted = this.state.notes.filter(noteItem => noteItem.ID != note.ID);
    store.dispatch(setActiveNote(null));
    this.setState({ ...this.state, selectedNote: null, notes: notesWithRemovedDeleted });
    dbService.removeItem('notes', note);
  }

  async loadNotes() {
    dbService.getCollection<INote>('notes', qry => qry.where('UID', '==', this.props.user.uid)).then(notes => {
      this.setState({ ...this.state, notes: notes });
    });
  }

  renderAuth() {
    return <AuthLogin />;
  }

  renderAppBody() {
    return (
      <div className="container-fluid flex-h-take flex-h-box pt-4 pb-4">
        <div className={"row flex-h-take "+(this.props.searchInputFocused && "search-input-focused" || "")}>
          <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 flex-h-box">
            <NoteList notes={this.state.notes} onAddNote={this.handleNewNote.bind(this)} onSelectNote={this.selectNote.bind(this)} ></NoteList>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-8 col-lg-9 flex-h-box">
            <NoteViewer onClickDelete={e => this.handleDeleteNote(e)}
              onTitleChange={e => this.state.selectedNote && this.saveNoteTitle(e)}
              onBodyChange={e => this.state.selectedNote && this.saveNoteBody(e)}
              showProgress={this.state.saving}
              note={this.state.selectedNote} />
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
      <div id="app-container" className="flex-h-box">
        <Navbar/>
        {this.props.user ? this.renderAppBody() : this.renderAuth()}
      </div>
    );
  }
}

const mapStateToProps = (state: StoreState): AppProps => {
  return {
    user: state.user,
    searchInputFocused: state.searchInputFocused
  }
}

const connectedApp = connect(mapStateToProps)(App);

export default connectedApp;
