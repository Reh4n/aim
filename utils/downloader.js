const axios = require('axios').default
const cheerio = require("cheerio")
const FormData = require("form-data")
const { UserAgent } = require("./index")
const Util = require('util')
const API_GUEST = 'https://api.twitter.com/1.1/guest/activate.json'
const API_TIMELINE = 'https://api.twitter.com/2/timeline/conversation/%s.json?tweet_mode=extended'
const AUTH = 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'

// Exports from other
const { ttdl } = require("./ttdl");
const { igProfile, insta } = require("./instagram");
const { search, yta, ytv } = require("./youtube");

/**
 * Get Twitter ID
 * 
 * @param {String} url Twitter URL
 * @returns {String} Twitter ID
 */
 const getID = (url) => {
    let regex = /twitter\.com\/[^/]+\/status\/(\d+)/
    let matches = regex.exec(url)
    return matches && matches[1]
}

/**
 * Get Twitter Info
 * 
 * @param {String} url Twitter URL
 */
const getInfo = async function (url) {
    const id = getID(url)
    if (id) {
        let token
        try {
            const response = await getToken()
            token = response.guest_token
        } catch (e) {
            throw new Error(e)
        }
        const response = await axios.get(Util.format(API_TIMELINE, id),{
            headers: {
                'x-guest-token': token,
                'authorization': AUTH
            }
        })
        if(!response.data['globalObjects']['tweets'][id]['extended_entities']) throw new Error('No media')
        const media = response.data['globalObjects']['tweets'][id]['extended_entities']['media']
        if (media[0].type === 'video') return {
            type: media[0].type,
            full_text: response.data['globalObjects']['tweets'][id]['full_text'],
            variants: media[0]['video_info']['variants']
        }
        if (media[0].type === 'photo') return {
            type: media[0].type,
            full_text: response.data['globalObjects']['tweets'][id]['full_text'],
            variants: media.map((x) => x.media_url_https)
        }
        if (media[0].type === 'animated_gif') return {
            type: media[0].type,
            full_text: response.data['globalObjects']['tweets'][id]['full_text'],
            variants: media[0]['video_info']['variants']
        }
    } else {
        throw new Error('Not a Twitter URL')
    }
}

async function getToken() {
    try {
        const response = await axios.post(API_GUEST, null, {
            headers: {
                'authorization': AUTH
            }
        })
        if (response.status === 200 && response.data) {
            return response.data
        }
    } catch (e) {
        throw new Error(e)
    }
}

const fbdl = async (url) => {
    // Get phpsessid from snapsave.app
    async function getToken() {
        let ua = UserAgent();
        const response = await axios.get("https://snapsave.app", {
            headers: {
                "accept": `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
                "accept-encoding": `gzip, deflate, br`,
                "accept-language": "id,en-US;q=0.9,en;q=0.8,es;q=0.7,ms;q=0.6",
                "sec-fetch-user": "?1",
                "User-Agent": ua
            }
        })
        return { sessid: response.headers["set-cookie"][0], ua };
    }

    const { sessid, ua } = await getToken()
    const form = new FormData()
    form.append("url", url)
    // Post to snapsave.app
    const { data } = await axios.post("https://snapsave.app/action.php", form, {
        headers: {
            ...form.getHeaders(),
            cookie: sessid,
            "User-Agent": ua,
            "accept-language": "id,en-US;q=0.9,en;q=0.8,es;q=0.7,ms;q=0.6",
            "accept-encoding": "gzip, deflate, br",
            "accept": "*/*",
            "origin": "https://snapsave.app",
            "referer": "https://snapsave.app/"
        },
        responseType: "json"
    })
    
    const $ = cheerio.load(data.data)
    let url_data = [];
    $("div.column.is-12").find("tr").each((a, b) => {
        url_data.push($(b).find("a").attr("href"))
    })
    return url_data.filter(v => /(?:https?)/.test(v));
}

module.exports = {
    getInfo, fbdl, insta, igProfile,
    ttdl, ytv, yta, search
}
