import mongoose from 'mongoose';

const absenceSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  subjectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Subject',
  },
  hours: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Absence = mongoose.model('Absence', absenceSchema);

export default Absence;
