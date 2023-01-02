import { IncomingMessage } from "http";

async function getBody(req: IncomingMessage) {
    try {
        const buffers = [] as any;
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        return Buffer.concat(buffers).toString();
    } catch (error) {
        return ""
    }
}

export default getBody