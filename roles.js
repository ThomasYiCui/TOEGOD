module.exports = {
    upgrade: function(creep) {
        if(creep.pos.inRangeTo(creep.room.controller, 3)) {
            creep.upgradeController(creep.room.controller);
        } else {
            creep.moveTo(creep.room.controller);
        }
    },
    
    harvest: function(creep) {
        let source = Game.getObjectById(creep.memory.source);
        if(creep.pos.inRangeTo(source, 1)) {
            creep.harvest(source);
        } else {
            creep.moveTo(source);
        }
    },
    
    getEnergy: function(creep, room) {
        if(!creep.room.name === creep.memory.toHaul) {
            creep.moveToRoom(creep.memory.toHaul);
            return;
        }
        if(!Memory.rooms[creep.memory.toHaul] || !Memory.rooms[creep.memory.toHaul].resources) {
            return;
        }
        if(creep.memory.resources) {
            if(creep.pos.inRangeTo(Game.getObjectById(creep.memory.resources), 1)) {
                creep.pickup(Game.getObjectById(creep.memory.resources));
            } else {
                creep.moveTo(Game.getObjectById(creep.memory.resources))
            }
            for(let i in Memory.rooms[creep.memory.toHaul].resources) {
                let resource = Memory.rooms[creep.memory.toHaul].resources[i];
                if(resource[0] === creep.memory.resource) {
                    resource[1]-=creep.store.getFreeCapacity();
                    if(resource[0] <= 0) {
                        Memory.rooms[creep.memory.toHaul].resources.splice(i, 1);
                    }
                }
            }
        } else {
            let resources = Memory.rooms[creep.memory.toHaul].resources[0];
            if(resources) {
                resources[1]-=creep.store.getFreeCapacity();
                creep.memory.resources = resources[0];
                if(resources[0] <= 0) {
                    Memory.rooms[creep.memory.toHaul].resources.splice(0, 1);
                }
            }
        }
    },
    fill: function(creep) {
        console.log(Memory.rooms[roomName].fillingStructures);
    },
    
    energyStateMachine: function(creep, f1, f2) {
        if(creep.store[RESOURCE_ENERGY] <= 0) {
            creep.memory.state = 0;
        } else if(creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            creep.memory.state = 1;
        }
        
        if(creep.memory.state === 0) {
            f1(creep);
        } else if(creep.memory.state === 1) {
            f2(creep);
        }
    },
    
    run: function(creep) {
        switch(creep.memory.role) {
            case "upgrader":
                this.energyStateMachine(creep, this.getEnergy, this.upgrade)
            break;
            case "harvester":
                this.harvest(creep);
            break;
            case "hauler":
                this.energyStateMachine(creep, this.getEnergy, this.fill)
            break;
        }
    }
};

