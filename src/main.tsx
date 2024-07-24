import '@/index.scss'

import React from 'react'
import ReactDOM from 'react-dom/client'
import "@rainbow-me/rainbowkit/styles.css";

import "@/polyfills";
import App from './App.tsx'
import { init } from "@airstack/airstack-react";

init(import.meta.env.VITE_AIRSTACK_API_KEY);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
