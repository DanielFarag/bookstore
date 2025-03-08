export default (error, req, res, next)=>{
    return res.status(500).json({
        message: "Unhandled Exception", 
        error: Object.getOwnPropertyNames(error).reduce((acc, key) => {
            acc[key] = error[key];
            return acc;
          }, {})
    })
}