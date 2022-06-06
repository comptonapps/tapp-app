import React from 'react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import ModalContainer from '../ModalContainer/ModalContainer';

function GMap({lat, lng, toggle}) {
    let timer;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA8hnYJdzVa7xLH3yESNKm6ZSunyyuASfw'
  })

  const [map, setMap] = React.useState(null)
  const [center, setCenter] = React.useState({lat, lng});
  const [zoom, setZoom] = React.useState(1)

  React.useEffect(() => {
    timer = setTimeout(() => {
        setCenter({lat, lng});
        setZoom(z => 14)
    }, 300);
    return () => clearTimeout(timer);
  }, [map]);
  

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
    map.setCenter(center);
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <ModalContainer>
      <GoogleMap className="GMap"
        mapContainerStyle={{height: '400px', width: '400px'}}
        defaultCenter={center}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker position={{lat, lng}} />
        <></>
      </GoogleMap>
      <button onClick={toggle}>Close</button>
      </ModalContainer>
  ) : <></>
}

export default React.memo(GMap);