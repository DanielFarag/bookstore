export default (err,req,res,next)=>{
    if (err.name === "ValidationError") {
        return res.status(422).json({ 
            errors: err.details?.map(e=>({
                key: e.context.key,
                type: e.type,
                message: e.message
            })) 
        });
    }
    next(err)
}