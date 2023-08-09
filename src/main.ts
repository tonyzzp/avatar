import multiavatar from "@multiavatar/multiavatar"
import newExpress from "express"
import fs from "fs"
import os from "os"
import path from "path"
import sharp from "sharp"

const EXAMPLE = `
<html>
<body>
<h4>examples</h4>
<ul>
    <li>/myname</li>
    <li>/myname_123</li>
    <li>/myname@-_abc.com</li>
    <li>/myname?size=300</li>
<ul>
</body>
</html>
`

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
app.get("/:path([\\d\\w\\-_@\\.]+)", async (req, res) => {
    console.log("-----req")
    console.log(req.url)
    console.log(req.params)
    console.log(req.query)
    let rpath = req.params.path.trim()
    let size = 300
    if (req.query.size) {
        if (typeof req.query.size == "string") {
            size = parseInt(req.query.size) || 300
        } else {
            size = parseInt(req.query.size[0]) || 300
        }
    }
    size = Math.min(1000, Math.max(size, 300))
    let file = path.join(CACHE_DIR, `${rpath}_${size}` + ".png")
    console.log(rpath, file)
    if (!fs.existsSync(file)) {
        let svg = multiavatar(rpath, true)
        let buffer: Buffer
        try {
            buffer = await sharp(Buffer.from(svg)).resize(size).png().toBuffer()
        } catch (e) {
            console.warn(e)
        }
        if (buffer) {
            fs.writeFileSync(file, buffer)
        }
    }
    res.sendFile(file, { cacheControl: true, maxAge: 24 * 3600 * 1000 })
})
app.get("*", (req, resp) => {
    resp.end(EXAMPLE)
})
app.listen(80, "0.0.0.0", 10, () => {
    console.log("http start listen", "http://localhost/")
})