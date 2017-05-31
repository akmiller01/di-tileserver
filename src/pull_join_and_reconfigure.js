var https = require('https');
var fs = require('fs');
var path = require('path');

var csvUrlsPath = "/src/world_csvs.txt",
geojsonPath = "/src/world.geojson",
configjsonPath = "/data/config.json",
stylejsonPath = "/data/world.json",
geojsonOutputPath = "/src/";

fs.readFile(csvUrlsPath,'utf8',function(err,data){
    var lines = data.split('/n');
    for(var i = 0; i < lines.length; i++){
        var csvUrl = lines[i];
        pullCSV(csvUrl);
    }
});

function pullCSV(csvUrl){
    var csvname = path.basename(csvUrl).slice(0,-4);
    var csvString = "";
    https.get(csvUrl,function(res){
        res.on('data',function(d){
            csvString += d.toString('utf8'); 
        })
        .on('error',function(e){
            console.error(e);
        }).on('end',function(){
            parseCSV(csvString,csvname);
        });
    });
}

function parseCSV(string,csvname){
    var csv = [],
    lines = string.split("\n"),
    header = [],
    isheader = true;
    for(var i = 0; i<lines.length;i++){
        if(!isheader){
            csv.push(lines[i].split(","));
        }else{
           isheader = false;
           header = lines[i].split(",");
        }
    }
    fs.readFile(geojsonPath,'utf8',function(err,data){
        var geojson = JSON.parse(data);
        joinCSV(header,csv,geojson,csvname);  
    });
}

function joinCSV(header,csv,geojson,csvname){
    var idCol = header.indexOf("id"),
    yearCol = header.indexOf("year"),
    valCol = header.indexOf("value");
    if(idCol==-1){
        console.log("Sorry, couldn't find the id column.");
    }else if(valCol==-1){
        console.log("Sorry, couldn't find the value column.");
    }else{
        //No years
        if(yearCol==-1){
            var valDict = {},
            result = {'type':'FeatureCollection','features':[]};
            csv.forEach(function(d){
                var id = d[idCol],
                value = d[valCol];
                valDict[id] = value;
            });
            geojson.features.forEach(function(d){
                var feature = d,
                iso2 = feature.properties.ISO2;
                feature.properties.value = valDict[iso2];
                result.features.push(feature);
            });
            //Write the result
            fs.writeFile(geojsonOutputPath+csvname+".geojson", JSON.stringify(result),function(err){
                if(err){
                    console.error(err);
                    return;
                }
                console.log("Wrote "+geojsonOutputPath+csvname+".geojson");
            });
        //there are years, we need to split the geojson
        }else{
            var years = {};
            csv.forEach(function(d){
                var year = d[yearCol];
                years[year] = true;
            });
            var uniqueYears = Object.keys(years);
            for(var i = 0; i < uniqueYears.length; i++){
                var year = uniqueYears[i],
                valDict = {},
                result = {'type':'FeatureCollection','features':[]};
                if(year!='undefined'){
                    csv.forEach(function(d){
                        var id = d[idCol],
                        value = d[valCol],
                        rowYear = d[yearCol];
                        if(rowYear==year){
                            valDict[id] = value;
                        }
                    });
                    geojson.features.forEach(function(d){
                        var feature = d,
                        iso2 = feature.properties.ISO2;
                        feature.properties.value = valDict[iso2];
                        result.features.push(feature);
                    });
                    //Write the result
                    fs.writeFile(geojsonOutputPath+csvname+year+".geojson", JSON.stringify(result),function(err){
                        if(err){
                            console.error(err);
                            return;
                        }
                        console.log("Wrote "+geojsonOutputPath+csvname+".geojson");
                    });
                };
            }
        }
    }
}
//Too many layers is a bottleneck, need to just append new data to geojson rather than new geojson
//Todo, write style.jsons for each new layer and add them to config.json