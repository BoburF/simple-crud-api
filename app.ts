import {createServer, IncomingMessage, ServerResponse} from "node:http"
import DataBase from "./src/db/dataBase"

const db = new DataBase()

const routing: any = {
    "/api/users": () => {
        return db.find()
    }
}

const app = createServer((req: IncomingMessage, res: ServerResponse) => {
    const url = req.url || ""
    const route = routing[url]

    if(!route){
        res.statusCode = 404
        res.write(JSON.stringify({
            message: "URL desn't exist",
            solving: `Back to the first URL: ${req.headers.host}`
        }))
        res.end()
    }else{
        const response = route()
        res.statusCode = response.status
        res.setHeader("Content-Type", "text/plain")
        res.write(response.msg)
        res.end()
    }
})

const port = 4000
app.listen(port, () => {
    console.log("Server working on: " + port);
})