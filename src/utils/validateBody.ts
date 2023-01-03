const schema: { [index: string]: any; } = {
    username: (val: any) => {
        const type: string = typeof val
        if(type === "string"){
            if(val.length <= 2){
                return("Username is required value must be greater than 2 symbols")
            }
        }else{
            return("Username is required or must be string")
        }
    },
    age: (val: any) => {
        const type: string = Number.isNaN(Number(val)) ? "string" : "number"
        if(type === "number"){
            if(val <= 0){
                return ("Age is required value must be greater than 0")
            }
        }else{
            return ("Age is required or must be number")
        }
    },
    hobbies: (val: any) => {
        const type: boolean = Array.isArray(val)
        if(type && val.length){
            const filtered = val.filter((item: any) => typeof item === "string")
            if(!filtered.length){
                return("Hobbies is required value must be string")
            }
        }else{
            return("Hobbies is required")
        }
    },
}

function validateBody(body: { [index: string]: any}) {
    const required: any[] = []
    for(let key in schema){
        const valid = schema[key]
        const result = valid(body[key])
        if(result){
            required.push(result)
        }
    }
    return required
}

function validatePeaceBody(bodyPeace: any) {
    const required: any[] = []
    const bosyPeaceParsed = JSON.parse(bodyPeace)
    for(let key in bosyPeaceParsed){
        const valid = schema[key]
        const result = valid(bosyPeaceParsed[key])
        if(result){
            required.push(result)
        }
    }
    return required
}

export {validateBody, validatePeaceBody}