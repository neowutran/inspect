const Slash = require('slash');

module.exports = function Inspect(dispatch){
    const slash = new Slash(dispatch);
    let lastPID;
    let lastName;
    let entries = {};
    let instances = {
        9950: "HH",
        9970: "RMHM",
        9710: "BP",
    }

    dispatch.hook('S_USER_PAPERDOLL_INFO', 1, (event) => {
        lastPID = event.pID.low;
        lastName = event.name;
        entries = {};
        event.instances.forEach((instance) => {
            entries[instance.id] = instance.entries;
        })
    })

    dispatch.hook('S_DUNGEON_CLEAR_COUNT_LIST', 1, (event) => {
        if(event.pid !== lastPID) return;
        lastPID = false;
        slash.print(`[inspect] ${lastName}:`);
        event.dungeons.forEach((instance) => {
            if(instances[instance.id] !== undefined){
                let instanceName = instances[instance.id];
                let entryCount = entries[instance.id];
                let entryStr;
                if(entryCount !== undefined)
                    entryStr = entryCount + 'x entries available';
                else
                    entryStr = `never entered`
                slash.print(`${instanceName}: ${instance.clears}x cleared | ${entryStr}`)
            }
        });
    })
}
