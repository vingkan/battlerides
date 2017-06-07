let Bot = (cityMap, userMap, riderMap) => {

    let bot = {
        
        // Map of uids to move objects for the given turn
        moves: {
            tahj: {
                type: 'disrupt',
                time: 0000000
            },
            vinesh: {
                type: 'drive',
                to: 'Adams/3rd',
                time: 0000000
            }
        },
        
        disrupted: new Set(),
        /* set of disrupted nodes that are considered when constructing bot.moves
        should be emptied after each turn along with bot.moves -tahj */
        
        
        // Take in message object with gid, uid, and message
        // If valid, store move objects, send back success
        // If not valid, send back error
        process: (obj) => {
            let msg = {
                uid: 'tahj',
                gid: 'group1',
                message: 'cause a disruption'
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
                movelist.push(moves[move])}).sort((a,b)=>{
                return b['time']-a['time'];
            }).forEach((move)=>{
                if(move['type']=='disrupt'){
                    
                }
            });
            
            
            // Disrupt any streets
                // For every move of type disrupt
                moves = bot.disrupt(uid, target, moves);
                
            // Move any cars
                // For every move of type drive
                bot.drive(uid, destination);
                
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
                if (destination in cityMap && cityMap[destination].adjacent.includes(destination)){
                    //if user destination has been distrupted -Tahj
                    if (!bot.disrupted.has(destination)){
                        user.car=destination;
                       // bot.moves[uid]={type: 'drive', to:'destination'};
                        //if user has reached drop off with rider -Tahj
                        if (rid && riderMap[rid].dropoff == destination){
                            riderMap[rid].dropoff=false;// not necessary, but just incase -Tahj
                            rid=false;
                        }
                        // if user has no rider
                        else if(!rid){
                            //iterate over riders to find match for pickup -Tahj
                            Object.keys(riderMap).forEach( (rid) =>{
                                if(riderMap[rid].pickuplocation == destination){
                                    user.rider=rid;
                                    riderMap[rid].pickuplocation=false;
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
                    //if user is just retarded. -Tahj
                    console.log(" Invalid move");
                }
                
            }
            else{
                //missed this turn, don't miss next turn - Tahj
                user.active = true;
            }
        },
        
        disrupt: (uid, target, moves) => {
            // why do we need target and moves? -Tahj
            let user = userMap[uid];
            if (user.active){
               bot.disrupted.add(user.adjacent);
                user.active = false;
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
        },
        /* getMoves to create bot.moves 
            instead of calling drive to create bot.moves then call update which calls drive -Tahj
        */
        getResponse: (responses) =>{
            //driveto 2D,
            // distrupt 4B... could be one word but w/e -tahj
            responses.forEach((response)=>{
                  let uid = response.uid
            let command =  response.message.split(' ');
            
            if (command.length!=2){
                console.log('incorrect command; no move');
            }
            else if (command[0]=='driveto'){
                bot.moves[uid] = {type: 'drive', to: command[1], time: response.time}
            }
            else if(command[0]=='disrupt'){
                bot.moves[uid] = {type: 'disrupt', to: command[1], time: response.time}

            }
            else{
                 console.log('incorrect command; no move');

            }
                
                
            });
          
        }
        
    }
    
    return bot;

}