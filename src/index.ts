import parseMvt from '@loaders.gl/mvt/dist/lib/parse-mvt'
import fs from 'fs'
import { Geohash } from './geohash'

// @ts-ignore
global.Response = function () {}

const data = fs.readFileSync('./single_output.mvt')

const myGeohash = '9q5'
const bounds = Geohash.bounds(myGeohash)

const north = bounds.ne.lat
const west = bounds.sw.lon

const width = (bounds.ne.lon - bounds.sw.lon)
const height = (bounds.ne.lat - bounds.sw.lat)


console.log('bounds:' ,bounds)
console.log('width and height:', width, height)

const features = parseMvt(data, {
  mvt: {
    shape: 'geojson',
    tileIndex: null,
    coordinates: 'local',
  }
}) as any

console.log('local coordinates:', JSON.stringify(features, null, 2))

for (const feature of features) {
  feature.geometry.coordinates[0].forEach((coordinate: any) => {
    coordinate[0] = (width * coordinate[0]) + west
    coordinate[1] = (-height * coordinate[1]) + north
  })
}

console.log('coordinates:', JSON.stringify(features, null, 2))

console.log('expected result:', 'POLYGON ((-118.9306641 34.9244911, -118.928833 34.9260098, -118.927002 34.9244911, -118.928833 34.9229723, -118.9306641 34.9244911))'
)


