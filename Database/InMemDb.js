const jwt = require('jsonwebtoken');
//TODO: JWT token bij de user in de database zetten
// en dan hier de result filteren van properties die niet in de frontent getoond mogen worden.
const _userDb = []
let JWTtoken = null;
const timeout = 500
let id = 0

module.exports = {
    createUser(user, callback) {
        console.log('createUser called')

        setTimeout(() => {
            if (
                user &&
                user.emailAdress &&
                _userDb.filter((item) => item.emailAdress === user.emailAdress).length > 0
            ) {
                const error = 'A user with this emailAdress already exists.'
                console.log(error)

                callback(error, undefined)
            } else {

                const userToAdd = {
                    id: id++,
                    ...user,
                }
                _userDb.push(userToAdd)

                callback(undefined, userToAdd)
            }
        }, timeout)
    },

    login(emailAdress, password, callback) {
        console.log('login called!');

        setTimeout(() => {
            if (
                _userDb.filter((item) => item.emailAdress === emailAdress &&
                    item.password === password).length > 0
            ) {
                JWTtoken = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60),
                    data: {
                        emailAdress,
                        password
                    }
                }, 'secret');

                let user = _userDb.find((item) => item.emailAdress === emailAdress);

                console.log('login successful');
                callback(undefined, user);
            } else if (
                _userDb.filter((item) => item.emailAdress === emailAdress).length <= 0
            ) {
                const error = 'email not found!'
                console.log(error);

                callback(error, undefined);
            } else if (
                _userDb.filter((item) => item.password === password).length <= 0
            ) {
                const error = 'password not found!'
                console.log(error);

                callback(error, undefined);
            } else {
                const error = 'unknown error occurred!'
                console.log(error);

                callback(error, undefined);
            }
        });
    },

    personalProfile(callback) {
        console.log('personalProfile called!');

        setTimeout( () => {

        })
    },

    listUsers(callback) {
        console.log('listUsers called')
        setTimeout(() => {
            callback(undefined, _userDb)
        }, timeout)
    },

    getUserById(userId, callback) {
        console.log('getUser called')
        setTimeout(() => {

            if (_userDb.filter((item) => item.id == userId).length > 0) {
                console.log('User found for userId: ' + userId)
                let user = _userDb.find((item) => item.id == userId)

                callback(undefined, user)
            } else {
                const error = 'No user found for corresponding userId.'
                console.log(error)

                callback(error, undefined)
            }

        }, timeout)
    },

    updateUser(userId, user, callback) {
        console.log('updateUser called')

        setTimeout(() => {
            if (_userDb.filter((item) => item.id == userId).length > 0) {
                let index = _userDb.findIndex(item => item.id == userId);

                let result = _userDb[index];

                if (user.id != result.id) {
                    const error = 'User is allowed to edit id.'
                    console.log(error)

                    callback(error, undefined)
                } else if (_userDb.filter((item) => item.emailAdress == user.emailAdress).length > 0) {
                    const error = 'Emailadress already exists.'
                    console.log(error)

                    callback(error, undefined)
                } else {
                    _userDb[index] = user;

                    callback(undefined, user);
                }
            } else {
                const error = 'User is not found.'
                console.log(error)

                callback(error, undefined)
            }
        }, timeout)
    },

    deleteUser(userId, callback) {
        console.log('deleteUser called')
        setTimeout(() => {

            if (_userDb.filter((item) => item.id == userId).length > 0) {

                let test = _userDb.filter((value, index, arr) => {
                    return value.id != userId;
                })

                _userDb.length = 0;
                _userDb.push.apply(_userDb, test);

                console.log(_userDb);

                if (_userDb.filter((item) => item.id == userId).length > 0) {
                    const error = 'Error deleting user.'
                    console.log(error)

                    callback(error, undefined);
                } else {
                    const success = 'User successful deleted.'
                    console.log(success)

                    callback(undefined, success);
                }

            } else {
                const error = 'No user found for corresponding userId.'
                console.log(error)

                callback(error, undefined)
            }
        }, timeout)
    },
}
