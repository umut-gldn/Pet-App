import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'
import firebaseConfig from '../config'

firebase.initializeApp(firebaseConfig)

export const MatchRequestCollection = 'matchRequests'
export const PetsCollection = 'pets'
export const UsersCollection = 'users'

export class Pet {
	constructor(name, ownerId, ownerName, age, breed, gender, info, vaccines) {
		this.name = name
		this.ownerId = ownerId
		this.ownerName = ownerName
		this.age = age
		this.breed = breed
		this.gender = gender
		this.info = info
		this.vaccines = vaccines
		this.lat = 0
		this.long = 0
		this.id = ''
		this.photoURL = ''
	}
}

export class MatchRequest {
	constructor(from, fromPhoto, to, toPhoto, status, id) {
		this.from = {
			ownerId: from,
			photo: fromPhoto
		}
		this.to = {
			ownerId: to,
			photo: toPhoto
		}
		this.status = status
		this.id = id
	}
}

class Request {
	constructor() {
		this.auth = firebase.auth()
		this.firestore = firebase.firestore()
		this.storage = firebase.storage()
	}

	async sendVerificationCode(phoneNumber) {
		try {
			const phoneAuthProvider = new firebase.auth.PhoneAuthProvider()
			const appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')
			const verificationId = await phoneAuthProvider.verifyPhoneNumber(phoneNumber, appVerifier)
			return verificationId
		} catch (error) {
			throw error
		}
	}

