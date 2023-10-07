"use client";
import * as Yup from 'yup';
const requiredFieldMessage = 'This field is required'
export const addVisitValidation = Yup.object().shape({
  complaint: Yup.string().typeError(requiredFieldMessage),
  provisionalDiagnosis: Yup.string().typeError(requiredFieldMessage),
  treatment: Yup.string().typeError(requiredFieldMessage),
  investigations: Yup.string().typeError(requiredFieldMessage),
  weight: Yup.number().typeError(requiredFieldMessage),
  dateOfVisit: Yup.string().typeError(requiredFieldMessage),
});
