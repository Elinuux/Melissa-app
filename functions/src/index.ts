import { onSchedule } from 'firebase-functions/v2/scheduler';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import webpush from 'web-push';
initializeApp();
const vapidPublic=defineSecret('WEB_PUSH_PUBLIC_KEY'); const vapidPrivate=defineSecret('WEB_PUSH_PRIVATE_KEY');
export const sendDueNotifications=onSchedule({schedule:'every 1 minutes',timeZone:'Europe/Paris',secrets:[vapidPublic,vapidPrivate]},async()=>{
  webpush.setVapidDetails('mailto:owner@example.invalid',vapidPublic.value(),vapidPrivate.value());
  const db=getFirestore();const now=Timestamp.now();const due=await db.collectionGroup('notificationJobs').where('status','==','pending').where('scheduledAt','<=',now).limit(20).get();
  for(const job of due.docs){const uid=job.ref.parent.parent?.id;if(!uid)continue;const d=job.data();const subs=await db.collection('users').doc(uid).collection('pushSubscriptions').get();const navigate=`/?activity=${encodeURIComponent(d.kind||'today')}&notification=1&job=${encodeURIComponent(job.id)}`;const payload=JSON.stringify({web_push:8030,notification:{title:d.title||'Mélissa 18h',body:d.body||'',navigate,silent:false,app_badge:'1'}});
    await Promise.allSettled(subs.docs.map(s=>webpush.sendNotification(s.data().subscription,payload)));
    await job.ref.update({status:'sent',sentAt:Timestamp.now()});
  }
});