	async signUpWithPhone(verificationId, verificationCode, userData) {
		try {
			const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode)
			const userCredential = await this.auth.signInWithCredential(credential)
			const user = userCredential.user
			const userDocRef = this.firestore.collection(UsersCollection).doc(user.uid)
			const userDocSnapshot = await userDocRef.get()
			userData = { uid: user.uid, createdAt: user.metadata.createdAt, creationTime: user.metadata.creationTime, lastLoginAt: user.metadata.lastLoginAt, lastSignInTime: user.metadata.lastSignInTime, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, photoURL: user.photoURL, providerId: user.providerId, ...userData }
			if (userDocSnapshot.exists) {
				await this.setDocument(UsersCollection, user.uid, { ...userDocSnapshot.data(), ...userData })
				return { ...userDocSnapshot.data(), ...userData }
			} else {
				await this.setDocument(UsersCollection, user.uid, userData)
				return userData
			}
		} catch (error) {
			throw error
		}
	}

	async signInWithPhone(verificationId, verificationCode) {
		try {
			const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, verificationCode)
			const userCredential = await this.auth.signInWithCredential(credential)
			const user = userCredential.user
			const userDocRef = this.firestore.collection(UsersCollection).doc(user.uid)
			const userDocSnapshot = await userDocRef.get()
			const userData = { uid: user.uid, createdAt: user.metadata.createdAt, creationTime: user.metadata.creationTime, lastLoginAt: user.metadata.lastLoginAt, lastSignInTime: user.metadata.lastSignInTime, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, photoURL: user.photoURL, providerId: user.providerId }
			if (userDocSnapshot.exists) {
				await this.setDocument(UsersCollection, user.uid, { ...userDocSnapshot.data(), ...userData })
				return { ...userDocSnapshot.data(), ...userData }
			} else {
				await this.setDocument(UsersCollection, user.uid, userData)
				return userData
			}
		} catch (error) {
			throw error
		}
	}

	async checkUserExistsByEmail(email) {
		try {
			const userCredential = await this.auth.fetchSignInMethodsForEmail(email)
			return userCredential.length >= 0
		} catch (error) {
			throw error
		}
	}
	async resetPasswordWithEmail(email) {
		try {
			const userExists = await this.checkIfEmailExists(email)
			if (userExists) {
				await this.auth.sendPasswordResetEmail(email)
			} else {
				return false
			}
		} catch (error) {
			throw error
		}
	}

	async checkIfEmailExists(email) {
		const usersRef = this.firestore.collection('users')

		try {
			const querySnapshot = await usersRef.where('email', '==', email).get()

			if (!querySnapshot.empty) {
				// E-posta adresi veritabanında mevcut
				return true
			} else {
				// E-posta adresi veritabanında mevcut değil
				return false
			}
		} catch (error) {
			console.error('Hata oluştu: ', error)
			return false // Hata durumunda false döndürün
		}
	}
	async signUpWithEmail(email, password, userData) {
		try {
			const userExists = await this.checkUserExistsByEmail(email)
			if (userExists) {
				return false
			} else {
				const userCredential = await this.auth.createUserWithEmailAndPassword(email, password)
				const user = userCredential.user
				const userDocRef = this.firestore.collection(UsersCollection).doc(user.uid)
				const userDocSnapshot = await userDocRef.get()
				userData = { uid: user.uid, createdAt: user.metadata.createdAt, creationTime: user.metadata.creationTime, lastLoginAt: user.metadata.lastLoginAt, lastSignInTime: user.metadata.lastSignInTime, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, photoURL: user.photoURL, providerId: user.providerId, ...userData }
				if (userDocSnapshot.exists) {
					await this.setDocument(UsersCollection, user.uid, { ...userDocSnapshot.data(), ...userData })
					return { ...userDocSnapshot.data(), ...userData }
				} else {
					await this.setDocument(UsersCollection, user.uid, userData)
					return userData
				}
			}
		} catch (error) {
			throw error
		}
	}

	async signInWithEmail(email, password) {
		try {
			const userExists = await this.checkUserExistsByEmail(email)
			if (userExists) {
				const userCredential = await this.auth.signInWithEmailAndPassword(email, password)
				const user = userCredential.user
				const userDocRef = this.firestore.collection(UsersCollection).doc(user.uid)
				const userDocSnapshot = await userDocRef.get()
				const userData = { uid: user.uid, createdAt: user.metadata.createdAt, creationTime: user.metadata.creationTime, lastLoginAt: user.metadata.lastLoginAt, lastSignInTime: user.metadata.lastSignInTime, displayName: user.displayName, email: user.email, phoneNumber: user.phoneNumber, providerId: user.providerId }
				if (userDocSnapshot.exists) {
					await this.setDocument(UsersCollection, user.uid, { ...userDocSnapshot.data(), ...userData })
					return { ...userDocSnapshot.data(), ...userData }
				} else {
					await this.setDocument(UsersCollection, user.uid, userData)
					return userData
				}
			} else {
				return false
			}
		} catch (error) {
			throw error
		}
	}

	async signOut() {
		try {
			await this.auth.signOut()
		} catch (error) {
			throw error
		}
	}

	async addDocument(collection, data) {
		try {
			const docRef = await this.firestore.collection(collection).add(data)
			return { id: docRef.id, ref: docRef }
		} catch (error) {
			throw error
		}
	}

	async getDocuments(collection) {
		try {
			const snapshot = await this.firestore.collection(collection).get()
			return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
		} catch (error) {
			throw error
		}
	}

	async getDocument(collection, documentId) {
		try {
			const docRef = this.firestore.collection(collection).doc(documentId)
			const doc = await docRef.get()
			if (doc.exists) {
				return { id: doc.id, ...doc.data() }
			} else {
				return false
			}
		} catch (error) {
			throw error
		}
	}

	async updateDocument(collection, docId, data) {
		try {
			await this.firestore.collection(collection).doc(docId).update(data)
		} catch (error) {
			throw error
		}
	}

	async setDocument(collection, docId, data) {
		try {
			await this.firestore.collection(collection).doc(docId).set(data)
		} catch (error) {
			throw error
		}
	}

	async deleteDocument(collection, docId) {
		try {
			await this.firestore.collection(collection).doc(docId).delete()
		} catch (error) {
			throw error
		}
	}

	async uploadFile(storagePath, file) {
		try {
			let storageRef = this.storage.ref(storagePath)
			storageRef = storageRef.child(file.name)
			const snapshot = await storageRef.put(file)
			const downloadURL = await snapshot.ref.getDownloadURL()
			return downloadURL
		} catch (error) {
			throw error
		}
	}

	async deleteFile(storagePath) {
		try {
			const storageRef = this.storage.ref(storagePath)
			await storageRef.delete()
		} catch (error) {
			throw error
		}
	}

	async getPets(userId) {
		try {
			const petsRef = this.firestore.collection(PetsCollection)
			const snapshot = await petsRef.where('ownerId', '==', userId).get()
			return snapshot.docs.map(pet => {
				return {
					id: pet.id,
					...pet.data()
				}
			})
		} catch (error) {
			throw error
		}
	}

	async filter(collection, field, excepted) {
		const pets = this.firestore.collection(collection)
		return (await pets.where(field, '==', excepted).get()).docs.map(pet => pet.data())
	}
	async getSentMatchRequests(userId, status) {
		try {
			const requestsRef = this.firestore.collection(MatchRequestCollection)
			const snapshot = await requestsRef.where('from.ownerId', '==', userId).where('status', '==', status).get()
			return snapshot.docs.map(request => {
				return {
					id: request.id,
					...request.data()
				}
			})
		} catch (error) {
			throw error
		}
	}
	async getReceivedMatchRequests(userId, status) {
		try {
			const requestsRef = this.firestore.collection(MatchRequestCollection)
			const snapshot = await requestsRef.where('to.ownerId', '==', userId).where('status', '==', status).get()
			return snapshot.docs.map(request => {
				return {
					id: request.id,
					...request.data()
				}
			})
		} catch (error) {
			throw error
		}
	}
}

export default Request
