import { config } from "dotenv"
import parametr from "./src/utils/params";
import multiServer from "./src/multi";
import normalizePort from './src/utils/normalizePort';
import avarageServer from './src/index';

config()

const param: string = parametr(process.argv)

const port: number = normalizePort(process.env.PORT) || 5000
if(param === "---multi"){
    multiServer()
}else{
    avarageServer().listen(port, () => {
        console.log("Server working on: " + port);
    })
}

