import { useContext, useEffect } from 'react';
import { Subject } from 'rxjs';
import { SocketContext } from '../context/SocketContext';
import { Marcador } from '../interfaces/Marcador';

interface Props {
  nuevoMarcador$      : Subject<unknown>;
  movimientoMarcador$ : Subject<unknown>;
  crearMarcador       : ( ev : (mapboxgl.MapMouseEvent & mapboxgl.EventData) | null, marcador?: Marcador ) => void;
  actualizarPosicion  : ( marcador: Marcador ) => void;
}

export const useSocketMapbox = ({ nuevoMarcador$, movimientoMarcador$, crearMarcador, actualizarPosicion }: Props) => {

  const { socket } = useContext( SocketContext );
  
  // Crear marcador
  useEffect(() => {
    nuevoMarcador$.subscribe( marker => {
      socket.emit('marcador-nuevo', marker);
    });
  }, [ nuevoMarcador$, socket ]);

  // Movimiento de marcador
  useEffect(() => {
    movimientoMarcador$.subscribe( marker => {
      socket.emit('marcador-actualizado', marker);
    });
  }, [ socket, movimientoMarcador$ ]);

  // Mover marcador mediante sockets
  useEffect(() => {
    socket.on('marcador-actualizado', ( marcador: Marcador ) => {
      actualizarPosicion( marcador );
    });
  }, [ socket, actualizarPosicion ]);

  // Escuchar los marcadores existentes
  useEffect(() => {
    socket.on('marcadores-activos', ( marcadores: Marcador[] ) => {
      marcadores.forEach( marcador => {
        crearMarcador( null, marcador );
      });
    });
  }, [ socket, crearMarcador ]);

  // Escuchar nuevos marcadores
  useEffect(() => {
    socket.on('marcador-nuevo', ( marcador: Marcador ) => {
      crearMarcador( null, marcador );
    });
  }, [ socket, crearMarcador ]);
}