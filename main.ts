import multiavatar from "@multiavatar/multiavatar"
import newExpress from "express"
import fs from "fs"
import os from "os"
import path from "path"
import sharp from "sharp"
import * as md5 from "ts-md5"
import url from "url"

let CACHE_DIR = path.join(os.tmpdir(), "multiavatar/cache")
fs.mkdirSync(CACHE_DIR, { recursive: true })


let app = newExpress()
app.get("*", async (req, res) => {
    let u = url.parse(req.url, true)
    let key = u.path
    if (key.includes(".")) {
        let index = key.lastIndexOf(".")
        key = key.substring(0, index)
    }
    let hash = new md5.Md5().start().appendStr(key).end(false) as string
    let isWebp = u.path.endsWith(".webp")
    let file = path.join(CACHE_DIR, hash + (isWebp ? ".webp" : ".png"))
    console.log(u.path, key, file)
    if (!fs.existsSync(file)) {
        let svg = multiavatar(hash, true)
        try {
            await sharp(Buffer.from(svg)).resize(500, 500).toFile(file)
        } catch (e) {
            console.log("gen failed", u.path, hash, file)
            console.warn(e)
        }
    }
    res.sendFile(file, { cacheControl: true, maxAge: 24 * 3600 })
})
app.listen(80, "0.0.0.0", 10, () => {
    console.log("http start listen", "http://localhost/")
})