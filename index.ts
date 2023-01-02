import { createServer } from "node:http"
import { config } from "dotenv"
import fixUrl from "./src/utils/url"
import UsersDb from "./src/DataBase/db"
import ResponseInterface from "./src/interfaces/response"
import validateBody from "./src/utils/parseBody"
import getBody from "./src/utils/body"
import { IncomingMessage, ServerResponse } from 'http';

config()

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = fixUrl(req.url)
    const urlArray = url?.split("/") || []
    const idFromUrl = urlArray[urlArray?.length - 1]
    
    let response: ResponseInterface = {msg: "Resource not found", status: 404};
    
    if(url === "/api/users" && req.method === "GET"){
        response = UsersDb.find()
    }else if(url === "/api/users" && req.method === "POST"){
        const body = await getBody(req)
        response = UsersDb.addNew(body)
    }

    res.setHeader('Content-Type', 'application/json')
    res.statusCode = response.status
    res.end(response.msg)
})

const port: number = normalizePort(process.env.PORT) || 5000
server.listen(port, () => {
    console.log("Server working on: " + port);
})

function normalizePort(val: any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}