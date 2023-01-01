import UserInterface from "../interfaces/user.js"
import ResponseInterface from '../interfaces/response.js';

const dbUsers: UserInterface[] = []

class UsersDb {
    find(): ResponseInterface{
        return {msg: JSON.stringify(dbUsers), status: 200}
    }
}

export default new UsersDb