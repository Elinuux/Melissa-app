import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { publicAppConfig } from './app.config';
export default defineConfig({plugins:[react(),VitePWA({registerType:'autoUpdate',includeAssets:['icon-192.svg','icon-512.svg'],manifest:{id:'/',name:publicAppConfig.name,short_name:publicAppConfig.shortName,description:publicAppConfig.tagline,start_url:'/',scope:'/',display:'standalone',background_color:'#f8f7fb',theme_color:'#5f5a74',icons:[{src:'/icon-192.svg',sizes:'192x192',type:'image/svg+xml',purpose:'any'},{src:'/icon-512.svg',sizes:'512x512',type:'image/svg+xml',purpose:'any maskable'}]},workbox:{navigateFallback:'/index.html',importScripts:['/push-handler.js'],runtimeCaching:[{urlPattern:({request})=>request.destination==='document'||request.destination==='script'||request.destination==='style',handler:'StaleWhileRevalidate',options:{cacheName:'melissa-app-shell'}}]}})]});
