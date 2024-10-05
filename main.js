Memory.username = "TomTom";


let dataMod = require('data');
let spawners = require('spawner');
let roles = require('roles');
const Pathing = require('pathing');


module.exports.loop = function () {
    if(!Memory.rooms) {
        Memory.rooms = {};
    }
    if(Game.spawns["Spawn1"]) {
        Memory.username = Game.spawns["Spawn1"].owner.username;
    }

    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
        }
    }
    
    spawners.run();
    dataMod.run();
    

    for(let name in Game.creeps) {
        let creep = Game.creeps[name];
        roles.run(creep)
    }
    Pathing.runMoves();
}

