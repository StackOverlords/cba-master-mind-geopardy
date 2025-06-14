import {
    createUserWithEmailAndPassword,
    deleteUser,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    updateEmail,
    // onAuthStateChanged,
    updateProfile,
    type User as FirebaseUser
} from "firebase/auth";
import type { LoginCredentials, RegisterCredentials, UserData } from "../../shared/auth.types";
import { auth, googleProvider } from "./firebase";
import { createUserApi, deleteUserApi, updateUserApi, validSessionApi } from "../../api/authApi";
import type { CreateUserDTO } from "../../shared/types";

export const createUserData = async (firebaseUser: FirebaseUser): Promise<UserData> => {
    const userDTO: CreateUserDTO = {
        firebaseUid: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email
    }

    const accessToken = await firebaseUser.getIdToken();
    const newUserApi = await createUserApi(userDTO, accessToken);
    const newUserData: UserData = {
        _id: newUserApi._id,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: newUserApi.role,
        photoURL: firebaseUser.photoURL,
        accessToken: accessToken,
        completedRegister: newUserApi.completedRegister
    };
    return newUserData;
};

export const getUserData = async (firebaseUser: FirebaseUser): Promise<UserData> => {
    const accessToken = await firebaseUser.getIdToken();
    const userDataApi = await validSessionApi(accessToken);
    const newUserData: UserData = {
        _id: userDataApi._id,
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        role: userDataApi.role,
        photoURL: firebaseUser.photoURL,
        accessToken: accessToken,
        completedRegister: userDataApi.completedRegister
    };
    return newUserData;
}

export const login = async ({ email, password }: LoginCredentials): Promise<UserData> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return await getUserData(result.user);
};

export const signInWithGoogle = async (): Promise<UserData> => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    return await createUserData(user);
};

export const register = async ({ email, password, name }: RegisterCredentials): Promise<UserData> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    return await createUserData(result.user);
};

export const logout = async () => {
    await signOut(auth);
};

export const updateUser = async (updates: CreateUserDTO, user: FirebaseUser) => {
    if (updates.name) await updateProfile(user, { displayName: updates.name });
    if (updates.email) await updateEmail(user, updates.email);
    await updateUserApi(user.uid, updates);
    return await getUserData(user);
};

export const removeUser = async (user: FirebaseUser) => {
    await deleteUserApi(user.uid)
    await deleteUser(user); // Firebase
};
// export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
//     return onAuthStateChanged(auth, callback);
// };
