function parseBody(body: string) {
    try {
        const validated = JSON.parse(body)
        return validated
    } catch (error) {
        return false
    }
}

export default parseBody