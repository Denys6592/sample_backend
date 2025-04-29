const express = require('express');
const router = express.Router();
const {
    createPortfolio,
    getPortfolios,
    getPortfolioById,
    updatePortfolio,
    deletePortfolio
} = require('../controllers/portfolioController');

router.post('/', createPortfolio);

router.get('/', getPortfolios);

router.get('/:id', getPortfolioById);

router.put('/:id', updatePortfolio);

router.delete('/:id', deletePortfolio);

module.exports = router;
