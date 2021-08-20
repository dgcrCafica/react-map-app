import React from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { Coords } from '../interfaces/Coords';
import { useSocketMapbox } from '../hooks/useSocketMapbox';

const puntoInicial: Coords = {
  lng: -106.4201,
  lat: 23.2238,
  zoom: 13,
}

export const MapaPage = () => {

  const { 
    coords, 
    mapaDiv, 
    nuevoMarcador$, 
    movimientoMarcador$, 
    crearMarcador,
    actualizarPosicion,
  } = useMapbox( puntoInicial );

  useSocketMapbox({ nuevoMarcador$, movimientoMarcador$, crearMarcador, actualizarPosicion });
  
  return (
    <>
      <div className='info'>
        Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
      </div>

      <div
        ref={ mapaDiv }
        className='mapContainer'
      />
    </>
  );
}
