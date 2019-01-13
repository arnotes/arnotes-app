import { firebaseService } from "./firebase.service";
import firebase from "firebase";

class AuthService{

    logout(){
        return firebase.auth().signOut();
    }

    loginGoogle(){
        return firebase.auth().signInWithRedirect(firebaseService.googleAuthProvider);
    }

    onAuthStateChanged(fnUserChange:(user:firebase.User)=>any){
        return firebase.auth().onAuthStateChanged(fnUserChange);
    }

    getUser(){
        return firebase.auth().currentUser;
    }
}

export const authService = new AuthService();