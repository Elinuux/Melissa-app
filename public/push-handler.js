self.addEventListener('push', event => {
  if (!event.data) return;
  const data = event.data.json();
  const n = data.notification || (data.web_push && data.web_push.notification) || {};
  event.waitUntil(self.registration.showNotification(n.title || 'Mélissa 18h', {body:n.body || '', data:{navigate:n.navigate || data.navigate || '/'}, badge:'/icon-192.svg', icon:'/icon-192.svg'}));
});
self.addEventListener('notificationclick', event => {
  event.notification.close(); const target=event.notification.data?.navigate || '/';
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{for(const c of list){if('focus' in c){c.navigate(target);return c.focus();}}return clients.openWindow(target)}));
});
