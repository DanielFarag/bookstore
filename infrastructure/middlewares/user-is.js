export default (type) => (req,res,next)=>{
    
    // For Testing [ bypass authorization till auth. implemented. ]

    // if (! (req.user && req.user.type === type) ) 
    //     return res.status(403).json({ message: "Unauthorized to access this resource" });
    // }
    
    next()
}