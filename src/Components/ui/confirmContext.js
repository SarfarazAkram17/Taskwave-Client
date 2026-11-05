import { createContext, useContext } from "react";

export const ConfirmContext = createContext(async () => false);
export const useConfirm = () => useContext(ConfirmContext);
