// src/hooks/useIsIos.ts
export function useIsIos(): boolean {
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
  }
  
  export function useIsStandalone(): boolean {
    // @ts-ignore
    return 'standalone' in window.navigator && window.navigator.standalone;
  }