import firebase from 'firebase';

class FireBaseService {
	constructor() {
		var config = {
			apiKey: process.env.REACT_APP_APIKEY,
			authDomain: process.env.REACT_APP_AUTHDOMAIN,
			projectId: process.env.REACT_APP_PROJECTID
		};

		firebase.initializeApp(config);
		var db = firebase.firestore();
		db.settings({
			timestampsInSnapshots: true
		});
		this.googleAuthProvider = new firebase.auth.GoogleAuthProvider();
	}

	googleAuthProvider:firebase.auth.GoogleAuthProvider;
}

export const firebaseService = new FireBaseService();