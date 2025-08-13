const Bid = require('../model/bidSchema')

class BidRepository {

    async findOrCreateBid(projectId, contractorId, price, duration){

        return await Bid.findOrCreate({
            where: { projectId, contractorId },
            defaults: { price, duration },

    })

    }

    async updateBid(price, duration){

        return await Bid.update({ price, duration });
    }

}


module.exports = new BidRepository()