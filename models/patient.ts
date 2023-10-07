import { Schema, model, models } from 'mongoose';
type Visit = {
  complaint: string,
  provisionalDiagnosis: string,
  treatment: string,
  investigations: string,
  weight: number,
  dateOfVisit: string,
}
const PatientSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required!'],
    },
    address: {
        type: String,
    },
    phoneNo: {
        type: String,
    },
    dob: {
        type: String,
        required: [true, 'DOB is required!'],
    },
    sex: {
        type: String,
        required: [true, 'Sex is required!'],
    },
    visits: {
        type: Array<Visit>,
        required: [true, 'Visit info is required'],
    }
})

const Patient = models.Patient || model("Patient", PatientSchema);

export default Patient;