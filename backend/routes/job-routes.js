const express = require('express');
const router = express.Router();
const {createjob, getAllJobs, getJobById, updateJob, deleteJob, applyForJob, leaveJob, selectApplicants, getMyJobs, recommendationJobs } = require('../controllers/job-controller');
const authMiddleware=require("../middleware/auth-middleware");

router.post('/create-job',authMiddleware,createjob);
router.get('/jobs',authMiddleware,getAllJobs);
router.get('/get-job/:id',authMiddleware, getJobById);
router.put('/update-job/:id',authMiddleware, updateJob);
router.delete('/delete-job/:id',authMiddleware, deleteJob);
router.post('/apply/:id',authMiddleware, applyForJob);
router.post('/leave/:id',authMiddleware, leaveJob);
router.post('/select-applicants/:id',authMiddleware, selectApplicants);
router.get('/myjobs',authMiddleware,getMyJobs);
router.get('/recommendations',authMiddleware,recommendationJobs);
module.exports=router;