const prisma = require("./prisma/prisma");
class User {
    static async createUser(username, email, password) {
        return prisma.user.create({
            data: {
                username,
                email,
                password,
            },
        });
    }

    static async findUserByUsername(username) {
        return prisma.user.findUnique({
            where: {
                username,
            },
        });
    }
}

module.exports = user;
