"use client";
import { createContext, useState, ReactNode, useContext } from "react";

type GlobalContextType = {
  activePlan: number;
  setActivePlan: (plan: number) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [activePlan, setActivePlan] = useState(0);
  return (
    <GlobalContext.Provider value={{ activePlan, setActivePlan }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext debe usarse dentro de <GlobalContextProvider>");
  return context;
}