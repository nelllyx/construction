const User = require('../model/userSchema');

class UserRepository {

    async create(userData) {
        return User.create(userData);
    }

    async findByEmail(email) {

        return await User.findOne({ where: { email } });
    }

    async findAll() {
        return await User.findAll();
    }

     async findById (id)  {

        return await User.findByPk(id);

    }

    async findUserByIdAndRole (id, role) {

        return await  User.findOne({where: {id: id, role:role}})
    }


    async findProjectById(id){

        return await  User.findOne({where: {id: id}})
    }



}

module.exports = new UserRepository();
