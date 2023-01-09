function parametr(args: string[]) {
    const param = args
    for (let i = 0; i < param.length; i++) {
        const element = param[i];
        if(element === "--only"){
            return element
        }else if(element === "---multi"){
            return element
        }
    }
    return "--only"
}

export default parametr