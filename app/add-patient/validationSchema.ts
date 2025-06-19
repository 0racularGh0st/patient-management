"use client";
import * as Yup from 'yup';
const requiredFieldMessage = 'This field is required'
export const addPatientValidation = Yup.object().shape({
  name: Yup.string().min(3, "Name must be atleast 3 characters long.").nullable().required(requiredFieldMessage).typeError(requiredFieldMessage),
  ageYears: Yup.number().min(0, "Age years must be 0 or greater").max(150, "Age years must be 150 or less").required(requiredFieldMessage).typeError(requiredFieldMessage),
  ageMonths: Yup.number().min(0, "Age months must be 0 or greater").max(11, "Age months must be 11 or less").required(requiredFieldMessage).typeError(requiredFieldMessage),
  sex: Yup.string().nullable().required(requiredFieldMessage).typeError(requiredFieldMessage),
  complaint: Yup.string().typeError(requiredFieldMessage),
  provisionalDiagnosis: Yup.string().typeError(requiredFieldMessage),
  treatment: Yup.string().typeError(requiredFieldMessage),
  investigations: Yup.string().typeError(requiredFieldMessage),
  weight: Yup.number().typeError(requiredFieldMessage),
  dateOfVisit: Yup.string().typeError(requiredFieldMessage),
  address: Yup.string().typeError(requiredFieldMessage),
  phoneNo: Yup.string().typeError(requiredFieldMessage),
});
