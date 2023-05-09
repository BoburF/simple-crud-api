import { createServer, IncomingMessage, ServerResponse } from "node:http"
import fixUrl from "./utils/url"
import UsersDb from "./DataBase/dbUsers"
import ResponseInterface from "./interfaces/response"
import getBody from "./utils/body"

const avarageServer = () => {
    return createServer(async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const url = fixUrl(req.url)
            const urlArray = url?.split("/") || []
            const idFromUrl = urlArray[3]

            let response: ResponseInterface = { msg: "Resource not found", status: 404 };

            if (url === "/api/users" && req.method === "GET") {
                response = await UsersDb.find()
            } else if (url === "/api/users" && req.method === "POST") {
                const body = await getBody(req)
                response = await UsersDb.addNew(body)
            } else if (urlArray.length === 4 && req.method === "GET") {
                response = await UsersDb.findOne(idFromUrl)
            } else if (urlArray.length === 4 && req.method === "PUT") {
                const body = await getBody(req)
                response = await UsersDb.update(body, idFromUrl)
            } else if (urlArray.length === 4 && req.method === "DELETE") {
                response = await UsersDb.deleteOne(idFromUrl)
            }

            res.setHeader('Content-Type', 'application/json')
            res.statusCode = response.status
            res.end(response.msg)
        } catch (error) {
            res.statusCode = 500
            res.end("Something went wrong")
        }
    })

}

export default avarageServer