module.exports = {
    mapToId: function(list) {
        return list.map(obj => {return obj.id});
    },
    mapToResources: function(list) {
        return list.map(obj => {return [obj.id, obj.amount]});
    },
    collectRoomData: function() {
        for(let roomName in Game.rooms) {
            let room = Game.rooms[roomName];
            if(!Memory.rooms[roomName]) {
                Memory.rooms[roomName] = {};
            }
            
            if(room.controller && room.controller.owner) {
                Memory.rooms[roomName].owner = room.controller.owner.username;
                Memory.rooms[roomName].rcl = room.controller.level;
                if(room.controller.owner.username === Memory.username) {
                    Memory.rooms[roomName].resources = this.mapToResources(room.find(FIND_DROPPED_RESOURCES).sort((a, b) => b.amount - a.amount));
                    Memory.rooms[roomName].structures = _.groupBy(Game.rooms[roomName].find(FIND_STRUCTURES), (struct) => struct.structureType);
                    for(let s in Memory.rooms[roomName].structures) {
                        Memory.rooms[roomName].structures[s] = Memory.rooms[roomName].structures[s].map(struct => {
                            return struct.id
                        })
                    }
                    Memory.rooms[roomName].fillingStructures = _.filter(Memory.rooms[roomName].structures["extension"], (struct) => Game.getObjectById(struct).store.getFreeCapacity(RESOURCE_ENERGY)).concat(_.filter(Memory.rooms[roomName].structures["spawn"], (struct) => Game.getObjectById(struct).store.getFreeCapacity(RESOURCE_ENERGY)));
                    if(!Memory.rooms[roomName].sources) {
                        Memory.rooms[roomName].sources = this.mapToId(room.find(FIND_SOURCES));
                        let mapSource = {};
                        for(let source in Memory.rooms[roomName].sources) {
                            mapSource[Memory.rooms[roomName].sources[source]] = null;
                        }
                        Memory.rooms[roomName].sources = mapSource;
                    }
                } else {
                    Memory.rooms[roomName].sources = undefined;
                }
            } else {
                Memory.rooms[roomName].owner = undefined;
                Memory.rooms[roomName].rcl = undefined;
            }
        }
    },
    run: function() {
        this.collectRoomData();
    }
}
    
    
