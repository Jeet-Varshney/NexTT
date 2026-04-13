const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const PlannerMetrics = require('../database/models/PlannerMetrics');
const PlannerTask = require('../database/models/PlannerTask');
const Extracurricular = require('../database/models/Extracurricular');

// ─────────────────────────────────────────────────────────
//  IN-MEMORY STORE – used when MongoDB is unavailable
//  Keyed by email so each user gets their own session store
// ─────────────────────────────────────────────────────────
const memStore = {};

const getStore = (email) => {
  if (!memStore[email]) {
    const today = new Date().toISOString().split('T')[0];
    memStore[email] = {
      metrics: {
        attendance: [
          { subject: 'Data Structures', attended: 28, total: 35 },
          { subject: 'Operating Systems', attended: 15, total: 25 },
          { subject: 'Computer Networks', attended: 18, total: 20 },
          { subject: 'Machine Learning', attended: 22, total: 30 }
        ],
        studyStreaks: [
          { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], hours: 2 },
          { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], hours: 3 },
          { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], hours: 1 }
        ]
      },
      tasks: [
        { _id: 'mem_t1', userEmail: email, title: 'Complete OS assignment', completed: false, category: 'Urgent', date: today },
        { _id: 'mem_t2', userEmail: email, title: 'Review ML concepts', completed: true, category: 'Core', date: today },
        { _id: 'mem_t3', userEmail: email, title: 'Check Lab Manual', completed: false, category: 'Lab', date: today }
      ],
      extracurriculars: [
        { _id: 'mem_e1', userEmail: email, activityName: 'NexT Hackathon', type: 'Hackathon', badgeGiven: true, date: '2026-03-15' },
        { _id: 'mem_e2', userEmail: email, activityName: 'AI Club Meeting', type: 'Club', badgeGiven: false, date: '2026-04-05' }
      ],
      _taskCounter: 10,
      _extraCounter: 10
    };
  }
  return memStore[email];
};

const isDBUp = () => mongoose.connection.readyState === 1;

// ─────────────────────────────────────────────────────────
//  SEEDER – only runs when DB is connected
// ─────────────────────────────────────────────────────────
const generateDummyDataIfNeeded = async (email) => {
  let metrics = await PlannerMetrics.findOne({ userEmail: email });
  if (!metrics) {
    const today = new Date().toISOString().split('T')[0];
    metrics = new PlannerMetrics({
      userEmail: email,
      attendance: [
        { subject: 'Data Structures', attended: 28, total: 35 },
        { subject: 'Operating Systems', attended: 15, total: 25 },
        { subject: 'Computer Networks', attended: 18, total: 20 },
        { subject: 'Machine Learning', attended: 22, total: 30 }
      ],
      studyStreaks: [
        { date: new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0], hours: 2 },
        { date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], hours: 3 },
        { date: new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0], hours: 1 }
      ]
    });
    await metrics.save();
    await PlannerTask.insertMany([
      { userEmail: email, title: 'Complete OS assignment', completed: false, category: 'Urgent', date: today },
      { userEmail: email, title: 'Review ML concepts', completed: true, category: 'Core', date: today },
      { userEmail: email, title: 'Check Lab Manual', completed: false, category: 'Lab', date: today }
    ]);
    await Extracurricular.insertMany([
      { userEmail: email, activityName: 'NexT Hackathon', type: 'Hackathon', badgeGiven: true, date: '2026-03-15' },
      { userEmail: email, activityName: 'AI Club Meeting', type: 'Club', badgeGiven: false, date: '2026-04-05' }
    ]);
  }
};

// ─────────────────────────────────────────────────────────
//  GET Dashboard Data
// ─────────────────────────────────────────────────────────
router.get('/metrics/:email', async (req, res) => {
  const email = req.params.email;
  if (!isDBUp()) {
    const s = getStore(email);
    const today = new Date().toISOString().split('T')[0];
    return res.json({
      metrics: s.metrics,
      tasks: s.tasks.filter(t => t.date === today),
      extracurriculars: s.extracurriculars,
      note: 'Memory Mode'
    });
  }
  try {
    await generateDummyDataIfNeeded(email);
    const today = new Date().toISOString().split('T')[0];
    const metrics = await PlannerMetrics.findOne({ userEmail: email });
    const tasks = await PlannerTask.find({ userEmail: email, date: today });
    const extracurriculars = await Extracurricular.find({ userEmail: email });
    res.json({ metrics, tasks, extracurriculars });
  } catch (err) {
    console.error('GET_METRICS_ERROR:', err.message);
    const s = getStore(email);
    const today = new Date().toISOString().split('T')[0];
    res.json({ metrics: s.metrics, tasks: s.tasks.filter(t => t.date === today), extracurriculars: s.extracurriculars, note: 'Error Fallback' });
  }
});

