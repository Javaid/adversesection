const express=require('express');
const router=express.Router();
const controller=require('../controllers/nppes.controller');

router.get('/fetch', controller.fetchData);
router.get('/providers', controller.getAllProviders); // New route to get all providers with relationships
module.exports=router;