/* global USERS user userid getIntersection CITY_MAP */


let Driver=USERS[userid];

Driver.move= function(new_ix){
    if (Driver.play){
        if(new_ix in CITY_MAP && new_ix in USERmap[user].adjecntnodes){
        Driver.car=new_ix;
    }
    else{
        console.log("Invalid Move, "+USERS[user.uid] +"misses turn ");
    }
    }
    else{
        Driver.play=true;
    }
    
};

Driver.disrupt= function(){
    if(Driver.play){
        disprupt()
        Driver.play=false;
    }
    
}