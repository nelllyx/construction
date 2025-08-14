const Milestone = require("../model/milestone")


class MilestoneRepository {

  async createProjectMilestone (mileStoneData){

      return Milestone.create(mileStoneData)

  }

  async findProjectMilestone(projectId){

      if (!projectId) {
          throw new Error('projectId is required to find milestones');
      }

      return await Milestone.findAll({where: {projectId}})
  }


}


module.exports = new MilestoneRepository()