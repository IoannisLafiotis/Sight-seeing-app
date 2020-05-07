// const uuid = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

const getCoordsForAdress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

// we can use exports here or all together to the bottom
const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid; /// {pid : p1}
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("soemthing went wrong....", 500);
    return next(error);
  }
  console.log("get request");
  if (!place) {
    // return res.status(404).json({ message: "could not find" });
    // next(error) is used to trigger the error response from app.js when we use async JS
    const error = new HttpError("could not find the project", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) }); // turn the JSON into JS object!!!!
};

// alternatives to the above ==> function getPlaceById(){} or const getPlaceById = function () {} ....
// we can use exports here or all together to the bottom

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid; /// {pid : p1}

  // let places; check out the two different approaches with populate or without
  let userWithPlaces;
  try {
    // places = await Place.find({ creator: userId });
    userWithPlaces = await Place.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Fetching failed , please try again later",
      500
    );
    return next(error);
  }
  console.log("get request");
  // if (!places || places.length === 0) {
  //   //  return res.status(404).json({ "message: "could not find for this userId"" });
  //   return next(new HttpError("could not find for this userId", 404));
  // }
  if (!userWithPlaces || userWithPlaces.length === 0) {
    //  return res.status(404).json({ "message: "could not find for this userId"" });
    return next(new HttpError("could not find for this userId", 404));
  }
  // res.json({
  //   places: places.map((place) => place.toObject({ getters: true })),
  // });
  res.json({
    places: userWithPlaces.places.map((place) =>
      place.toObject({ getters: true })
    ),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invlid ipnputs passed, please check your data", 422)
    );
  }
  const { title, description, address, creator } = req.body;

  // when you want ot handle an error for async await use try/catch block
  let coordinates;
  try {
    coordinates = await getCoordsForAdress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = {
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://www.welt.de/img/reise/mobile202815184/7642501167-ci102l-w1024/U-S-NEW-YORK-MANHATTAN-CITY-VIEW.jpg",
    creator,
  };

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }
  console.log(user);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invlid ipnputs passed, please check your data", 422)
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Something went wrong,could not update", 500);
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("Something went wrong,could not update", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    const error = new HttpError("Could not delete the specific place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError(
      "Could not find place for the specific id",
      404
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Could not delete the specific place", 500);
    return next(error);
  }

  res.status(200).json({ message: "deleted succesfully" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlace = deletePlace;
exports.updatePlace = updatePlace;
