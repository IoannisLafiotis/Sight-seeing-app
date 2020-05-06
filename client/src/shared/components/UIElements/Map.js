import React, { useRef, useEffect } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  // use destructuring so we dont have to repeat PROPS in every line
  const { center, zoom } = props;

  // useEffect hook will run after the JSX code has been rendered which means that the location
  // and zoom will be given to an already renderd component in comparison to non rendered
  // one which we tried before ...mapsRef connection will be enstablished so it will work
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom,
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
