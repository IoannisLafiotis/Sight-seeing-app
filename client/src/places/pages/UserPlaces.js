import React from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "one of the most famous sights",
    imageUrl:
      "https://www.welt.de/img/reise/mobile202815184/7642501167-ci102l-w1024/U-S-NEW-YORK-MANHATTAN-CITY-VIEW.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire state building",
    description: "one of the most famous sights",
    imageUrl:
      "https://www.welt.de/img/reise/mobile202815184/7642501167-ci102l-w1024/U-S-NEW-YORK-MANHATTAN-CITY-VIEW.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
