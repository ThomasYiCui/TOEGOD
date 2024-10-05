module.exports = {
    checkSourceAvailibilty: function(sourceMap) {
        for(let i in sourceMap) {
            if(!Game.creeps[sourceMap[i]]) {
                return i;
            }
        }
        return null;
    },
    
    priority: function() {
        
    },
    
    run: function() {
        let creepRooms = _.groupBy(Game.creeps, (creep) => creep.memory.room);
        
        for(let i in Game.spawns) {
            let spawn = Game.spawns[i];
            if(!Memory.rooms[spawn.room.name]) {
                continue;
            }
            
            if(spawn.spawning) { 
                var spawningCreep = Game.creeps[spawn.spawning.name];
                spawn.room.visual.text(
                    '🛠️' + spawningCreep.memory.role,
                    spawn.pos.x + 1, 
                    spawn.pos.y, 
                    {align: 'left', opacity: 0.8});
            } else {
                let creepRoles = _.groupBy(creepRooms[spawn.room.name], (creep) => creep.memory.role);
                let roomMem = Memory.rooms[spawn.room.name];
                if(this.checkSourceAvailibilty(roomMem.sources)) {
                    let sourceId = this.checkSourceAvailibilty(roomMem.sources);
                    roomMem.sources[sourceId] = 'h' + (Game.time % 1500) + spawn.room.name + sourceId;
                    spawn.spawnCreep([WORK, MOVE], 'h' + (Game.time % 1500) + spawn.room.name + sourceId, {memory: {role: 'harvester', room: spawn.room.name, source: sourceId}});
                } else if(!creepRoles["hauler"] || creepRoles["hauler"].length < 2) {
                    spawn.spawnCreep([CARRY, MOVE], 'h' + (Game.time % 1500) + spawn.room.name, {memory: {role: 'hauler', room: spawn.room.name, toHaul: spawn.room.name}});
                } else if(!creepRoles["upgrader"] || creepRoles["upgrader"].length < 2) {
                    spawn.spawnCreep([WORK, CARRY, MOVE], 'u' + (Game.time % 1500) + spawn.room.name, {memory: {role: 'upgrader', room: spawn.room.name, toHaul: spawn.room.name}});
                }
            }
        }
    }
};

