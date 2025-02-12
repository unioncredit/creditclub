import React, { createContext, useContext, useState, useEffect, useRef } from "react";

// @ts-ignore
import { Notification, NotificationStack } from "@unioncredit/ui";
import { IToast, IToastsContext } from "@/providers/types";

const ToastsContext = createContext({} as IToastsContext);

export const useToasts = () => useContext(ToastsContext);

const AUTO_CLEAR_MS = 3000;

export const ToastsProvider = ({ children }: { children: React.ReactNode; }) => {
  const [toasts, setToasts] = useState<IToast[]>([]);
  const timers = useRef<any[]>([]);

  const addToast = ({ content, link, variant, title, id }: IToast, autoClear = true) => {
    console.log("addToast()", content, link, variant, title, id);
    setToasts((x) => [...x, { id, content, link, variant, title }]);

    if (autoClear) {
      const timerId = setTimeout(() => {
        closeToast(id);
      }, AUTO_CLEAR_MS);
      timers.current.push(timerId);
    }

    return id;
  };

  const closeToast = (id: string) => {
    setToasts((x) => x.filter((toast) => toast.id !== id));
  };

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    []
  );

  return (
    <ToastsContext.Provider value={{ closeToast, addToast, toasts }}>
      {children}
      <NotificationStack>
        {toasts.map(({ id, link, title, variant, content }) => (
          <Notification
            key={id}
            link={link}
            title={title}
            variant={variant}
            content={content}
            onClose={() => closeToast(id)}
          />
        ))}
      </NotificationStack>
    </ToastsContext.Provider>
  );
}