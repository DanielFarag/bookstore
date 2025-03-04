import multer from 'multer';

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

    if (err.message == "image_not_defined") {
        return res.status(422).json({ 
            errors: [{
                key: "image",
                type: "required",
                message: "image not provided"
            }]
        });
    }
    next(err)
}