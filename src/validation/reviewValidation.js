import Joi from 'joi';

const validateReview = (data) => {
    const schema = Joi.object({
        book: Joi.string().required(),
        rating: Joi.number().min(1).max(5).required(),
        review: Joi.string().max(500).required()
    });
    return schema.validate(data);
};

export default validateReview;