/* global L */
/* global OverlappingMarkerSpiderfier */

//const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';
const GROUP1_IMAGE = {
    iconUrl: 'car-orange.png',
    iconSize: [35, 20]
}
const GROUP2_IMAGE = {
    iconUrl: 'car-blue.png',
    iconSize: [35, 20]
}
const RIDER_IMAGE = {
    iconUrl: 'rider-boy.png',
    iconSize: [30, 30]
}
const DESTINATION_IMAGE = {
    iconUrl: 'destination-flag.png',
    iconSize: [30, 30],
    iconAnchor: [5, 30]
}
const ROUTE_COLOR = 'white';

let GeoMap = () => {
    let geoMap = {
        
        map: false,
        
        initMap: (id, center) => {
            let geo = {
                coords: center
            }
            let zoom = 12;
            let map_coords = [geo.coords.latitude, geo.coords.longitude];
            let map = L.map(id).setView(map_coords, zoom);
            let tile = L.tileLayer(TILE_URL, {
                attribution: 'OpenStreetMap'
            });
            tile.addTo(map);
            geoMap.map = map;
            let oms = new OverlappingMarkerSpiderfier(map, {
                keepSpiderfied: true
            });
            geoMap.oms = oms;
            return map;
        },
        
        getIcon: (color) => {
            let markerHTML = `
                background-color: ${ color || 'black'};
                width: 20px;
                height: 20px;
                display: block;
                position: relative;
                top: -5px;
                left: -5px;
                border-radius: 10px;
            `;
            /*
                left: -1.5rem;
                top: -1.5rem;
                border-radius: 3rem 3rem 0;
                transform: rotate(45deg);
            */
            let icon = L.divIcon({
                html: `<span style="${markerHTML}"/>`
            });
            return icon;
        },
        
        getImageIcon: (image) => {
            let icon = L.icon(image);
            return icon;
        },
        
        plotMarker: (coords, html) => {
            let marker = false;
            let coord_list = [coords.lat, coords.lon];
            if(coords.image){
                let icon = geoMap.getImageIcon(coords.image);
                marker = L.marker(coord_list, {
                    icon: icon
                });
            }
            else if(coords.color){
                let icon = geoMap.getIcon(coords.color);
                marker = L.marker(coord_list, {
                    icon: icon
                });
            }
            else{
                marker = L.marker(coord_list);
            }
            marker.addTo(geoMap.map);
            geoMap.oms.addMarker(marker);
            marker.bindPopup(html);
        },
        
        plotLine: (coordsList, html, options) => {
            let line = L.polyline(coordsList, options);
            line.addTo(geoMap.map);
            if(html){
                line.bindPopup(html);   
            }
        },
        
        clear: () => {
            geoMap.map.eachLayer(layer => {
                if(layer instanceof L.Marker || layer instanceof L.Path){
                    geoMap.map.removeLayer(layer);   
                }
            });
        },
        
        render: (CITY_MAP, USERS, RIDERS) => {
            geoMap.clear();
            Object.keys(CITY_MAP).map(ix => {
                return CITY_MAP[ix];
            }).forEach(intersection => {
                intersection.color = ROUTE_COLOR;
                geoMap.plotMarker(intersection, intersection.name);
                intersection.adjacent.forEach(adj_ix => {
                    let adj = CITY_MAP[adj_ix];
                    geoMap.plotLine([{
                        lat: intersection.lat,
                        lon: intersection.lon
                    }, {
                        lat: adj.lat,
                        lon: adj.lon
                    }], false, {
                        color: ROUTE_COLOR,
                        weight: 1,
                        dashArray: '5,5'
                    });
                });
            });
            Object.keys(USERS).map(uid => {
                return USERS[uid];
            }).forEach(user => {
                let ix = CITY_MAP[user.car];
                let image = user.group === 'group1' ? GROUP1_IMAGE : GROUP2_IMAGE;
                geoMap.plotMarker({
                    lat: ix.lat,
                    lon: ix.lon,
                    image: image
                }, user.name);
            });
            Object.keys(RIDERS).map(rid => {
                return RIDERS[rid];
            }).forEach(rider => {
                if(!rider.incar){
                    let pickup = CITY_MAP[rider.pickup];
                    geoMap.plotMarker({
                        lat: pickup.lat,
                        lon: pickup.lon,
                        image: RIDER_IMAGE
                    }, `Pickup ${rider.name}`);   
                }
                if(!rider.completedby){
                    let dropoff = CITY_MAP[rider.dropoff];
                    geoMap.plotMarker({
                        lat: dropoff.lat,
                        lon: dropoff.lon,
                        image: DESTINATION_IMAGE
                    }, `Dropoff ${rider.name}`);   
                }
            });
        }
        
    }
    return geoMap;
}