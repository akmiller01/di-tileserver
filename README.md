# di-tileserver
A dockerized tileserver with additional code to make dynamic tiles with data

#### To build:

1. git clone https://github.com/mapbox/tippecanoe.git
2. docker build -t tippecanoe:latest .
3. docker-compose build
4. docker-compose up -d

#### To run:

1. docker-compose run tippecanoe tippecanoe -B 1 -Z 1 -z 10 -f --output=/data/output.mbtiles /data/world.geojson /data/subnational.geojson /data/clusters.geojson
2. docker-compose restart tileserver
