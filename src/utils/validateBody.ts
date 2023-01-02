function validate(body: { [index: string]: any; }) {
    const required: any[] = []
    const schema: { [index: string]: any; } = {
        username: (val: any) => {
            const type: string = Number.isNaN(Number(val)) ? "string" : "number"
            if(type === "string"){
                if(val.length > 2){
                    return true
                }else{
                    required.push("Username is required value must be greater than 2 symbols")
                }
            }else{
                required.push("Username is required or must be string")
            }
        },
        age: (val: any) => {
            const type: string = Number.isNaN(parseInt(val, 10)) ? "string" : "number"
            if(type === "number"){
                if(val > 0){
                    return true
                }else{
                    required.push("Age is required value must be greater than 0")
                }
            }else{
                required.push("Age is required")
            }
        },
        hobbies: (val: any) => {
            const type: boolean = Array.isArray(val)
            if(type && val.length){
                const filtered = val.filter((item: any) => typeof item === "string")
                if(filtered.length){
                    return true
                }else{
                    required.push("Hobbies is required value must be string")
                }
            }else{
                required.push("Hobbies is required")
            }
        },
    }

    for(let key in schema){
        const valid = schema[key]
        valid(body[key])
    }

    return required
}

export default validate