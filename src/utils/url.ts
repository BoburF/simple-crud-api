function fixUrl(url = "/") {
    let fixedUrl = url
    if(fixedUrl[fixedUrl.length - 1] === "/"){
        fixedUrl = fixedUrl.slice(0, fixedUrl.length - 1)
    }
    return fixedUrl
}

export default fixUrl