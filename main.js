"use strict";
/* global vis */
/* global Sample */
/* global L */
/* global GeoMap */
/* global Bot */

const HORIZONTAL_STREETS = [
    {name: 'North', lat: 41.910502},
    {name: 'Adams', lat: 41.879467},
    {name: 'Chicago', lat: 41.896735},
    {name: 'Roosvelt', lat: 41.867284}
];
const VERTICAL_STREETS = [
    {name: 'Michigan', lon: -87.624513},
    {name: 'Halsted', lon: -87.647063},
    {name: 'Damen', lon: -87.676293},
    {name:'Central Park', lon: -87.715356}
];

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

CITY_MAP['North/Central Park'].lat = 41.9171801;
CITY_MAP['North/Central Park'].lon = -87.7060404;

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
    let view = {
        accepting: false
    };
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
        history.scrollTop = history.scrollHeight;
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
            if(view.accepting){
                let msg = {
                    gid: id,
                    uid: select.value,
                    message: textarea.value
                };
                let resMsg = bot.process(msg);
                view.addMessage({
                    name: bot.userMap[msg.uid].name,
                    message: msg.message
                });
                view.addMessage({
                    name: "Bot",
                    message: resMsg
                });
            }
            else{
                view.addMessage({
                    name: "Bot",
                    message: "Not accepting messages."
                });
            }
            textarea.value = '';
        }
    });
    holder.appendChild(textarea);
    view.holder = holder;
    return view;
}
    
let bot = Bot(CITY_MAP, USERS, RIDERS);

/*let bot = {
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
};*/

let gchat1 = document.getElementById('gchat1');
let gchat2 = document.getElementById('gchat2');
let view1 = renderGroupChatView(bot, 'group1', GROUP1);
let view2 = renderGroupChatView(bot, 'group2', GROUP2)
gchat1.appendChild(view1.holder);
gchat2.appendChild(view2.holder);

let ROUND_LENGTH = 3 * 1000;
let round_start = Date.now();

view1.accepting = true;
view2.accepting = true;

setInterval(() => {
    if(Date.now() - ROUND_LENGTH > round_start){
        view1.accepting = false;
        view2.accepting = false;
        //console.log('Round ends.');
        bot.update(bot.moves);
        geoMap.render(bot.cityMap, bot.userMap, bot.riderMap);
        //setTimeout(() => {
            //console.log('New round.');
            view1.accepting = true;
            view2.accepting = true;
            round_start = Date.now();
        //}, 2000);
    }
}, ROUND_LENGTH / 2);

let reply1 = bot.report();
let reply2 = bot.report()

//Unit tests :s
function test_botprocess(){
    console.log('$testing: bot.process');
    let output={};
    output.response=[];
    let testbot=Bot(CITY_MAP, USERS, RIDERS);
    output.msgs = [{
                uid: 'tahj',
                gid: 'group1',
                message: 'cause a disruption'
            },
            {
                uid: 'vinesh',
                gid: 'group1',
                message: 'disrupt-Central Park/North'
            },
            {
                uid: 'joshua',
                gid: 'group1',
                message: 'driveto-Adams/Michigan'
            }];
            output.msgs.forEach((msg)=>{
                output.response.push(testbot.process(msg)); 
            });
            output.expected=['incorrect command; no move, tahj',
            'ok, vinesh','ok, josh'];
            console.log(output);
    
    
            
}
function test_botdrive(){
    
}
test_botprocess();