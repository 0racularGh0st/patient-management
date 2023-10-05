"use client";
import * as Yup from 'yup';
const requiredFieldMessage = 'This field is required'
export const addPatientValidation = Yup.object().shape({
  name: Yup.string().min(3, "Name must be atleast 3 characters long.").nullable().required(requiredFieldMessage).typeError(requiredFieldMessage),
  age: Yup.number().required(requiredFieldMessage).typeError(requiredFieldMessage),
  complaint: Yup.string().typeError(requiredFieldMessage),
  provisionalDiagnosis: Yup.string().typeError(requiredFieldMessage),
  treatment: Yup.string().typeError(requiredFieldMessage),
  investigations: Yup.string().typeError(requiredFieldMessage),
  weight: Yup.number().typeError(requiredFieldMessage),
  dateOfVisit: Yup.string().typeError(requiredFieldMessage),
  address: Yup.string().typeError(requiredFieldMessage),
  phoneNo: Yup.string().typeError(requiredFieldMessage),
});
