let getIntersection = (streets) => {
    /*return streets.sort((a, b) => {
        return a.localeCompare(b);
    }).join('/');*/
    return streets.join('/');
}

let getRandomIntersection = (map) => {
    let intersections = Object.keys(map);
    let ridx = Math.floor(Math.random() * intersections.length);
    return intersections[ridx];
}

let Sample = {
    
    initializeGameData: (config) => {
        let HORIZONTAL_STREETS = config.horizontal_streets.sort((a, b) => {
            return a.lat - b.lat;
        });
        let VERTICAL_STREETS = config.vertical_streets.sort((a, b) => {
            return a.lon - b.lon;
        });
        let GROUP1 = config.groups[0];
        let GROUP2 = config.groups[1];
        let CITY_MAP = {};
        HORIZONTAL_STREETS.forEach((h_street, hidx) => {
            VERTICAL_STREETS.forEach((v_street, vidx) => {
                let inter = getIntersection([h_street.name, v_street.name]);
                let adjacent = [
                    {h: hidx-1, v: vidx},
                    {h: hidx+1, v: vidx},
                    {h: hidx, v: vidx-1},
                    {h: hidx, v: vidx+1}
                ].map(idx => {
                    let hs = HORIZONTAL_STREETS[idx.h] || false;
                    let vs = VERTICAL_STREETS[idx.v] || false;
                    return {
                        h: hs,
                        v: vs
                    };
                }).filter(pair => {
                    return pair.h && pair.v;
                }).map(idx => {
                    return getIntersection([idx.h.name, idx.v.name]);
                });
                CITY_MAP[inter] = {
                    name: inter,
                    adjacent: adjacent,
                    lat: h_street.lat,
                    lon: v_street.lon
                }
            });
        });
        
        let USERS = {};
        
        GROUP1.forEach(user => {
            user.car = getRandomIntersection(CITY_MAP);
            user.group = 'group1';
            user.active = true;
            user.rider = false;
            USERS[user.uid] = user;    
        });
        GROUP2.forEach(user => {
            user.car = getRandomIntersection(CITY_MAP);
            user.group = 'group2';
            user.active = true;
            user.rider = false;
            USERS[user.uid] = user;    
        });
        
        let riderMap = {};
        let initial_riders = config.initial_riders || 2;
        for(let i = 0; i < initial_riders; i++){
            let rider = config.rider_list[i];
            riderMap[rider.rid] = rider;
            riderMap[rider.rid].satisfaction = 100;
            riderMap[rider.rid].pickup = getRandomIntersection(CITY_MAP);
            riderMap[rider.rid].dropoff = getRandomIntersection(CITY_MAP);
            riderMap[rider.rid].incar = false;
            riderMap[rider.rid].completedby = false;
            //riderMap[rider.dropoff]=rider.rid;
        }
        
        return {
            map: CITY_MAP,
            users: USERS,
            riders: riderMap
        }
    }
    
}