import { createServer } from "node:http"
import { config } from "dotenv"
import fixUrl from "./src/utils/url.js"
import UsersDb from "./src/DataBase/db.js"
import ResponseInterface from "./src/interfaces/response.js"

config()

const server = createServer(async (req, res) => {
    const url = fixUrl(req.url)
    const buffers = [] as any;
	for await (const chunk of req) {
		buffers.push(chunk);
	}
	const body = Buffer.concat(buffers).toString();
    const urlArray = url?.split("/") || []
    const idFromUrl = urlArray[urlArray?.length - 1]

    let response: ResponseInterface = {msg: "Resource not found", status: 404};

    if(url === "/api/users" && req.method === "GET"){
        response = UsersDb.find()
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