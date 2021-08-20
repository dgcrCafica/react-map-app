import React, { createContext } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";
import { useSocket } from '../hooks/useSocket';

interface ContextProps {
  socket  : Socket<DefaultEventsMap, DefaultEventsMap>;
  isOnline: boolean;
}

export const SocketContext = createContext({} as ContextProps);

export const SocketProvider: React.FC = ({ children }) => {

  const { socket, isOnline } = useSocket('http://localhost:8080');

  return (
    <SocketContext.Provider
      value={{
        socket,
        isOnline,
      }}
    >
      { children }
    </SocketContext.Provider>
  )
}