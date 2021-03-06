import { useCallback, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';
import { Coords } from '../interfaces/Coords';
import { Marcador } from '../interfaces/Marcador';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGdjcmNhZmljYSIsImEiOiJja3NmODU5bXUxOGM3Mm9tczBtYWVncTdjIn0.K5uJI0GyQ4AU613-W0TTnw';

class CustomMarker extends mapboxgl.Marker {
  public id: string;

  constructor( id: string ) {
    super();
    this.id = id;
  }
}

export const useMapbox = ( puntoInicial: Coords ) => {

  const [ coords, setCoords ] = useState<Coords>( puntoInicial );
  const mapaDiv = useRef<HTMLDivElement>( null );
  const mapa = useRef<mapboxgl.Map>();
  const marcadores = useRef<CustomMarker[]>([]);

  // Observables rxjs
  const movimientoMarcador = useRef( new Subject() );
  const nuevoMarcador = useRef( new Subject() );

  const actualizarPosicion = useCallback(( { id, lng, lat }: Marcador ) => {
    const index = marcadores.current.findIndex( marcador => marcador.id === id );

    if( index > -1 ) {
      marcadores.current[ index ].setLngLat([ lng, lat ]);
    }
  }, [] );

  const crearMarcador = useCallback(( ev: (mapboxgl.MapMouseEvent & mapboxgl.EventData) | null, marcador?: Marcador ) => {
    if( mapa.current ) {
      const lat = marcador ? marcador.lat : ev!.lngLat.lat;
      const lng = marcador ? marcador.lng : ev!.lngLat.lng;
      const marker = new CustomMarker( marcador?.id ?? v4() );

      marker.setLngLat([ lng, lat ]);
      marker.addTo( mapa.current );
      marker.setDraggable( true );

      marcadores.current = [ ...marcadores.current, marker ];

      if( !!!marcador ) {
        nuevoMarcador.current.next({
          id: marker.id,
          lng,
          lat
        });
      }

      /** Movimiento de marcador */
      marker.on('drag', ( ev: any ) => {
        const id = marker.id;
        const { target } = ev;
        const { lng, lat } = target.getLngLat();

        movimientoMarcador.current.next({
          id,
          lng,
          lat
        });
      });
    }
  }, []);

  useEffect(() => {
    if( mapaDiv.current ) {
      const map = new mapboxgl.Map({
        container: mapaDiv.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [
          puntoInicial.lng,
          puntoInicial.lat,
        ],
        zoom: puntoInicial.zoom
      });

      mapa.current = map;
    }
  }, []);

  // Para cuando se mueve el mapa
  useEffect(() => {
    const mapaMove = () => {
      const { lat, lng } = mapa.current!.getCenter();
      setCoords({
        lat : Number( lat.toFixed( 4 ) ),
        lng : Number( lng.toFixed( 4 ) ),
        zoom: Number( mapa.current?.getZoom().toFixed( 2 ) )
      });
    };

    mapa.current?.on('move', mapaMove);

    return () => {
      mapa.current?.off('move', mapaMove);
    }
  }, []);

  // Agregar marcadores
  useEffect(() => {
    mapa.current?.on('click', crearMarcador);

    return () => {
      mapa.current?.off('click', crearMarcador);
    }
  }, [ crearMarcador ]);

  return {
    coords,
    mapaDiv,
    marcadores,
    crearMarcador,
    actualizarPosicion,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
  };
}
