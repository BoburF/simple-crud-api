import UserInterface from "../interfaces/user"
import ResponseInterface from '../interfaces/response';
import { v4, validate } from "uuid";
import {parseBody} from "../utils/parseBody";
import { parse } from "node:querystring"
import { validateBody, validatePeaceBody } from "../utils/validateBody";

const userDB:UserInterface[] = []
class UsersDb {
    async find(): Promise<ResponseInterface> {
        try {
            const users = JSON.stringify(userDB)
            return { msg: users, status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    async addNew(user: string): Promise<ResponseInterface> {
        try {
            let fixedUserWithParse = parseBody(user)

            if (!fixedUserWithParse) {
                fixedUserWithParse = parse(user)
                fixedUserWithParse.hobbies = JSON.parse(fixedUserWithParse.hobbies)
            }

            if (!fixedUserWithParse) {
                return { msg: "User is required user must be JSON or urlencoded", status: 400 }
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

            userDB.push(userBody)

            return { msg: JSON.stringify(userBody), status: 201 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    async findOne(id: string): Promise<ResponseInterface> {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }

            const user = userDB.find((user: UserInterface) => user.id === id)

            if (!user) {
                return { msg: "User not exist", status: 404 }
            }

            return { msg: JSON.stringify(user), status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    async update(bodyPeace: any, id: string): Promise<ResponseInterface> {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }
            let index = 0
            const user: UserInterface | undefined = userDB.find((user: UserInterface, idx: number) => {
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

            userDB[index] = userBody
            return { msg: JSON.stringify(userBody), status: 200 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }

    async deleteOne(id: string): Promise<ResponseInterface> {
        try {
            const idValid = validate(id)

            if (!idValid) {
                return { msg: "User id is not valid", status: 400 }
            }
            const userIndex = userDB.findIndex((user: UserInterface) => user.id === id)

            if (userIndex === -1) {
                return { msg: "User not exist", status: 404 }
            }

            const user = userDB.splice(userIndex, 1)

            return { msg: `User deleted: ${JSON.stringify(user[0])}`, status: 204 }
        } catch (error) {
            return { msg: "Something went wrong", status: 500 }
        }
    }
}

export default new UsersDb