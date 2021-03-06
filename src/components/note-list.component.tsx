import React, { Component } from 'react'
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { firebaseService } from '../services/firebase.service';
import { dbService } from '../services/database.service';
import { INote } from '../models/note.interface';
import { StoreState } from '../redux/reducers';
import { connect } from 'react-redux';
import { store } from '../redux';
import { setActiveNote, setSearchInputFocusState } from '../redux/actions';
import './note-list.component.scss';

interface NoteListProps {
    notes?: INote[],
    activeNoteID?: string,
    onSelectNote?: (note: INote) => any,
    onAddNote?: (note: INote) => any,
    onMount?: (component:any) => any,
    user?: firebase.User
}

interface NoteListState {
    addNoteLoading?: boolean,
    filterText?: string
}

class NoteList extends Component<NoteListProps, NoteListState> {
    constructor(props) {
        super(props);
        
        this.onSearchChange = this.onSearchChange.bind(this);
        this.filterResults = this.filterResults.bind(this);
        this.renderNote = this.renderNote.bind(this);
        this.setSearchInputFocusState = this.setSearchInputFocusState.bind(this);

        this.state = {
            filterText: ""
        };

        this.sbjSearch.pipe(debounceTime(500)).subscribe(val => this.changeFilterText(val));

    }


    private sbjSearch = new Subject<string>();
    private subs: Subscription[] = [];
    private renderedNotesRef = React.createRef();

    changeFilterText(filter:string){
        this.setState({...this.state, filterText:filter});
    }

    filterResults() {
        let txtFilter = this.state.filterText.toLowerCase();
        let filtered = (this.props.notes||[]).filter(note => {
            let titleMatched = note.Title.toLocaleLowerCase().includes(txtFilter);
            let BodyMatched = note.Body.toLocaleLowerCase().includes(txtFilter);
            return !txtFilter || titleMatched || BodyMatched;
        });
        return filtered;
    }



    onSearchChange(ev: React.ChangeEvent<HTMLInputElement>) {
        this.sbjSearch.next(ev.target.value);
    }

    componentWillMount() {
        //this.loadNotes();
        //this.props.onMount && this.props.onMount(this);
    }

    componentWillUnmount() {
        this.subs && this.subs.forEach(sub => sub.unsubscribe());
    }

    onClickNote(note: INote) {
        store.dispatch(setActiveNote(note.ID));
        this.props.onSelectNote && this.props.onSelectNote(note);
    }

    async addNote() {
        let dateAdded = new Date();
        this.setState({ ...this.state, addNoteLoading: true });
        let newNote: INote = {
            Body: '',
            Title: 'New Note - ' + (dateAdded.toLocaleString()),
            UID: this.props.user.uid
        };
        let result = await dbService.addToCollection('notes', newNote);
        this.props.onAddNote && this.props.onAddNote(result);
        let currentNotes = this.props.notes;
        currentNotes.push(result);
        store.dispatch(setActiveNote(result.ID));
        let renderNotesDiv = this.renderedNotesRef.current as HTMLDivElement;
        let activeNote = renderNotesDiv.querySelector('.active');
        activeNote && activeNote.scrollIntoView();
        this.setState({ ...this.state, addNoteLoading: false });
    }

    renderNote(note: INote) {
        return (
            <button key={note.ID}
                type="button"
                onClick={e => this.onClickNote(note)}
                className={"list-group-item-action list-group-item " + (this.props.activeNoteID == note.ID && "active list-group-item-info")}>
                {note.Title || '\u00A0' }
            </button>
        );
    }

    setSearchInputFocusState(isFocused:boolean){
        store.dispatch(setSearchInputFocusState(isFocused));
    }

    render() {
        return (
            <div className="card note-list-container flex-h-take flex-h-box">
                <ul className="list-group flex-h-take flex-h-box">
                    <li className="list-group-item">
                        <div className="input-group flex-nowrap">
                            <input onChange={this.onSearchChange}
                                onFocus={()=>this.setSearchInputFocusState(true)}
                                onBlur={()=>this.setSearchInputFocusState(false)}
                                type="search"
                                className="form-control"
                                placeholder="Search notes..." />
                        </div>
                    </li>
                    <div className="rendered-notes flex-h-take" ref={this.renderedNotesRef as any}>
                        {this.filterResults().sort((a,b)=>a.Title.localeCompare(b.Title)).map(note => this.renderNote(note))}
                    </div>
                    <button type="button" disabled={this.state.addNoteLoading} onClick={this.addNote.bind(this)} className="active list-group-item-success list-group-item list-group-item-action">
                        Add Note <i className="fas fa-plus-square"></i>
                    </button>
                </ul>
            </div>
        )
    }
}


const mapStateToProps = (state: StoreState): NoteListProps => {
    return {
        activeNoteID: state.activeNoteID,
        user: state.user
    }
};

const connectedApp = connect(mapStateToProps)(NoteList) as typeof NoteList;
export default connectedApp;