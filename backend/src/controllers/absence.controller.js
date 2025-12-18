import Absence from '../models/Absence.js';
import Subject from '../models/Subject.js';

export const addAbsence = async (req, res) => {
  const { subjectId, hours, date } = req.body;

  // Assuming req.user is populated by auth middleware
  const userId = req.user.id;

  try {
    const absence = await Absence.create({
      userId,
      subjectId,
      hours,
      date,
    });
    res.status(201).json(absence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAbsences = async (req, res) => {
  const userId = req.user.id;
  try {
    const absences = await Absence.find({ userId }).populate('subjectId', 'name');
    res.json(absences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const subjects = await Subject.find({});
    const absences = await Absence.find({ userId });

    const stats = subjects.map((subject) => {
      // Filter absences for this subject
      const subjectAbsences = absences.filter(
        (a) => a.subjectId.toString() === subject._id.toString()
      );

      // Calculate total hours missed
      const hoursMissed = subjectAbsences.reduce((acc, curr) => acc + curr.hours, 0);

      // Calculate percentage
      let percentage = 0;
      if (subject.totalHours > 0) {
        percentage = (hoursMissed / subject.totalHours) * 100;
      }

      return {
        subject: subject.name,
        subjectId: subject._id,
        totalHours: subject.totalHours,
        hoursMissed,
        percentage: parseFloat(percentage.toFixed(2)),
      };
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
