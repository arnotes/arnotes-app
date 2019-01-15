import { firebaseService } from "./firebase.service";
import firebase from "firebase";

class FireStoreDatabase{
    constructor(){};

    getCollection<T>(collectionPath:string, qry:(collection:firebase.firestore.Query)=>firebase.firestore.Query = null){
        
        let coll = firebase.firestore().collection(collectionPath) as firebase.firestore.Query;
        if(qry){
            coll = qry(coll);
        }

        return coll.get().then(snapshot => {
            let items:T[] = [];
            snapshot.forEach(doc=>{
                let docData:any = doc.data();
                docData.ID = doc.id;
                items.push(docData);
            });
            (items as any[]).sort((a,b) => a.ID.localeCompare(b.ID));
            return items;
        });
    }

    addToCollection<T>(collectionPath:string, item:T){
        return firebase.firestore()
                .collection(collectionPath)
                .add(item)
                .then(docRef=>{
                    item['ID'] = docRef.id;
                    return item;
                });
    }

    updateItem<T>(collectionPath:string, item:T){
        return firebase.firestore()
                .collection(collectionPath)
                .doc(item['ID'])
                .update(item);
    }

    removeItem<T>(collectionPath:string, item:T){
        return firebase.firestore()
                .collection(collectionPath)
                .doc(item['ID'])
                .delete();
    }
}

export const dbService = new FireStoreDatabase();
