import React from "react";

import "./PlaceForm.css";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";

const NewPlace = () => {
  // giving the initial values to the reducer
  // again destructuring the data ===> getting the form state and inputHandler from the hook
  // state full logic for study
  // when the state component inside the hook get updated the data wll get updated
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: "",
        isValid: false,
      },
      description: {
        value: "",
        isValid: false,
      },
      address: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  // when the titleInputHandler is triggered with every input or every change of the state
  // it can cause recursion and brake the app down
  // what USECALLBACK is doing is that once the function is fired it is stored
  // that's how the loop breaks and wont continue
  // that's how with stop the UseEffect infinite loop
  // REMINDER => Use effect is triggered when there is change in the props ,,, state

  // we can make one more complex and more flexible input handler for all cases
  // const descriptionInputHandler = useCallback((id, value, isValid) => {}, []);

  const placeSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs); // this is going to the backend
  };

  return (
    <form className="place-form" onSubmit={placeSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title"
        onInput={inputHandler}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a description of at least 5 chars"
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address"
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};
export default NewPlace;
