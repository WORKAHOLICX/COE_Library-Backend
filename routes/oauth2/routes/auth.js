const {Router}=require('express');
const router=Router()

const passport=require('passport');
// creating the routes for the end point

router.get('/google',
passport.authenticate('google',{
  scope:['profile']})
);
router.get('/google/callback',
passport.authenticate('google',{
    successRedirect:'/success',
    failureRedirect:'/auth/failure'
}),(req,res)=>{
  res.send(200);
});
module.exports=router;