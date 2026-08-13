import { addDoc, collection, doc, getDocs, query, serverTimestamp, setDoc, Timestamp, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase';
import type { EveningActivity } from '../types';
function b64ToUint8(base64:string){const padding='='.repeat((4-base64.length%4)%4);const s=(base64+padding).replace(/-/g,'+').replace(/_/g,'/');return Uint8Array.from(atob(s),c=>c.charCodeAt(0));}
export const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches || (navigator as Navigator & {standalone?:boolean}).standalone===true;
export async function enablePush(userId:string){if(!isStandalone())throw new Error('INSTALL_REQUIRED');if(!('serviceWorker'in navigator)||!('PushManager'in window)||!('Notification'in window))throw new Error('UNSUPPORTED');const permission=await Notification.requestPermission();if(permission!=='granted')throw new Error('PERMISSION_DENIED');const key=import.meta.env.VITE_WEB_PUSH_PUBLIC_KEY;if(!key)throw new Error('PUSH_NOT_CONFIGURED');const reg=await navigator.serviceWorker.ready;const subscription=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64ToUint8(key)});if(db){const id=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(subscription.endpoint)).then(b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join(''));await setDoc(doc(db,'users',userId,'pushSubscriptions',id),{subscription:subscription.toJSON(),createdAt:serverTimestamp(),userAgent:navigator.userAgent},{merge:true})}return true}
export async function queueTestPush(userId:string){
  if(!db)throw new Error('FIREBASE_REQUIRED');
  await addDoc(collection(db,'users',userId,'notificationJobs'),{title:'✅ Mélissa 18h',body:'Les notifications sont opérationnelles.',kind:'today',scheduledAt:Timestamp.fromMillis(Date.now()+10_000),status:'pending',createdAt:serverTimestamp()})
}

export async function queueEveningPushes(userId:string,activities:EveningActivity[]){
  if(!db)return;
  const jobs=collection(db,'users',userId,'notificationJobs');
  const pending=await getDocs(query(jobs,where('status','==','pending')));
  await Promise.all(pending.docs.map(item=>updateDoc(item.ref,{status:'cancelled'})));
  const today=new Date();
  for(const a of activities){
    const [h,m]=a.start.split(':').map(Number);const at=new Date(today);at.setHours(h,m,0,0);if(at.getTime()<Date.now())continue;
    await addDoc(jobs,{title:a.title,body:`C’est parti pour ${a.duration} min.`,kind:a.kind,scheduledAt:Timestamp.fromDate(at),status:'pending',createdAt:serverTimestamp()})
  }
}

export async function snoozeNotificationJob(userId:string,jobId:string,minutes:number){
  if(!db)return;
  await updateDoc(doc(db,'users',userId,'notificationJobs',jobId),{status:'pending',scheduledAt:Timestamp.fromMillis(Date.now()+minutes*60_000),snoozedAt:serverTimestamp()});
}

export async function dismissNotificationJob(userId:string,jobId:string){
  if(!db)return;
  await updateDoc(doc(db,'users',userId,'notificationJobs',jobId),{status:'dismissed',dismissedAt:serverTimestamp()});
}
