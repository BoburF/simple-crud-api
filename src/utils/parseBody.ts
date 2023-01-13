import { parse } from 'node:querystring';

function parseBody(body: string) {
    try {
        const validated = JSON.parse(body)
        return validated
    } catch (error) {
        return false
    }
}

function parseBodyForMulti(body: string) {
    try {
        let fixedUserWithParse = parseBody(body)

    if (!fixedUserWithParse) {
        fixedUserWithParse = parse(body)
        fixedUserWithParse.hobbies = JSON.parse(fixedUserWithParse.hobbies)
    }
    return fixedUserWithParse
    } catch (error) {
     return false   
    }
}

export {parseBody, parseBodyForMulti}