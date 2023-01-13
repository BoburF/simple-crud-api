import { createServer, request, RequestOptions } from "node:http"
import { IncomingMessage, ServerResponse } from 'http';
import { cpus } from "node:os"
import { config } from "dotenv"
import normalizePort from './utils/normalizePort';
import getBody from './utils/body';
import UserInterface from './interfaces/user';
import {parseBody, parseBodyForMulti} from "./utils/parseBody";

config()

const balancer = () => {
  let cpuTotal = 1
  return createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (cpuTotal >= cpus().length + 1) {
        cpuTotal = 1
      }

      const reqOptions: RequestOptions = {
        port: normalizePort(process.env.PORT) + cpuTotal,
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

      requestToSer.end(() => cpuTotal += 1);

    } catch (error) {
      console.log(error);
      res.statusCode = 500
      res.end("Something went wrong")
    }
  })
}

export default balancer