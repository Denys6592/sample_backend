const Proposal = require('../models/Proposal');

exports.updateProposalStatus = async (req, res) => {
    try {
        const { proposalId, status } = req.body;

        const proposal = Proposal.findById(proposalId);

        if (!proposal) {
            res.status(404).json({ message: 'Can not find the proposal with invalid id.' })
        }
        proposal.status = status;
        await proposal.save();

        res.status(200).json({ message: 'Proposal status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update proposal status.' });
    }
}