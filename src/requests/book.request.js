import Joi from 'joi';

export default {
    create:  Joi.object().keys({
        title: Joi.string().required().min(3),
        author: Joi.string().required().min(3),
        price: Joi.number().required().min(3),
        description: Joi.string().required().min(3),
        stock: Joi.number().required().min(3),
        image: Joi.string().required().min(3),
    })
}