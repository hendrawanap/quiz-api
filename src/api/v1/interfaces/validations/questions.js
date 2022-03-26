const { Readable } = require('stream');
const Joi = require('joi');

const TOPICS = {
  FOOD: 'Makanan',
  ICON: 'Ikon',
  TOURISM: 'Wisata',
};

const IndexValidator = {
  validate: ({ topic }) => {
    const result = { isValid: true, message: 'Valid' };

    if (!topic) {
      return result;
    }

    const schema = Joi.string().valid(...Object.values(TOPICS)).required();
    const validation = schema.validate(topic);

    if (Joi.isError(validation.error)) {
      result.isValid = false;
      result.message = `Invalid topic provided: ${topic}`;
      return result;
    }

    return result;
  },
};

const ShowValidator = {
  validate: ({ id }) => {
    const result = { isValid: true, message: 'Valid' };

    if (!id) {
      result.isValid = false;
      result.message = 'Id is not provided';
      return result;
    }

    const schema = Joi.string().required();
    const validation = schema.validate(id);

    if (Joi.isError(validation.error)) {
      result.isValid = false;
      result.message = 'Id is not string';
      return result;
    }

    return result;
  },
};

const StoreValidator = {
  validate: ({ imgFile, json }) => {
    const result = { isValid: true, message: 'Valid' };

    if (imgFile && !(imgFile instanceof Readable)) {
      result.isValid = false;
      result.message = 'Invalid image file';
      return result;
    }

    if (!json) {
      result.isValid = false;
      result.message = 'No json data provided';
      return result;
    }

    const schema = Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
      choices: Joi.array().items(Joi.string()).required(),
      topic: Joi.string().required(),
    });

    let validation;

    try {
      validation = schema.validate(JSON.parse(json));
    } catch (error) {
      result.isValid = false;
      result.message = 'Cannot parse JSON data';
      return result;
    }

    if (Joi.isError(validation.error)) {
      const errorMessage = validation.error.message;
      result.isValid = false;
      result.message = `Invalid format: ${errorMessage.replace(/"/g, '')}`;
      return result;
    }

    return result;
  },
};

const UpdateValidator = {
  validate: ({ imgFile, json, id }) => {
    const result = { isValid: true, message: 'Valid' };

    if (!id) {
      result.isValid = false;
      result.message = 'Id is not provided';
      return result;
    }

    if (imgFile && !(imgFile instanceof Readable)) {
      result.isValid = false;
      result.message = 'Invalid image file';
      return result;
    }

    if (!json) {
      result.isValid = false;
      result.message = 'No json data provided';
      return result;
    }

    const schema = Joi.object({
      id: Joi.string().required(),
      question: Joi.string().required(),
      answer: Joi.string().required(),
      choices: Joi.array().items(Joi.string()).required(),
      topic: Joi.string().required(),
    });

    let validation;

    try {
      validation = schema.validate({ id, ...JSON.parse(json) });
    } catch (error) {
      result.isValid = false;
      result.message = 'Cannot parse JSON data';
      return result;
    }

    if (Joi.isError(validation.error)) {
      const errorMessage = validation.error.message;
      result.isValid = false;
      result.message = `Invalid format: ${errorMessage.replace(/"/g, '')}`;
      return result;
    }

    return result;
  },
};

const DestroyValidator = {
  validate: ({ id }) => {
    const result = { isValid: true, message: 'Valid' };

    if (!id) {
      result.isValid = false;
      result.message = 'Id is not provided';
      return result;
    }

    const schema = Joi.string().required();
    const validation = schema.validate(id);

    if (Joi.isError(validation.error)) {
      result.isValid = false;
      result.message = 'Id is not string';
      return result;
    }

    return result;
  },
};

module.exports = {
  IndexValidator,
  ShowValidator,
  StoreValidator,
  UpdateValidator,
  DestroyValidator,
};
