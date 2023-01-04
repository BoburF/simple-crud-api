import UserInterface from "../interfaces/user"
import ResponseInterface from '../interfaces/response';
import { v4, validate } from "uuid";
import parseBody from "../utils/parseBody";
import { parse } from "node:querystring"
import { validateBody, validatePeaceBody } from "../utils/validateBody";

const dbUsers: UserInterface[] = []

class UsersDb {

    find(): ResponseInterface {
        try {
            const users = JSON.stringify(dbUsers)
            return { msg: users, status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    addNew(user: string): ResponseInterface {
        try {
            let fixedUserWithParse = parseBody(user)

            if (!fixedUserWithParse) {
                fixedUserWithParse = parse(user)
                fixedUserWithParse.hobbies = JSON.parse(fixedUserWithParse.hobbies)
            }

            if (!fixedUserWithParse) {
                return { msg: "User is required or must be JSON", status: 400 }
            }
            const userBody = {
                username: fixedUserWithParse.username,
                age: Number(fixedUserWithParse.age),
                hobbies: fixedUserWithParse.hobbies,
                id: v4()
            }

            const required: ResponseInterface[] = validateBody(userBody)

            if (required.length) {
                return { msg: JSON.stringify(required), status: 400 }
            }

            dbUsers.push(userBody)
            return { msg: JSON.stringify(userBody), status: 201 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    findOne(id: string): ResponseInterface {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }

            const user = dbUsers.find((user: UserInterface) => user.id === id)

            if (!user) {
                return { msg: "User not exist", status: 404 }
            }

            return { msg: JSON.stringify(user), status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    update(bodyPeace: any, id: string) {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }

            let index = 0
            const user: UserInterface | undefined = dbUsers.find((user: UserInterface, idx: number) => {
                index = idx
                return user.id === id
            })

            if (!user) {
                return { msg: "User not exist", status: 404 }
            }

            const required: ResponseInterface[] = validatePeaceBody(bodyPeace)

            if (required.length) {
                return { msg: JSON.stringify(required), status: 400 }
            }

            const parsedBody = JSON.parse(bodyPeace)

            const userBody = {
                username: parsedBody.username || user.username,
                age: Number(parsedBody.age || user.age),
                hobbies: parsedBody.hobbies || user.hobbies,
                id: user.id
            }

            dbUsers[index] = userBody

            return { msg: JSON.stringify(userBody), status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    deleteOne(id: string) {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }

            const userIndex = dbUsers.findIndex((user: UserInterface) => user.id === id)

            if (userIndex === -1) {
                return { msg: "User not exist", status: 404 }
            }

            const user = dbUsers.splice(userIndex, 1)

            return { msg: `User deleted: ${JSON.stringify(user[0])}`, status: 204 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }
}

export default new UsersDb