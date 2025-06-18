// Audio effects utilities for BoperCheck
export const playVoucherDropSound = () => {
  try {
    const audio = new Audio('/sounds/coin-drop.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (error) {
    console.log('Audio not available');
  }
};

export const playSuccessSound = () => {
  try {
    const audio = new Audio('/sounds/success.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (error) {
    console.log('Audio not available');
  }
};

export const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.1;
    audio.play().catch(e => console.log('Audio play failed:', e));
  } catch (error) {
    console.log('Audio not available');
  }
};

export const setAudioEnabled = (enabled: boolean) => {
  localStorage.setItem('bopercheck-audio-enabled', enabled.toString());
};

export const isAudioEnabled = (): boolean => {
  return localStorage.getItem('bopercheck-audio-enabled') !== 'false';
};