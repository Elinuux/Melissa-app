import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth, firebaseConfigured } from './firebase';
type Session={user:User|null;ready:boolean;demo:boolean;login:(email:string,password:string)=>Promise<void>;logout:()=>Promise<void>};
const C=createContext<Session|null>(null);
export function SessionProvider({children}:{children:ReactNode}){const [user,setUser]=useState<User|null>(null),[ready,setReady]=useState(!firebaseConfigured);useEffect(()=>{if(!auth)return;return onAuthStateChanged(auth,u=>{setUser(u);setReady(true)})},[]);const login=async(email:string,password:string)=>{if(!auth) return;await signInWithEmailAndPassword(auth,email,password)};const logout=async()=>{if(auth)await signOut(auth)};return <C.Provider value={{user,ready,demo:!firebaseConfigured,login,logout}}>{children}</C.Provider>}
export function useSession(){const v=useContext(C);if(!v)throw new Error('SessionProvider missing');return v}
