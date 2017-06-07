"use strict";
/* global vis */
/* global Sample */
/* global L */
/* global GeoMap */
/* global Bot */

const HORIZONTAL_STREETS = [{name: 'Adams', lat: 41.879467}, {name: 'Roosvelt', lat: 41.867284}, {name: 'Chicago', lat: 41.896735}, {name: 'North', lat: 41.910502}];
const VERTICAL_STREETS = [{name: 'Michigan', lon: -87.624513}, {name: 'Halsted', lon: -87.647063}, {name: 'Damen', lon: -87.676293}, {name:'Central Park', lon: -87.715356}];

let GROUP1 = [{name: 'Tahj', uid: 'tahj'}, {name: 'Joshua', uid: 'joshua'}, {name: 'Hasani', uid: 'hasani'}];
let GROUP2 = [{name: 'Vinesh', uid: 'vinesh'}, {name: 'Asim', uid: 'asim'}, {name: 'Sunny', uid: 'sunny'}];

const INITIAL_DATA = Sample.initializeGameData({
    horizontal_streets: HORIZONTAL_STREETS,
    vertical_streets: VERTICAL_STREETS,
    groups: [GROUP1, GROUP2],
    rider_list: [{name: 'Tom', rid: 'r1'}, {name: 'Dick', rid: 'r2'}, {name: 'Harry', rid: 'r3'}]
});

const CITY_MAP = INITIAL_DATA.map;
const USERS = INITIAL_DATA.users
const RIDERS = INITIAL_DATA.riders;

console.log(CITY_MAP);
console.log(USERS);
console.log(RIDERS);

let geoMap = GeoMap();
    geoMap.initMap('map-view', {
        latitude: 41.888844,
        longitude: -87.662859
    });
    geoMap.render(CITY_MAP, USERS, RIDERS);
    
    
let renderGroupChatView = (bot, id, group) => {
    let view = {};
    let holder = document.createElement('div');
        holder.classList.add('group-chat');
    let history = document.createElement('div');
        history.classList.add('history');
    view.addMessage = (obj) => {
        let div = document.createElement('div');
        div.innerHTML = `
            <div class="sender">${obj.name}</div>
            <div class="message">${obj.message}</div>
        `;
        history.appendChild(div);
    }
        holder.appendChild(history);
    let select = document.createElement('select');
    group.forEach(user => {
        let option = document.createElement('option');
            option.innerText = user.name;
            option.value = user.uid;
            select.appendChild(option);
    });
    holder.appendChild(select);
    let textarea = document.createElement('textarea');
    textarea.addEventListener('keypress', e => {
        if(e.keyCode === 13){
            e.preventDefault();
            let msg = {
                gid: id,
                uid: select.value,
                message: textarea.value
            };
            bot.process(msg);
            view.addMessage({
                name: bot.userMap[msg.uid].name,
                message: msg.message
            });
            textarea.value = '';
        }
    });
    holder.appendChild(textarea);
    view.holder = holder;
    return view;
}
    
//let bot = Bot(CITY_MAP, USERS, RIDERS);

let bot = {
    cityMap: CITY_MAP,
    userMap: USERS,
    riderMap: RIDERS,
    process: (obj) => {
        console.log(obj);
    },
    update: () => {
        
    },
    report: () => {
        return 'I have replied';
    }
};

let gchat1 = document.getElementById('gchat1');
let gchat2 = document.getElementById('gchat2');
let view1 = renderGroupChatView(bot, 'group1', GROUP1);
let view2 = renderGroupChatView(bot, 'group2', GROUP2)
gchat1.appendChild(view1.holder);
gchat2.appendChild(view2.holder);

let round_start = Date.now();
view1.addMessage({
    name: 'Bot',
    message: 'You have 20 seconds to make a move.'
});
let accepting_moves = true;
view1.addMessage({
    name: 'Bot',
    message: 'Turn over.'
});
bot.update(bot.moves);
let reply1 = bot.report();
let reply2 = bot.report()

