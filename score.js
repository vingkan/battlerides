Object.keys(bot.riderMap)
.map(rid => bot.riderMap[rid])
.reduce((acc, val) => {
    let gid = bot.userMap[val.completedby].group;
    if(acc[gid]){
        acc[gid] += val.satisfaction;
    }else{
        acc[gid] = val.satisfaction;
    }
    return acc;
}, {});