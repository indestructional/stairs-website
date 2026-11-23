import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const publicDir = fileURLToPath(new URL('./public/', import.meta.url))
const galleryFile = join(publicDir, 'gallery.json')
const dimensionsModule = 'virtual:gallery-dimensions'

function galleryDimensions() {
  return {
    name: 'gallery-dimensions',
    resolveId(id) {
      if (id === dimensionsModule) return `\0${id}`
    },
    async load(id) {
      if (id !== `\0${dimensionsModule}`) return

      this.addWatchFile(galleryFile)
      const gallery = JSON.parse(await readFile(galleryFile, 'utf8'))
      const photos = new Set(Object.values(gallery).flatMap((works) => works.flatMap((work) => work.images)))
      const dimensions = {}

      for (const photo of photos) {
        const file = join(publicDir, photo.replace(/^\//, ''))
        this.addWatchFile(file)
        const { autoOrient: { width, height } } = await sharp(file).metadata()
        dimensions[photo] = { width, height }
      }

      return `export default ${JSON.stringify(dimensions)}`
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), galleryDimensions()],
  base: '/',
})
