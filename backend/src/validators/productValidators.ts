import { body, param, query } from 'express-validator';

export const validateCreateProduct = [
  body('name')
    .notEmpty()
    .withMessage('Nome é obrigatório')
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('description')
    .notEmpty()
    .withMessage('Descrição é obrigatória')
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('price')
    .notEmpty()
    .withMessage('Preço é obrigatório')
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  
  body('category')
    .notEmpty()
    .withMessage('Categoria é obrigatória')
    .isIn(['doces', 'salgados', 'bebidas'])
    .withMessage('Categoria deve ser: doces, salgados ou bebidas'),
  
  body('imageUrl')
    .notEmpty()
    .withMessage('URL da imagem é obrigatória')
    .isURL()
    .withMessage('URL da imagem deve ser válida')
    .matches(/\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Imagem deve ser jpg, jpeg, png, webp ou gif'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo')
];

export const validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('ID do produto inválido'),
  
  body('name')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Nome deve ter entre 2 e 100 caracteres')
    .trim(),
  
  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Descrição deve ter entre 10 e 500 caracteres')
    .trim(),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Preço deve ser um número positivo'),
  
  body('category')
    .optional()
    .isIn(['doces', 'salgados', 'bebidas'])
    .withMessage('Categoria deve ser: doces, salgados ou bebidas'),
  
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('URL da imagem deve ser válida')
    .matches(/\.(jpg|jpeg|png|webp|gif)$/i)
    .withMessage('Imagem deve ser jpg, jpeg, png, webp ou gif'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Estoque deve ser um número inteiro positivo')
];

export const validateProductId = [
  param('id')
    .isMongoId()
    .withMessage('ID do produto inválido')
];

export const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Página deve ser um número positivo'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limite deve ser entre 1 e 100'),
  
  query('category')
    .optional()
    .isIn(['doces', 'salgados', 'bebidas', 'all'])
    .withMessage('Categoria deve ser: doces, salgados, bebidas ou all'),
  
  query('sortBy')
    .optional()
    .isIn(['name', 'price', 'createdAt', 'stock'])
    .withMessage('Ordenação deve ser: name, price, createdAt ou stock'),
  
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Ordem deve ser: asc ou desc')
];

export const validateUpdateStock = [
  param('id')
    .isMongoId()
    .withMessage('ID do produto inválido'),
  
  body('quantity')
    .notEmpty()
    .withMessage('Quantidade é obrigatória')
    .isInt({ min: 1 })
    .withMessage('Quantidade deve ser um número inteiro positivo'),
  
  body('operation')
    .notEmpty()
    .withMessage('Operação é obrigatória')
    .isIn(['add', 'subtract'])
    .withMessage('Operação deve ser: add ou subtract')
];
