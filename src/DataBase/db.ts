import UserInterface from "../interfaces/user"
import ResponseInterface from '../interfaces/response';
import { v4 } from "uuid";
import parseBody from "../utils/parseBody";
import { parse } from "node:querystring"
import validate from "../utils/validateBody";

const dbUsers: UserInterface[] = []

class UsersDb {

    find(): ResponseInterface {
        return { msg: JSON.stringify(dbUsers), status: 200 }
    }

    addNew(user: string): ResponseInterface {
        let fixedUserWithParse = parseBody(user)

        if (!fixedUserWithParse) {
            fixedUserWithParse = parse(user)
        }

        if(!fixedUserWithParse){
            return { msg: "User is required or must be JSON", status: 400 }
        }

        const userBody = {
            username: fixedUserWithParse.username,
            age: fixedUserWithParse.age,
            hobbies: JSON.parse(fixedUserWithParse.hobbies),
            id: v4()
        }
        const required: ResponseInterface[] = validate(userBody)
        
        if(required.length){
            return {msg: JSON.stringify(required), status: 400}
        }

        dbUsers.push(userBody)
        return { msg: JSON.stringify(fixedUserWithParse), status: 201 }
    }
}

export default new UsersDb