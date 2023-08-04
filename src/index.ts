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

const width = bounds.ne.lon - bounds.sw.lon
const height = bounds.ne.lat - bounds.sw.lat

const extent = 4096

const fx = extent / width;
const fy = -(extent / height);

const xoff = -bounds.sw.lon * fx;
const yoff = -bounds.ne.lat * fy;

console.log('bounds:' ,bounds)
console.log('width and height:', width, height)

const features = parseMvt(data, {
  mvt: {
    shape: 'geojson',
    tileIndex: null,
    coordinates: 'local',
  }
}) as any

for (const feature of features) {
  feature.geometry.coordinates[0].forEach((coordinate: any) => {
    // How do I make this work?
    // coordinate[0] = (coordinate[0] * extent - xoff) / fx;
    // coordinate[1] = (coordinate[1] * extent - yoff) / fy;
  })
}

console.log('local coordinates:', JSON.stringify(features, null, 2))

console.log('expected result:', 'POLYGON ((-118.9306641 34.9244911, -118.928833 34.9260098, -118.927002 34.9244911, -118.928833 34.9229723, -118.9306641 34.9244911))'
)


function toGeoJSON(
    options: {x: number; y: number; z: number} | ((data: number[], feature: {extent: any}) => void)
  ): any {
    if (typeof options === 'function') {
      return this._toGeoJSON(options);
    }
    const {x, y, z} = options;
    const size = this.extent * Math.pow(2, z);
    const x0 = this.extent * x;
    const y0 = this.extent * y;

    function project(line: number[]) {
      for (let j = 0; j < line.length; j++) {
        const p = line[j];
        p[0] = ((p[0] + x0) * 360) / size - 180;
        const y2 = 180 - ((p[1] + y0) * 360) / size;
        p[1] = (360 / Math.PI) * Math.atan(Math.exp((y2 * Math.PI) / 180)) - 90;
      }
    }
    return this._toGeoJSON(project);
  }


