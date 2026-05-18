import React, { createContext, useContext } from 'react';

const SplashContext = createContext({ visible: false });

export function SplashProvider({
  visible,
  children,
}: {
  visible: boolean;
  children: React.ReactNode;
}) {
  return <SplashContext.Provider value={{ visible }}>{children}</SplashContext.Provider>;
}

export function useSplashVisible() {
  return useContext(SplashContext).visible;
}
