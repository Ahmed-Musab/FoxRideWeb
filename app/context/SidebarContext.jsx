'use client';

import { createContext, useContext, useState } from 'react';

export const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [ isMinimized, setIsMinimized ] = useState(false);

    return (
        <SidebarContext.Provider value={{ isMinimized, setIsMinimized }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    return useContext(SidebarContext);
}