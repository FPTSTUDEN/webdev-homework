import { matchedData, validationResult } from 'express-validator';

const validationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  req.body = matchedData(req, { locations: ['body'] });
  req.params = matchedData(req, { locations: ['params'] });
  next();
};

const requireOneField = (fields) => (req, res, next) => {
  if (!fields.some((field) => req.body[field] !== undefined)) {
    return res.status(400).json({
      errors: [{ msg: 'At least one field is required', path: 'body' }],
    });
  }
  next();
};

export { validationErrors, requireOneField };
