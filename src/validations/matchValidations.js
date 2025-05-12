const { body, param, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Errores de validación', errors: errors.array() });
  }
  next();
};

const createMatchValidations = [
  body('userId')
    .notEmpty().withMessage('El ID del usuario es obligatorio')
    .isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'),
  body('player1')
    .notEmpty().withMessage('El jugador 1 es obligatorio')
    .isMongoId().withMessage('El ID del jugador 1 debe ser un ObjectId válido'),
  body('player2')
    .notEmpty().withMessage('El jugador 2 es obligatorio')
    .isMongoId().withMessage('El ID del jugador 2 debe ser un ObjectId válido'),
  body('player3')
    .notEmpty().withMessage('El jugador 3 es obligatorio')
    .isMongoId().withMessage('El ID del jugador 3 debe ser un ObjectId válido'),
  body('player4')
    .notEmpty().withMessage('El jugador 4 es obligatorio')
    .isMongoId().withMessage('El ID del jugador 4 debe ser un ObjectId válido'),
  body('date')
    .notEmpty().withMessage('La fecha del partido es obligatoria')
    .isISO8601().withMessage('La fecha debe ser una fecha válida en formato ISO 8601 (ej. 2023-10-15)'),
  body('time')
    .notEmpty().withMessage('La hora del partido es obligatoria')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora debe tener el formato HH:mm (24 horas)'),
  body('city')
    .notEmpty().withMessage('La ciudad es obligatoria')
    .isString().withMessage('La ciudad debe ser una cadena')
    .trim(),
  body('weather')
    .optional()
    .isString().withMessage('El clima debe ser una cadena')
    .trim(),
  body('rainWarning')
    .optional()
    .isBoolean().withMessage('La advertencia de lluvia debe ser un valor booleano'),
  body('results.set1.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set1.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set2.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set2.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set3.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set3.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (derecha) debe ser un número entero mayor o igual a 0'),
  body('rivalStyle')
    .optional()
    .isString().withMessage('El estilo del rival debe ser una cadena')
    .trim(),
  body('comments')
    .optional()
    .isString().withMessage('Los comentarios deben ser una cadena')
    .trim(),
  body('isSaved')
    .optional()
    .isBoolean().withMessage('El estado de guardado debe ser un valor booleano'),
  body('statsCalculated')
    .optional()
    .isBoolean().withMessage('El estado de estadísticas calculadas debe ser un valor booleano'),
  body('result')
    .optional()
    .isIn(['won', 'lost', 'draw', 'pending']).withMessage('El resultado debe ser "won", "lost", "draw" o "pending"'),
];

const updateMatchValidations = [
  body('userId')
    .optional()
    .isMongoId().withMessage('El ID del usuario debe ser un ObjectId válido'),
  body('player1')
    .optional()
    .isMongoId().withMessage('El ID del jugador 1 debe ser un ObjectId válido'),
  body('player2')
    .optional()
    .isMongoId().withMessage('El ID del jugador 2 debe ser un ObjectId válido'),
  body('player3')
    .optional()
    .isMongoId().withMessage('El ID del jugador 3 debe ser un ObjectId válido'),
  body('player4')
    .optional()
    .isMongoId().withMessage('El ID del jugador 4 debe ser un ObjectId válido'),
  body('date')
    .optional()
    .isISO8601().withMessage('La fecha debe ser una fecha válida en formato ISO 8601 (ej. 2023-10-15)'),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('La hora debe tener el formato HH:mm (24 horas)'),
  body('city')
    .optional()
    .isString().withMessage('La ciudad debe ser una cadena')
    .trim(),
  body('weather')
    .optional()
    .isString().withMessage('El clima debe ser una cadena')
    .trim(),
  body('rainWarning')
    .optional()
    .isBoolean().withMessage('La advertencia de lluvia debe ser un valor booleano'),
  body('results.set1.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set1.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set2.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set2.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set3.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set3.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (derecha) debe ser un número entero mayor o igual a 0'),
  body('rivalStyle')
    .optional()
    .isString().withMessage('El estilo del rival debe ser una cadena')
    .trim(),
  body('comments')
    .optional()
    .isString().withMessage('Los comentarios deben ser una cadena')
    .trim(),
  body('isSaved')
    .optional()
    .isBoolean().withMessage('El estado de guardado debe ser un valor booleano'),
  body('statsCalculated')
    .optional()
    .isBoolean().withMessage('El estado de estadísticas calculadas debe ser un valor booleano'),
  body('result')
    .optional()
    .isIn(['won', 'lost', 'draw', 'pending']).withMessage('El resultado debe ser "won", "lost", "draw" o "pending"'),
];

const matchIdValidations = [
  param('id')
    .isMongoId().withMessage('El ID debe ser un ObjectId válido de MongoDB'),
];

const saveMatchValidations = [
  param('id')
    .isMongoId().withMessage('El ID debe ser un ObjectId válido de MongoDB'),
  body('isSaved')
    .optional()
    .isBoolean().withMessage('El estado de guardado debe ser un valor booleano'),
  body('statsCalculated')
    .optional()
    .isBoolean().withMessage('El estado de estadísticas calculadas debe ser un valor booleano'),
  body('result')
    .optional()
    .isIn(['won', 'lost', 'draw', 'pending']).withMessage('El resultado debe ser "won", "lost", "draw" o "pending"'),
  body('results.set1.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set1.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 1 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set2.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set2.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 2 (derecha) debe ser un número entero mayor o igual a 0'),
  body('results.set3.left')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (izquierda) debe ser un número entero mayor o igual a 0'),
  body('results.set3.right')
    .optional()
    .isInt({ min: 0 }).withMessage('El resultado del set 3 (derecha) debe ser un número entero mayor o igual a 0'),
];

module.exports = {
  validateResult,
  createMatchValidations,
  updateMatchValidations,
  matchIdValidations,
  saveMatchValidations,
};