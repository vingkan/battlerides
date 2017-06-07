/* global L */
/* global OverlappingMarkerSpiderfier */

//const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_URL = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png';

let GeoMap = () => {
    let geoMap = {
        
        map: false,
        
        initMap: (id, center) => {
            let geo = {
                coords: center
            }
            let zoom = 13;
            let map_coords = [geo.coords.latitude, geo.coords.longitude];
            let map = L.map(id).setView(map_coords, zoom);
            let tile = L.tileLayer(TILE_URL, {
                attribution: 'OpenStreetMap'
            });
            tile.addTo(map);
            geoMap.map = map;
            let oms = new OverlappingMarkerSpiderfier(map);
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
        
        plotMarker: (coords, html) => {
            let marker = false;
            let coord_list = [coords.lat, coords.lon];
            if(coords.color){
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
        
        plotLine: (coordsList, html) => {
            let line = L.polyline(coordsList, {color: 'white', weight: 1});
            line.addTo(geoMap.map);
            if(html){
                line.bindPopup(html);   
            }
        },
        
        clear: () => {
            L.markerClusterGroup().clearLayers();
        },
        
        render: (CITY_MAP, USERS, RIDERS) => {
            Object.keys(CITY_MAP).map(ix => {
                return CITY_MAP[ix];
            }).forEach(intersection => {
                intersection.color = 'white';
                geoMap.plotMarker(intersection, intersection.name);
                intersection.adjacent.forEach(adj_ix => {
                    let adj = CITY_MAP[adj_ix];
                    geoMap.plotLine([{
                        lat: intersection.lat,
                        lon: intersection.lon
                    }, {
                        lat: adj.lat,
                        lon: adj.lon
                    }]);
                });
            });
            Object.keys(USERS).map(uid => {
                return USERS[uid];
            }).forEach(user => {
                let ix = CITY_MAP[user.car];
                ix.color = user.group === 'group1' ? 'blue' : 'red';
                geoMap.plotMarker(ix, user.name);
            });
            Object.keys(RIDERS).map(rid => {
                return RIDERS[rid];
            }).forEach(rider => {
                let pickup = CITY_MAP[rider.pickup];
                    pickup.color = 'green';
                    geoMap.plotMarker(pickup, `Pickup ${rider.name}`);
                let dropoff = CITY_MAP[rider.dropoff];
                    dropoff.color = 'green';
                    geoMap.plotMarker(dropoff, `Dropoff ${rider.name}`);
            });
        }
        
    }
    return geoMap;
}