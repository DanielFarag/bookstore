
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads/'); 
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname) || ".jpg";
      cb(null, `${Date.now()}${extension}`);
    }
});
  
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
  
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb('Error: Only images are allowed');
    }
};
  
export default multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, 
    fileFilter
});