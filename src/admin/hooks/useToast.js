import { useState } from 'react';

let toastIdCounter = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const push = (message, type = 'info') => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const dismiss = (id) => setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return {
    toasts,
    dismiss,
    success: (message) => push(message, 'success'),
    error: (message) => push(message, 'error'),
    info: (message) => push(message, 'info'),
  };
}
