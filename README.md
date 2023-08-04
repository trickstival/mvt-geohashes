# MVT Geohashes

Run it with:
```sh
npx ts-node src/index.ts
```

## Problem Description
I am developing a map with [deck.gl](http://deck.gl/).

I have a large dataset indexed with geohashes in PostGIS and have developed a custom TileLayer / Tileset implementation that uses Geohashes instead of Google tiles to visualize the data. It works well, but I am now looking to reduce the response size by exploring the MVT format.

I want to decode the `single-output.mvt` file and transform the local coordinates back into global LatLng. Most libraries handle Google tiles, but not geohashes, which is the crux of my issue.

When using [@loaders.gl/mvt](https://github.com/visgl/loaders.gl/blob/master/modules/mvt/src/lib/parse-mvt.ts#L25), it can return normalized local coordinates in GeoJSON like [0.02880859375, 0.00830078125]. Given the known geohash and its boundaries in Lat/Lng, I need to figure out how to project those local values back into global LatLng values.

PostGIS uses an affine transformation to encode it, but I'm not sure how to reverse it:

https://github.com/postgis/postgis/blob/master/postgis/mvt.c#L959

And [loaders.gl](http://loaders.gl) uses some interesting math that I might have to adapt to geohashes or lat/lng when decoding google tiles:

https://github.com/visgl/loaders.gl/blob/master/modules/mvt/src/lib/mapbox-vector-tile/vector-tile-feature.ts#L194

## MVT File
`single-output.mvt` is the output from a postgis query that looks like this:
```sql
select ST_AsMVT(s.*) from ( select ST_AsMVTGeom(geom, ST_GeomFromGeohash('9q5’)) from my_table where geohash3 = '9q5’ ) as s;
```

