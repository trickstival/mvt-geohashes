# MVT Geohashes

Run it with:
```sh
npx ts-node src/index.ts
```

`single-output.mvt` is the output from a postgis query that looks like this:
```sql
select ST_AsMVT(s.*) from ( select ST_AsMVTGeom(geom, ST_GeomFromGeohash('9q5’)) from my_table where geohash3 = '9q5’ ) as s;
```
