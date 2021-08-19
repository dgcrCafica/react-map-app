import React, { useEffect } from 'react';
import { useMapbox } from '../hooks/useMapbox';
import { Coords } from '../interfaces/Coords';

const puntoInicial: Coords = {
  lng: -106.4201,
  lat: 23.2238,
  zoom: 13,
}

export const MapaPage = () => {

  const { coords, mapaDiv, nuevoMarcador$, movimientoMarcador$ } = useMapbox( puntoInicial );

  // Crear marcador
  useEffect(() => {
    nuevoMarcador$.subscribe( marker => {
      console.log( marker );
    })
  }, [ nuevoMarcador$ ]);

  // Movimiento de marcador
  useEffect(() => {
    movimientoMarcador$.subscribe( marker => {
      console.log( marker );
    });
  }, [ movimientoMarcador$ ])

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
