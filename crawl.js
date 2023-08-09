const {JSDOM} = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`actively crawling: ${currentURL}`)

    try {
        const response = await fetch(currentURL)
        
        if (response.status > 399) {
            console.log(`Error on fetch with status code: ${response.status} on page ${currentURL}`)
            return 
        }

        const contentType = response.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`Non-HTML response, content-type: ${contentType}, on page ${currentURL}`)
        }

        console.log(await response.text())
    } catch(err) {
        console.log(`Error in fetch: ${err.message} on page ${currentURL}`)
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    linkElements.forEach((item) => {
        if (item.href.slice(0,1) === '/') {
                try {
                    const urlObj = new URL(`${baseURL}${item.href}`)
                    urls.push(urlObj.href)
                } catch(err) {
                    console.log(`error with relative url: ${err.message}`)
                }
            } else { 
                try {
                    const urlObj = new URL(`${item.href}`)
                    urls.push(urlObj.href)
                } catch(err) {
                    console.log(`error with relative url: ${err.message}`)
                } 
            }
    })
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}