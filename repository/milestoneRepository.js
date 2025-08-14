const Milestone = require("../model/milestone")


class MilestoneRepository {

  async createProjectMilestone (mileStoneData){

      return Milestone.create(mileStoneData)

  }

  async findProjectMilestone(projectId){
      return await Milestone.findAll({where: {projectId}})
  }


}


module.exports = new MilestoneRepository()