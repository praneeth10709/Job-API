const express=require('express')
const router=express.Router() 
const {getalljobs,getjob,createjob,updatejob,deletejob}=require('../controllers/jobs')

router.route('/').post(createjob).get(getalljobs)
router.route('/:id').get(getjob).patch(updatejob).delete(deletejob)
module.exports=router