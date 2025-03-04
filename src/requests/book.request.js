import Joi from 'joi';

export default {
    create:  Joi.object().keys({
        title: Joi.string().required().min(3),
        author: Joi.string().required().min(3),
        price: Joi.number().required().min(3),
        description: Joi.string().required().min(3),
        stock: Joi.number().required().min(3),
        image: Joi.any()
    }),
    update:  Joi.object().keys({
        title: Joi.string().min(3),
        author: Joi.string().min(3),
        price: Joi.number().min(3),
        description: Joi.string().min(3),
        stock: Joi.number().min(3),
        image: Joi.any()
    })
}