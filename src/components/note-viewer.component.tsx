import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // Typescript
import { Delta, Sources } from 'quill';
import { INote } from '../models/note.interface';
import { Subject } from 'rxjs';
import { dbService } from '../services/database.service';
import { debounceTime } from 'rxjs/operators';
import './note-viewer.component.scss';

interface NoteViewerProps {
	note?: INote,
	onTitleChange?: (title: string) => any,
	onClickDelete?: (note:INote)=>any
}

export class NoteViewer extends Component<NoteViewerProps> {
	constructor(props) {
		super(props);

		this.sbjNoteBody.pipe(debounceTime(500))
			.subscribe(content => this.saveNoteBody(content));

		this.sbjNoteTitle.pipe(debounceTime(500))
			.subscribe(content => this.saveNoteTitle(content));
	}

	private sbjNoteBody = new Subject<string>();
	private sbjNoteTitle = new Subject<string>();

	async saveNoteBody(content: string) {
		if(!this.props.note){
			return;
		}
		this.props.note.Body = content;
		await dbService.updateItem('notes', this.props.note);
	}

	async saveNoteTitle(title: string) {
		this.props.note.Title = title;
		await dbService.updateItem('notes', this.props.note);
	}

	onQuillChange(content: string, delta: Delta, source: Sources) {
		this.sbjNoteBody.next(content);
	}

	changeTitle(title: string) {
		this.props.note.Title = title;
		this.sbjNoteTitle.next(title);
		this.props.onTitleChange && this.props.onTitleChange(title);
		this.forceUpdate();
	}

	render() {
		return (
			<div className="note-viewer-container">
				<div className="card bg-dark p-3">
					<div className="input-group flex-nowrap">
						<input value={this.props.note ? this.props.note.Title : ''}
							onChange={e => this.changeTitle(e.target.value)}
							disabled={!this.props.note}
							placeholder="Title..."
							type="text"
							className="form-control" />
						<div className="input-group-append">
							<span onClick={e=>this.props.onClickDelete && this.props.onClickDelete(this.props.note)} className={"input-group-text btn-deletenote "+ (this.props.note && "bg-danger" || "disabled")}>
								<i className="fas fa-trash-alt" style={({color: 'white'})} ></i>
							</span>
						</div>							
					</div>
					<br />
					<ReactQuill readOnly={!this.props.note} value={this.props.note ? this.props.note.Body : ''} onChange={this.onQuillChange.bind(this)} />
				</div>
			</div>
		)
	}
}

export default NoteViewer
