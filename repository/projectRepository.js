const Project = require('../model/projectSchema')
const User = require("../model/userSchema")
const Bid =  require("../model/bidSchema")
class ProjectRepository {


    async create(userData) {
        return Project.create(userData);
    }

    async findProjectById(projectId){
        return await Project.findByPk(projectId, {
            include: [
                {
                    model: Bid,
                    as: 'bids',
                    include: [{
                        model: User,
                        as: 'contractor',
                        attributes: ['firstName', 'lastName', 'email', 'phone']
                    }],
                },
                {
                    model: User,
                    as: 'homeowner',
                    attributes: ['firstName', 'lastName', 'email', 'phone']
                }
            ],

        });


    }

    async getProjectByHomeownerIdAndName(homeownerId, title){
        return await Project.findOne({where: { homeownerId, title }})
    }

}

module.exports = new ProjectRepository()