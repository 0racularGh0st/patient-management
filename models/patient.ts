import { Schema, model, models } from 'mongoose';

const VisitSchema = new Schema({
  complaint: {
    type: String,
  },
  provisionalDiagnosis: {
    type: String,
  },
  treatment: {
    type: String,
  },
  investigations: {
    type: String,
  },
  weight: {
    type: Number,
  },
  dateOfVisit: {
    type: String,
  },
});

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
    },
    visits: {
        type: [VisitSchema],
        required: [true, 'Visit info is required'],
    }
})

const Patient = models.Patient || model("Patient", PatientSchema);

export default Patient;