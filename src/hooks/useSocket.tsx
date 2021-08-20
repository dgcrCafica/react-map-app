import { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';

export const useSocket = ( serverPath: string ) => {

  const socket = useMemo(() => io(serverPath, {
    transports: ['websocket'],
  }), [ serverPath ]);

  const [ isOnline, setIsOnline ] = useState( false );

  useEffect(() => {
    socket.on('connect', () => {
      setIsOnline( true );
    });
  }, [ socket ]);

  useEffect(() => {
    socket.on('disconnect', () => {
      setIsOnline( false );
    });
  }, [ socket ]);

  return {
    socket,
    isOnline,
  };
}