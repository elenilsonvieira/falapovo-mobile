import React, { createContext, ReactNode, useContext, useState } from 'react';


type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

interface ToastContextData {
  toastState: ToastState;
  showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });

    setTimeout(() => {
      setToast((currentState) => ({ ...currentState, isVisible: false }));
    }, 3000);
  };

   return (
    <ToastContext.Provider value={{ toastState: toast, showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};