const Portfolio = require('../models/Portfolio');

exports.createPortfolio = async (req, res) => {
    try {
        const { filePath, title, description, skills } = req.body;
        const userId = req.uid;
        const newPortfolio = new Portfolio({ filePath, userId, title, description, skills });
        const savedPortfolio = await newPortfolio.save();
        res.status(201).json(savedPortfolio);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create portfolio', details: error.message });
    }
};

exports.getPortfolios = async (req, res) => {
    try {
        const userId = req.uid;
        const portfolios = await Portfolio.find({ freelancer: userId }).populate('freelancer');
        res.status(200).json(portfolios);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolios', details: error.message });
    }
};

exports.getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params;
        const portfolio = await Portfolio.findById(id).populate('freelancer');
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json(portfolio);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio', details: error.message });
    }
};

exports.updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedPortfolio = await Portfolio.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedPortfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json(updatedPortfolio);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update portfolio', details: error.message });
    }
};

exports.deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPortfolio = await Portfolio.findByIdAndDelete(id);
        if (!deletedPortfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json({ message: 'Portfolio deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete portfolio', details: error.message });
    }
};
