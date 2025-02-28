export default (err,req,res,next)=>{
    if(err.type == 404){
        res.status(404).json({message: "record not found"})
        return;
    }
    next(err)
}