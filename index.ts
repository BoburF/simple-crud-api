import { createServer, IncomingMessage, ServerResponse } from "node:http"
import { config } from "dotenv"
import cluster, { Cluster } from "node:cluster"
import {cpus} from "node:os"

// dotenv
config()

let PORT = Number(process.env.PORT) || 5000

if (cluster.isPrimary) {

    for (let i = 0; i < cpus().length; i++) {
        PORT += 1
        cluster.fork({PORT})
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
        console.log("Let's fork another worker!");
        cluster.fork();
    });

} else {
    const app = createServer((req: IncomingMessage, res: ServerResponse) => {
        res.end(JSON.stringify({id: process.pid, number: PORT}))
    })

    app.listen(+PORT, () => {
        console.log("Server working on: " + PORT);
    })
}