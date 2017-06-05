# di-tileserver
A dockerized tileserver with additional code to make dynamic tiles with data

#### To build:

1. Ask Alex for GeoJSON link
2. In the root of the repository, make a folder called "src" and copy the GeoJSON there
3. In a separate location: git clone https://github.com/mapbox/tippecanoe.git
4. In that same separate location: docker build -t tippecanoe:latest .
5. Back in this repository's folder: docker-compose build
6. Back in this repository's folder: docker-compose up -d

#### To run:

1. docker-compose run tippecanoe sh -c 'tippecanoe -B 0 -Z 0 -z 10 -pf -pk -f --output=/data/output.mbtiles $(ls /src/*.geojson)'
2. docker-compose run tippecanoe sh -c 'tippecanoe -B 0 -Z 0 -z 10 -f --output=/data/world.mbtiles /src/world.geojson'
3. docker-compose restart tileserver

#### To view:
1. Once running, the tileserver is viewable here: http://localhost:8080/
2. Once running, an example Mapbox GL page is viewable here: http://localhost:8888
