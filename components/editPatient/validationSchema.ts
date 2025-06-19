"use client";
import * as Yup from 'yup';

const requiredFieldMessage = 'This field is required';

export const editPatientValidation = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters long.")
    .required(requiredFieldMessage)
    .typeError(requiredFieldMessage),
  ageYears: Yup.number()
    .min(0, "Age years must be 0 or greater")
    .max(150, "Age years must be 150 or less")
    .required(requiredFieldMessage)
    .typeError(requiredFieldMessage),
  ageMonths: Yup.number()
    .min(0, "Age months must be 0 or greater")
    .max(11, "Age months must be 11 or less")
    .required(requiredFieldMessage)
    .typeError(requiredFieldMessage),
  address: Yup.string()
    .typeError(requiredFieldMessage),
  phoneNo: Yup.string()
    .typeError(requiredFieldMessage),
});
