import { create } from 'zustand';

type NotificationState = {
  isShowing: boolean;
  message: string;
  show: (message: string) => void;
  hide: () => void;
};

export const useNotificationStore = create<NotificationState>(set => ({
  isShowing: false,
  message: '',
  show: message => set({ isShowing: true, message }),
  hide: () => set({ isShowing: false }),
}));
