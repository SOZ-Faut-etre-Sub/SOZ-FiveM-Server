declare global {
  namespace NodeJS {
    interface Global {
      isPhoneOpen: boolean;
      isPhoneDrowned: boolean;
      isPhoneDisabled: boolean;
      isPlayerLoaded: boolean;
    }
  }
}
export {};
