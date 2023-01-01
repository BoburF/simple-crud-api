function fixUrl(url = "/") {
    const fixedUrl = url
    if(fixedUrl[fixedUrl.length - 1] === "/"){
        fixedUrl.replace("/", "")
    }
    return fixedUrl
}

export default fixUrl