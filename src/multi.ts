import cluster from "node:cluster"
import { cpus } from "node:os";
import normalizePort from './utils/normalizePort';
import avarageServer from './index';
import balancer from "./multiConrol";

function multiServer() {
    const port: number = normalizePort(process.env.PORT) || 5000
    if (cluster.isPrimary) {
        let cpusCount: number = cpus().length;
    
        for (let i = 0; i < cpusCount; i++) cluster.fork({PORT: port + i + 1});
    
        cluster.on('exit', (worker, code) => {
            console.log(
                `Worker ${worker.id} finished. Exit code: ${code}`
            );
            cluster.fork()
        })

        balancer().listen(port, () => {
            console.log("Primary server port: " + port);
        })

    }else{
        avarageServer().listen(port, () => {
            console.log("Server working on: " + port);
        })
    }
}

export default multiServer