let Bot = (cityMap, userMap, riderMap) => {

    let bot = {
        
        cityMap: cityMap,
        userMap: userMap,
        riderMap: riderMap,
        
        // Map of uids to move objects for the given turn
        moves: {},
        
        disrupted: new Set(),
        /* set of disrupted nodes that are considered when constructing bot.moves
        should be emptied after each turn along with bot.moves -tahj */
        
        
        // Take in message object with gid, uid, and message
        // If valid, store move objects, send back success
        // If not valid, send back error
        process: (obj) => {
            /*let msg = {
                uid: 'tahj',
                gid: 'group1',
                message: 'cause a disruption'
            }*/
            let uid = obj.uid
            let command =  obj.message.split('-');
            
            if (command.length>2){
                return ('incorrect command; no move' + userMap[uid].name);
            }
            else if (command[0]=='driveto'){
                bot.moves[uid] = {type: 'drive', to: command[1], time: obj.time}
                return ('ok, '+ userMap[uid].name);
            }
            else if(command[0]=='disrupt'){
                bot.moves[uid] = {type: 'disrupt', time: obj.time}
                return ('ok, '+ userMap[uid].name);
            }
            else{
                 return ('incorrect command; no move, '+ userMap[uid].name);

            }
            
           
               
            // Determine if message is valid
            // Create move object and assign it to bot.moves[msg.uid]
        },
        
        // Change model based on moves
        // Clear moves for next turn
        update: (moves) => {
            let movelist=[];
            let disruptlist=[];
            let drivelist=[];
            Object.keys(bot.moves).forEach((move)=>{
                movelist.push([move,moves[move]])});
                
                movelist.sort((a,b)=>{
                return b[1]['time']-a[1]['time'];
            });
            movelist.forEach((move)=>{
                if(move[1]['type']=='disrupt'){
                   disruptlist.push(move); 
                }
                else{
                    drivelist.push(move);
                }
            });
            
            disruptlist.forEach((move)=>{
                bot.disrupt(move[0]);
                console.log(move[0] + 'disrupts');
            });
            drivelist.forEach((move)=>{
               bot.drive(move[0], move[1].to);
               console.log(move[0] + 'drives');
            });
            
            
            
            bot.moves={};
            bot.disrupted=new Set();
            // Disrupt any streets
                // For every move of type disrupt
                //moves = bot.disrupt(uid, target, moves);
                
            // Move any cars
                // For every move of type drive
                //bot.drive(uid, destination);
                
            // Handle pickups/settle any race conditions
            //with time stamps -tahj
            // Hand dropoffs
            
        },
        
        report: () => {
            // Spawn any new riders
            // Tell each group their information
            // Clear disrupted nodes from cityMap
        },
        
        drive: (uid, destination) => {
            // Edit userMap so that uid's car is now at destination
            let user = userMap[uid];
            let rid = user.rider;
            if (user.active){
                //if user destination is valid -Tahj
                let validDestination = destination in cityMap;
                let adjacentDestination = cityMap[user.car].adjacent.includes(destination);
                if (validDestination && adjacentDestination){
                    //if user destination has been distrupted -Tahj
                    if (!bot.disrupted.has(destination)){
                        console.log(bot.disrupted, destination)
                        console.log('is destination disrupted');
                        console.log(bot.disrupted.has(destination));
                        user.car=destination;
                       // bot.moves[uid]={type: 'drive', to:'destination'};
                        //if user has reached drop off with rider -Tahj
                        if (rid && riderMap[rid].dropoff == destination){
                            riderMap[rid].completedby=uid;// not necessary, but just incase -Tahj
                            user.rid=false;
                        }
                        // if user has no rider
                        else if(!rid){
                            //iterate over riders to find match for pickup -Tahj
                            Object.keys(riderMap).forEach( (rid) =>{
                                if(riderMap[rid].pickup == destination && !riderMap[rid].incar){
                                    user.rider=rid;
                                    riderMap[rid].incar=true;
                                    console.log("picked up rider");
                                }
                            });
                        }
                        
                    }
                    else{
                        console.log(" You have been disrupted from moving to "+ destination);
                        //if user was disrupted while with rider -Tahj
                        if(rid){
                            riderMap[rid].satisfaction+=-25; //lowers satisfaction
                        }
                    }
                    
                }
                else{
                    if(!validDestination){
                        console.log("Invalid destination:", destination);
                    }
                    if(!adjacentDestination){
                        console.log("Not adjacent to:", user.car);
                        console.log(cityMap[user.car].adjacent, destination)
                    }
                    console.trace();
                }
                
            }
            else{
                //missed this turn, don't miss next turn - Tahj
                user.active = true;
            }
        },
        
        disrupt: (uid) => {
            let user = userMap[uid];
            if (user.active){
                cityMap[user.car].adjacent.forEach(adj => {
                    bot.disrupted.add(adj);
                });
                user.active = false;
                console.log('disrupt!');
            }
            else{
                //missed this turn, don't miss next turn - Tahj
                user.active = true;
            }
            /*Since we disrupt before we drive, seeing which drivers are affected by
            disrupts and lowering satisfaction is done in drive method
            */
            
            
            // Disables uid from playing
            // Update cityMap to reflect disrupted nodes
            // Search all the moves for drivers whp were moving into a disrupted node
            // Lowers satisfaction of all riders in cars that match the above search
            // Remove the moves for this turn of the cars in the above search
            // Return the remaining moves
        }
        
       
        
    }
    
    return bot;

}

