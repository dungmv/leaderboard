
const express = require('express');
const config = require('../config');
const router = express.Router();

const errorFormat = (e) => {
  return e.message;
}
router.get('/',async(req, res, next)=>{
    let e = {};
    e.message = "Success connect server leaderboard!";
    res.json({ err: 0, msg: errorFormat(e) }); 
});