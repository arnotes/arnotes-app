import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // Typescript
import { Delta, Sources } from 'quill';
import { INote } from '../models/note.interface';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import './note-viewer.component.scss';

interface NoteViewerProps {
	showProgress?:boolean,
	note?: INote,
	onTitleChange?: (title: string) => any,
	onTitleInput?: (title: string) => any,
	onBodyChange?: (body: string) => any,
	onBodyInput?: (body: string) => any,
	onClickDelete?: (note: INote) => any
}

interface NoteViewerState {
	txtTitle?: string;
	txtBody?: string;
}

export class NoteViewer extends Component<NoteViewerProps, NoteViewerState> {
	constructor(props) {
		super(props);

		this.sbjNoteTitle.pipe(debounceTime(500)).subscribe(content => {
			this.props.onTitleChange && this.props.onTitleChange(content)
		});

		this.sbjNoteBody.pipe(debounceTime(500)).subscribe(content => {
			this.props.onBodyChange && this.props.onBodyChange(content)
		});

		this.state = {
			txtTitle: this.props.note ? this.props.note.Title : '',
			txtBody: this.props.note ? this.props.note.Body : ''
		};
	}

	componentWillReceiveProps(nextProps: NoteViewerProps) {
		this.setState({
			...this.state,
			txtTitle: nextProps.note ? nextProps.note.Title : '',
			txtBody: nextProps.note ? nextProps.note.Body : ''
		});
	}

	private sbjNoteBody = new Subject<string>();
	private sbjNoteTitle = new Subject<string>();

	changeTitle(title: string) {
		let note = this.props.note;
		note.Title = title;
		this.setState({
			...this.state,
			txtTitle: title
		});
		this.props.onTitleInput && this.props.onTitleInput(title);
		this.sbjNoteTitle.next(title);
	}

	onQuillChange(content: string, delta: Delta, source: Sources) {
		if(source!=="user"){
			return;
		}
		let note = this.props.note;
		note.Body = content;
		this.setState({
			...this.state,
			txtBody: content
		});
		this.props.onBodyInput && this.props.onBodyInput(content);
		this.sbjNoteBody.next(content);
	}

	render() {
		return (
			<div className="note-viewer-container flex-h-take flex-h-box">
				<div className="card p-3 flex-h-take flex-h-box">
					<div className={"progress save-progress "+(this.props.showProgress  && " show-progress")}>
						<div className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
							role="progressbar"  
							style={({width: '100%'})} >
						</div>
					</div>				
					<div className="input-group flex-nowrap">
						<input value={this.state.txtTitle}
							onChange={e => this.changeTitle(e.target.value)}
							disabled={!this.props.note}
							placeholder="Title..."
							type="text"
							className="form-control" />
						<div className="input-group-append">
							<button onClick={e => this.props.note && this.props.onClickDelete && this.props.onClickDelete(this.props.note)}
									type="button" 
									className="btn btn-danger" 
									disabled={!this.props.note}>
								<i className="fas fa-trash-alt"></i>
							</button>
						</div>
					</div>
					<br/>
					<div className="react-quill-wrapper flex-h-take flex-h-box">
						<ReactQuill readOnly={!this.props.note} 
							value={this.state.txtBody} 
							onChange={this.onQuillChange.bind(this)} />
					</div>
				</div>
			</div>
		)
	}
}

export default NoteViewer
