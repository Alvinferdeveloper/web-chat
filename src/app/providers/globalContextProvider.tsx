"use client";
import { createContext, useState, ReactNode, useContext } from "react";
import { Suscription } from "@/app/types/types";

type GlobalContextType = {
  activeSubscription: Suscription;
  setActiveSubscription: (suscription: Suscription) => void;
};

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [activeSubscription, setActiveSubscription] = useState({ id: "", planId: 0 });
  return (
    <GlobalContext.Provider value={{ activeSubscription, setActiveSubscription }}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) throw new Error("useGlobalContext debe usarse dentro de <GlobalContextProvider>");
  return context;
}