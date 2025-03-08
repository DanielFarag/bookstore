export default (err,req,res,next)=>{
    if(err.type == 404){
        return res.status(404).json({ message: err.message });
        return;
    }
    next(err)
}