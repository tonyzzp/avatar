import { createCanvas, Image } from "canvas"

const SIZE = 300

export namespace images {
    export async function toPNG(svg: string) {
        return new Promise<Buffer>((r) => {
            let canvas = createCanvas(SIZE, SIZE)
            let g = canvas.getContext("2d")
            g.fillStyle = "#000000"
            g.clearRect(0, 0, SIZE, SIZE)

            let resolved = false
            let img = new Image()
            let base64 = "data:image/svg+xml;base64," + Buffer.from(svg).toString("base64")
            img.src = base64

            function success() {
                if (resolved) {
                    return
                }
                resolved = true
                g.drawImage(img, 0, 0, img.width, img.height, 0, 0, SIZE, SIZE)
                let buffer = canvas.toBuffer("image/png", { compressionLevel: 9 })
                r(buffer)
            }

            function fail() {
                if (resolved) {
                    return
                }
                resolved = true
                r(null)
            }

            img.onload = () => {
                console.log("-----img.onload")
                success()
            }
            img.onerror = (e) => {
                console.log("-----img.onerror", e)
                fail()
            }
            let handle = null
            handle = setInterval(() => {
                if (resolved) {
                    clearInterval(handle)
                } else {
                    if (img.complete) {
                        clearInterval(handle)
                        console.log("---complete", img.complete, img.width, img.height, img.naturalWidth, img.naturalHeight)
                        success()
                    }
                }
            }, 5)
        })
    }
}