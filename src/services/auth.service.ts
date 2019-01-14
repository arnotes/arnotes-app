import { firebaseService } from "./firebase.service";
import firebase from "firebase";

class AuthService{

    logout(){
        return firebase.auth().signOut();
    }

    loginGoogle(){
        return firebase.auth().signInWithRedirect(firebaseService.googleAuthProvider);
    }

    getAuthState(){
        return new Promise<firebase.User>((resolve)=>{
            let unsubscribe = firebase.auth()
                    .onAuthStateChanged(user=>{
                        resolve(user);
                        unsubscribe();
                    });
        });
    }

    getUser(){
        return firebase.auth().currentUser;
    }

    getRedirectResult(){
        return firebase.auth().getRedirectResult();
    }
}

export const authService = new AuthService();