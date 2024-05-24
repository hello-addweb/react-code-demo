import Box from "@/components/elements/Box/Box";
import Button from "@/components/elements/Button/Button";
import Input from "@/components/elements/Input/Input";
import Select from "@/components/elements/Select/Select";
import Text from "@/components/elements/Text/Text";
import React, { useReducer } from "react";

interface BannerFormDataTypes {
  formData: {
    moveTypeOptions: {
      value: string;
      label: string;
    }[];
    moveSizeOptions: {
      value: string;
      label: string;
    }[];
    formHeaderTitle: string;
    btnTitle: string;
  };
  className: string;
}

const initialState = {
  name: "",
  email: "",
  phone: "",
  moveType: "",
  bedrooms: "",
  origin: "",
  destination: "",
  errors: {
    name: "",
    email: "",
    phone: "",
    moveType: "",
    bedrooms: "",
    origin: "",
    destination: "",
  },
};

const formReducer = (
  state: { errors: any },
  action: { type: any; field: any; value: any; error: any }
) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    default:
      return state;
  }
};

const BannerForm = ({ className, formData }: BannerFormDataTypes) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Function to handle input changes
  const handleInputChange = (field: any, value: any) => {
    dispatch({
      type: "SET_FIELD",
      field,
      value,
      error: undefined,
    });
  };

  // Function to handle form submission
  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    // Implement form submission logic here
  };

  return (
    <Box className={"form-box " + className}>
      <Text className="heading text-lightText px-4 py-2 font-PoppinsSemiBold block rounded-t-xl bg-tertiary text-center">
        {formData?.formHeaderTitle}
      </Text>
      <Box
        elementType="form"
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-b-xl"
      >
        <Box className="columns-3 gap-2">
          <Input
            type="text"
            className=""
            name="speed-quote-name"
            placeholder="Name *"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            className=""
            name="speed-quote-email"
            placeholder="Email *"
            onChange={handleInputChange}
          />
          <Input
            type="text"
            className=""
            name="speed-quote-phone"
            placeholder="Phone *"
            onChange={handleInputChange}
          />
        </Box>
        <Box className="columns-2 gap-2">
          <Select
            name="speed-quote-move_type"
            options={formData?.moveTypeOptions}
            className=""
          />
          <Select
            name="speed-quote-bedrooms"
            options={formData?.moveSizeOptions}
            className=""
          />
        </Box>
        <Box className="columns-2 gap-2">
          <Input
            type="text"
            className=""
            name="speed-quote-origin"
            placeholder="From Suburb *"
          />
          <Input
            type="text"
            className=""
            name="speed-quote-destination"
            placeholder="To Suburb *"
          />
        </Box>
        <Box className="columns-1 pt-2">
          <Button className="btn w-[100%]">{formData?.btnTitle}</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default BannerForm;