// ─────────────────────────────────────────────────────────
//  POST Study Session
// ─────────────────────────────────────────────────────────
router.post('/study-session', async (req, res) => {
  const { email, hours, date } = req.body;
  if (!isDBUp()) {
    const s = getStore(email);
    const existing = s.metrics.studyStreaks.find(x => x.date === date);
    if (existing) existing.hours += Number(hours);
    else s.metrics.studyStreaks.push({ date, hours: Number(hours) });
    return res.json(s.metrics.studyStreaks);
  }
  try {
    const metrics = await PlannerMetrics.findOne({ userEmail: email });
    if (!metrics) return res.status(404).json({ error: 'Not found' });
    const existing = metrics.studyStreaks.find(s => s.date === date);
    if (existing) existing.hours += Number(hours);
    else metrics.studyStreaks.push({ date, hours: Number(hours) });
    await metrics.save();
    res.json(metrics.studyStreaks);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  POST Add Task
// ─────────────────────────────────────────────────────────
router.post('/task', async (req, res) => {
  const { email, title, category, date } = req.body;
  if (!isDBUp()) {
    const s = getStore(email);
    s._taskCounter++;
    const task = { _id: `mem_t${s._taskCounter}`, userEmail: email, title, category: category || 'Core', date, completed: false };
    s.tasks.push(task);
    return res.json(task);
  }
  try {
    const task = new PlannerTask({ userEmail: email, title, category: category || 'Core', date, completed: false });
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  PATCH Toggle Task
// ─────────────────────────────────────────────────────────
router.patch('/task/:id', async (req, res) => {
  const { id } = req.params;
  // Check all memory stores
  for (const email of Object.keys(memStore)) {
    const s = memStore[email];
    const task = s.tasks.find(t => t._id === id);
    if (task) {
      task.completed = !task.completed;
      return res.json(task);
    }
  }
  if (!isDBUp()) return res.status(404).json({ error: 'Task not found in memory' });
  try {
    const task = await PlannerTask.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  DELETE Task
// ─────────────────────────────────────────────────────────
router.delete('/task/:id', async (req, res) => {
  const { id } = req.params;
  for (const email of Object.keys(memStore)) {
    const s = memStore[email];
    const idx = s.tasks.findIndex(t => t._id === id);
    if (idx > -1) {
      s.tasks.splice(idx, 1);
      return res.json({ success: true });
    }
  }
  if (!isDBUp()) return res.json({ success: true });
  try {
    await PlannerTask.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  POST Add/Update Subject
// ─────────────────────────────────────────────────────────
router.post('/subject', async (req, res) => {
  const { email, subjectName, attended, total } = req.body;
  if (!isDBUp()) {
    const s = getStore(email);
    const idx = s.metrics.attendance.findIndex(x => x.subject === subjectName);
    if (idx > -1) s.metrics.attendance[idx] = { subject: subjectName, attended: Number(attended), total: Number(total) };
    else s.metrics.attendance.push({ subject: subjectName, attended: Number(attended) || 0, total: Number(total) || 1 });
    return res.json(s.metrics.attendance);
  }
  try {
    const metrics = await PlannerMetrics.findOne({ userEmail: email });
    if (!metrics) return res.status(404).json({ error: 'Metrics not found' });
    const idx = metrics.attendance.findIndex(s => s.subject === subjectName);
    if (idx > -1) metrics.attendance[idx] = { subject: subjectName, attended, total };
    else metrics.attendance.push({ subject: subjectName, attended: attended || 0, total: total || 1 });
    await metrics.save();
    res.json(metrics.attendance);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  DELETE Subject
// ─────────────────────────────────────────────────────────
router.delete('/subject', async (req, res) => {
  const { email, subjectName } = req.query;
  if (!isDBUp()) {
    const s = getStore(email);
    s.metrics.attendance = s.metrics.attendance.filter(x => x.subject !== subjectName);
    return res.json(s.metrics.attendance);
  }
  try {
    const metrics = await PlannerMetrics.findOne({ userEmail: email });
    if (!metrics) return res.status(404).json({ error: 'Metrics not found' });
    metrics.attendance = metrics.attendance.filter(x => x.subject !== subjectName);
    await metrics.save();
    res.json(metrics.attendance);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  POST Add Extracurricular
// ─────────────────────────────────────────────────────────
router.post('/extracurricular', async (req, res) => {
  const { email, activityName, type, badgeGiven, date } = req.body;
  if (!isDBUp()) {
    const s = getStore(email);
    s._extraCounter++;
    const entry = {
      _id: `mem_e${s._extraCounter}`,
      userEmail: email,
      activityName,
      type: type || 'Event',
      badgeGiven: badgeGiven || false,
      date: date || new Date().toISOString().split('T')[0]
    };
    s.extracurriculars.push(entry);
    return res.json(entry);
  }
  try {
    const entry = new Extracurricular({ userEmail: email, activityName, type: type || 'Event', badgeGiven: badgeGiven || false, date: date || new Date().toISOString().split('T')[0] });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ─────────────────────────────────────────────────────────
//  DELETE Extracurricular
// ─────────────────────────────────────────────────────────
router.delete('/extracurricular/:id', async (req, res) => {
  const { id } = req.params;
  for (const email of Object.keys(memStore)) {
    const s = memStore[email];
    const idx = s.extracurriculars.findIndex(e => e._id === id);
    if (idx > -1) {
      s.extracurriculars.splice(idx, 1);
      return res.json({ success: true });
    }
  }
  if (!isDBUp()) return res.json({ success: true });
  try {
    await Extracurricular.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
