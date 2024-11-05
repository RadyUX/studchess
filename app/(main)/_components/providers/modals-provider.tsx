"use client";

import { useEffect, useState } from "react";
import { SettingsModal } from "../SettingsModal";
import ConverImageModal from "../CoverImageModal";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <>
      <SettingsModal />
      <ConverImageModal />
    </>
  );
};
