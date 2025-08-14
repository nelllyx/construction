const Bid = require('../model/bidSchema')

class BidRepository {

    async findOrCreateBid(projectId, contractorId, price, duration){

        const existingBid = await Bid.findOne({where: { projectId, contractorId }});

        if (existingBid) {
           return  await existingBid.update({ price, duration });

        } else {
            return await Bid.create({
                projectId,
                contractorId,
                price,
                duration
            })
        }

    }

    async updateBid(price, duration){

        return await Bid.update({ price, duration });
    }

}


module.exports = new BidRepository()