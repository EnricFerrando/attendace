import Subject from '../models/Subject.js';

export const createSubject = async (req, res) => {
  const { name, totalHours } = req.body;

  try {
    const subject = await Subject.create({
      name,
      totalHours,
    });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({});
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
