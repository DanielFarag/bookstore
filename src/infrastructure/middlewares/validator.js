export default (schema) => async (req,res,next)=>{
    try {
        const value = await schema.validateAsync(req.body);
        req.body = value
        next()
    } catch (error) {
        next(error)
    }
}