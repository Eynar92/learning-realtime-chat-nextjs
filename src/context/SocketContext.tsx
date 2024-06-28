'use client';

import { createContext, useContext } from "react";
import { type Socket, io } from 'socket.io-client';

interface SocketContextProps {
    socket: Socket;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    return context;
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const socket = io(backendUrl!);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}