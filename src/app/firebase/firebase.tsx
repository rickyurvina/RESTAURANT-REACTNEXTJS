import { initializeApp } from 'firebase/app'
import firebaseConfig from './config'

class Firebase {
    constructor() {
        initializeApp(firebaseConfig)
    }
}

const firebase = new Firebase();
export default firebase;