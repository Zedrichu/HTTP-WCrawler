const { notEqual } = require('assert')
const {JSDOM} = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    
    const baseURLobj = new URL(baseURL)
    const currentURLobj = new URL(currentURL)
    
    if (baseURLobj.hostname !== currentURLobj.hostname) {
        return pages
    }
    
    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }
    
    pages[normalizedCurrentURL] = 1
    console.log(`Actively crawling: ${currentURL}`)
    
    
    try {
        const response = await fetch(currentURL)
        
        if (response.status > 399) {
            console.log(`Error on fetch with status code: ${response.status} on page ${currentURL}`)
            return  pages
        }

        const contentType = response.headers.get("content-type")

        if (!contentType.includes("text/html")) {
            console.log(`Non-HTML response, content-type: ${contentType}, on page ${currentURL}`)
            return pages
        }

        const htmlBody = await response.text()
        
        nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
        return pages

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