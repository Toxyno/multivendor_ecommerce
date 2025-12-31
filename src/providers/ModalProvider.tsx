"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FC,
  useEffect,
} from "react";

import { User } from "@prisma/client";
import React from "react";

interface ModalProviderProps {
  children: ReactNode;
}

export type ModalData = {
  user?: User;
};

type ModalCPntextType = {
  isOpen: boolean;
  data?: ModalData;
  setOpen: (modal: ReactNode, fetchData?: () => Promise<any>) => Promise<void>;
  setClose: () => void;
};

export const ModalContext = createContext<ModalCPntextType>({
  data: {},
  isOpen: false,
  setOpen: async (modal: ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [showingModal, setShowingModal] = useState<ReactNode>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const setOpen = async (modal: ReactNode, fetchData?: () => Promise<any>) => {
    if (!modal) return;
    let fetched: any = {};
    if (fetchData) {
      try {
        fetched = await fetchData();
      } catch (err) {
        console.error("Modal fetchData failed:", err);
        fetched = {};
      }
    }
    setData((prev) => ({ ...prev, ...(fetched || {}) }));
    setShowingModal(modal);
    setIsOpen(true);
  };

  const setClose = () => {
    setIsOpen(false);
    setShowingModal(null);
    setData({});
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ModalContext.Provider value={{ isOpen, data, setOpen, setClose }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export default ModalProvider;
