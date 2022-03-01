import * as fs from "fs";
import * as path from "path";
import { parse } from 'csv-parse/sync';

interface Station {
    code: string;
    color: string;
    links: string[]; 
}

// function to parase CSV file
function parseCSV(file: string): Station[] {
    file= "../files/network.csv";
    const csvFilePath = path.resolve(__dirname, file);
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    
    const result:Station[] = parse(fileContent, {
        delimiter: ',',
        cast: (value, context) => {
        if (typeof(context.column) === 'string' && context.column.toLowerCase() === "links") {
            let links = value.split(',');
            return links.map((v) => {
                return v.toLowerCase();
            });
        } else return value.toLowerCase();
    },
    columns: true,
    });
    return result;
}

// function rebuild network by color
function colorNetwork(network: Station[], color: string): Station[] {
    color === "rojo" ? color = "verde": color = "rojo";

    // search stations
    const stations = network.filter((station) => station.color === color);
    // get into each green station
    stations.map((station) => {
        // get into each link of each green station
        station.links.map((link) => {
            // get link station
            let near = network.find(s => s.code === link);
            // delete green station as link from green station near
            const nearStationIndex = network.findIndex(s => s.code === near?.code);
            network[nearStationIndex].links = network[nearStationIndex].links.filter(l => l !== station.code)
            // add green station links
            const greenStationIndex = network.findIndex(st => st.code === station.code);
            const links = network[greenStationIndex].links.filter(l => l !== network[nearStationIndex].code);
            if (links.length > 0) network[nearStationIndex].links = network[nearStationIndex].links.concat(links);
        })
        // delete green station
        network = network.filter(st => st.code !== station.code)
        
    });
    return network;
}

function stationTravel(network: Station[], routes: string[][], start: string, end: string, counter: number): string[][] {
    
    let finish = false;

    const lastIndex = routes[counter].length -1;
    // get last element of the current route
    const last = routes[counter][lastIndex];
    const lastStation = network.find(station => station.code === last);
    
    if (lastStation !== undefined) {
        // remove link if point to a previus station
        routes[counter].map((station) => {
            if (lastStation.links.find(l => l === station)) {
                lastStation.links = lastStation.links.filter(l => l !== station);
            }
        });
        lastStation.links.map((link, index) => {
            // get new station
            const newStation = network.find(station => station.code === link);
            if (newStation !== undefined) {
                // avoid loop
                if(newStation.code !== start) {
                    if (index == 0) {
                        // add new element to the route
                        routes[counter].push(newStation.code)
                        // remove last element of the network
                        let newNetwork = network.filter((n) => n.code != last);
                        if (newStation.code === end) finish = true;
                        // if is not the last station call this function recursively with the new network
                        if (!finish) routes = stationTravel(newNetwork, routes, start, end, counter);
                    } else {
                        // create a new alternative route if new station have more than one link
                        routes[counter + index] = [...routes[counter]];
                        // find id of the last valid station a cut and copy to a new route
                        const stationIndex = routes[counter].findIndex(c => c === lastStation.code);
                        routes[counter + index].splice(stationIndex + 1, routes[counter].length);
                        // add new element to the new route
                        routes[counter + index].push(newStation.code);
                        // call this function recursively but with an alternative route
                        routes = stationTravel(network, routes, start, end, counter + index);
                    }  
                }
            }    
        });
    }
    return routes;
}

// function to find short route
function bestRoute(network: Station[], start: string, end: string): string[] {
    let routes : string[][] = [[]] ;
    // each counter it is a new possible route
    let counter = 0;

    //find start start station
    let first = network.find(station => station.code === start);
    
    if (first !== undefined) {
        routes[counter].push(first.code);
        // find every route from start to end
        routes = stationTravel(network, routes, start, end, counter)
    }
    
    // clean best route
    routes.map((r) => {
        let lazy = r.find(station => station === end);
        if (lazy === undefined) {
            routes = routes.filter(route => route !== r);
        }
    });

    let bestRoute: string[] = [];
    // find best route
    routes.map((r) => {
        if (bestRoute.length === 0) bestRoute = [...r];
        else if (r.length < bestRoute.length) bestRoute = [...r];
    });
    
    return bestRoute;
}

function budaTask(file: string, initStation: string, lastStation: string, color?: string): string[] {
    // create network
    let stations = parseCSV(file);

    // verify color param
    if (color !== undefined && color !== "" && color.toLowerCase() !== "blanco") {
        color = color.toLowerCase();
        if("verde" !== color && "rojo" !== color) {
            throw new Error("invalid color");
        }
        stations = colorNetwork(stations, color);
    }
    // verify initial station param
    const start = stations.find((station) => station.code === initStation.toLowerCase());
    if (start === undefined ) throw new Error("invalid initial station");

    // verify lasta station param
    const end = stations.find((station) => station.code === lastStation.toLowerCase());
    if (end === undefined) throw new Error("invalid last station");

    // avoid loop
    if (initStation === lastStation) throw new Error("initial station shoudl be different of lasta station");

    // find best route
    return bestRoute(stations, start.code, end.code).map(br => {
        return br.toUpperCase()
    });
}

export = budaTask;

//console.log(budaTask('../files/network.csv', 'F', 'C'));

