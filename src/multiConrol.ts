import { createServer, request, RequestOptions } from "node:http"
import { IncomingMessage, ServerResponse } from 'http';
import { cpus } from "node:os"
import { config } from "dotenv"
import normalizePort from './utils/normalizePort';
import getBody from './utils/body';

config()

const balancer = () => {
  let cpuTarget = 1
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (cpuTarget >= cpus().length + 1) {
        cpuTarget = 1
      }

      const reqOptions: RequestOptions = {
        port: normalizePort(process.env.PORT) + cpuTarget,
        path: req.url,
        method: req.method
      }

      const requestToSer = request(reqOptions);
      if (req.method === "POST" || req.method === "PUT") {
        const body = await getBody(req)
        requestToSer.write(body)
      }

      requestToSer.on("response", async (response) => {
        let resFromSer: string = await getBody(response)
        res.setHeader('Content-Type', 'application/json')
        res.statusCode = response.statusCode || 400
        res.end(resFromSer)
      })

      requestToSer.end(() => cpuTarget += 1);
    } catch (error) {
      console.log(error);
      res.statusCode = 500
      res.end("Something went wrong")
    }
  })
}

export default balancer