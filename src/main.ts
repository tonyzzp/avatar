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


setInterval(() => {
    console.log("---------clean caches")
    let base = Date.now() - 10 * 24 * 3600 * 1000
    let names = fs.readdirSync(CACHE_DIR)
    for (let name of names) {
        let file = path.join(CACHE_DIR, name)
        let stats = fs.statSync(file)
        if (stats && stats.isFile() && stats.atimeMs < base) {
            console.log("删除", file, stats.atime.toLocaleString())
            fs.rm(file, e => {
                console.log("删除结果", file, e)
            })
        }
    }
}, 3600 * 1000)

let app = newExpress()
app.get("*", async (req, res) => {
    let u = url.parse(req.url, true)
    let hash = new md5.Md5().start().appendStr(u.path).end(false) as string
    let file = path.join(CACHE_DIR, hash + ".png")
    console.log(u.path, file)
    if (!fs.existsSync(file)) {
        let svg = multiavatar(hash, true)
        let buffer: Buffer
        try {
            // buffer = await images.toPNG(svg);
            // buffer = await images.toPNGBySharp(svg)
            buffer = await sharp(Buffer.from(svg)).resize(500).png().toBuffer()
        } catch (e) {
            console.warn(e)
        }
        if (buffer) {
            fs.writeFileSync(file, buffer)
        }
    }
    res.sendFile(file, { cacheControl: true, maxAge: 24 * 3600 * 1000 })
})
app.listen(80, "0.0.0.0", 10, () => {
    console.log("http start listen", "http://localhost/")
})