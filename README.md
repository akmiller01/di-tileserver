# di-tileserver
A dockerized tileserver with additional code to make dynamic tiles with data

#### To build:

1. git clone https://github.com/mapbox/tippecanoe.git
2. docker build -t tippecanoe:latest .
3. docker-compose build
4. docker-compose up -d

#### To run:

1. docker-compose run tippecanoe sh -c 'tippecanoe -B 0 -Z 0 -z 10 -pf -pk -f --output=/data/output.mbtiles $(ls /src/*.geojson)'
2. docker-compose run tippecanoe sh -c 'tippecanoe -B 0 -Z 0 -z 10 -f --output=/data/world.mbtiles /src/world.geojson'
3. docker-compose restart tileserver

#### To view:
Tileserver is viewable here: http://localhost:8080/
An example Mapbox GL page is viewable here: http://localhost:8888
