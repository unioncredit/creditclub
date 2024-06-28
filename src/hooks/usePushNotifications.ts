import { urlBase64ToUint8Array } from "@/utils/notifications.ts";
import { useEffect, useState } from "react";
import { Address } from "viem";

export const usePushNotifications = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const serviceWorkerRegistration = await navigator.serviceWorker.ready;
        const subscription = await serviceWorkerRegistration.pushManager.getSubscription();

        if (subscription) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.error('Error during getSubscription()', error);
      }
    };

    checkSubscription();
  }, []);

  const requestPermissions = (address: Address) => {
    if ('Notification' in window && 'serviceWorker' in navigator) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted.');
          // Register the service worker
          registerServiceWorker(address);
        } else {
          console.log('Notification permission denied.');
        }
      });
    }
  };

  const registerServiceWorker = (address: Address) => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
        subscribeUserToPush(address, registration);
      })
      .catch(error => {
        console.error('Service Worker registration failed:', error);
      });
  }

  const subscribeUserToPush = (address: Address, registration: ServiceWorkerRegistration) => {
    const applicationServerKey = urlBase64ToUint8Array(import.meta.env.VITE_NOTIFICATIONS_PUBLIC_KEY);
    registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
      .then(subscription => {
        console.log('User is subscribed:', subscription);

        // Send subscription to the server
        sendSubscriptionToServer(address, subscription);
      })
      .catch(error => {
        console.error('Failed to subscribe the user:', error);
      });
  }

  const sendSubscriptionToServer = (address: Address, subscription: PushSubscription) => {
    fetch(`${import.meta.env.VITE_NOTIFICATIONS_API_URL}/subscribe`, {
      method: 'POST',
      body: JSON.stringify({
        subscription,
        address,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      setIsSubscribed(true);
    });
  }

  return {
    isSubscribed,
    subscribe: requestPermissions,
  }
};