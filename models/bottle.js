'use strict'

let redis = require('redis');
let uuid = require('node-uuid');

let type = {male: 1, female: 0};

function throwBottle(bottle, callback){
    let client = redis.createClient();
    let bottleId = uuid.v4();
    bottle.time = bottle.time || Date.now();

    client.select(type[bottle.type], function(){
        client.hmset(bottleId, bottle, function(err, res){
            if(err){
                console.log(err);
                return callback({code: 0, msg: 'retry later...'});
            }

            client.expire(bottleId, 861400, function(err, res){
                client.quit();
            });

            callback({code: 1, msg: 'succeed...'});
        })
    });
}

function pickBottle(info, callback){
    let client = redis.createClient();
    client.select(type[info.type], function(){
        client.randomkey(function(err, bottleId){
            if(err){
                return callback({code: 0, msg:err});
            }

            if(!bottleId){
                return callback({code: 1, msg: 'starfish...'});
            }

            client.hgetall(bottleId, function(err, bottle){
                if(err){
                    return callback({code: 0, msg: 'bottle is broken...'});
                }

                client.del(bottleId, function(err, res){
                    client.quit();
                });
                
                callback({code: 1, msg: bottle});
            });
        })
    })
}

module.exports = {
    throw: throwBottle,
    pick: function(info, callback){
        if(Math.random() <= 0.2){
            callback({code: 1, msg: 'starfish...'});
            return;
        }

        pickBottle(info, callback);
    }
}