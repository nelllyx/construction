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
}

module.exports = new UserRepository();
