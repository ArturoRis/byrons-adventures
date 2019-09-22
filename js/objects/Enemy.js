var Platformer = Platformer || {};
var Phaser = Phaser || {};

Platformer.Enemy = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);

    this.properties = properties;
    this.altitude = properties.altitude || 0;
    this.objectGame.physics.arcade.enable(this);

    // ENEMY PROPERTIES -------------------------------------------------------
    this.walking_speed = +70;
    this.body.velocity.x = this.walking_speed * properties.direction; //starting direction
    if(properties.bodySizeW) this.body.setSize(properties.bodySizeW,properties.bodySizeH);

    // MANAGE HEALTH -------------------------------------------------------
    this.maxHealth = properties.health/1;
    this.heal(this.maxHealth);
    var hpBar = this.game_state.game.make.sprite(0, -this.body.height - 10, 'healthBarL');
    var pos = this.maxHealth/2;
    var i=0;
    hpBar.anchor.setTo(pos-i,0);
    hpBar.setScaleMinMax(1,1);
    this.addChild(hpBar);
    for(i = 1 ; i< this.maxHealth-1; i++){
        hpBar = this.game_state.game.make.sprite(0, -this.body.height - 10, 'healthBarC');
        hpBar.anchor.setTo(pos-i,0);
        hpBar.setScaleMinMax(1,1);
        this.addChild(hpBar);
    }

    hpBar = this.game_state.game.make.sprite(0, -this.body.height - 10, 'healthBarR');
    hpBar.anchor.setTo(pos-i,0);
    hpBar.setScaleMinMax(1,1);
    this.addChild(hpBar);

    this.previous_x = this.x;
    this.maxDistance = +properties.maxDistance;
    //console.log(this.maxDistance);
    //
    //this.dyingTime = 500;
    //this.blinking = false;
    
    this.attacking = false;
    this.preventAttack = properties.attackRate/1 || 2300;  //time to wait before attack again
    this.nextAttack = 0;
};

Platformer.Enemy.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Enemy.prototype.constructor = Platformer.Enemy;

Platformer.Enemy.prototype.update = function (stop) {
    "use strict";
    if(!this.alive) return;
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.objectGame.physics.arcade.overlap(this, this.game_state.groups.players, this.damagePlayer, null, this);
    if(stop){
        this.body.velocity.x = 0;
        return;
    }
    if ((!this.has_tile_to_walk() || (this.body.blocked.left ) || (this.body.blocked.right)))
    {
        //console.log(this.attacking);
        if(!this.attacking)this.switchDirection();
        else this.body.velocity.x = 0;
    }

    if (this.maxDistance && (Math.abs(this.x - this.previous_x) >= this.maxDistance)) {
        this.switchDirection();
    }

};

Platformer.Enemy.prototype.switchDirection = function(){
    this.properties.direction *= -1;
    this.previous_x = this.x;
    this.body.velocity.x = this.properties.direction * this.walking_speed;
    //console.log(this.body.velocity.x);
    if(this.body.velocity.x >0) this.animations.play('moveRight');
    else this.animations.play('moveLeft');
};

Platformer.Enemy.prototype.damagePlayer = function (en, player){
    player.damage(1);
};

Platformer.Enemy.prototype.kill = function(){
    //console.log(this.alive);
    //this.dyingTime = this.objectGame.time.now + this.dyingTime;
    //this.blinking = this.objectGame.time.events.loop(90, this.blink, this);
    this._superSprite.kill.call(this);
    var random = this.objectGame.rnd;
    var y = this.y - this.body.height;
    if(random.frac() < userGameData.manaPotProb) this.game_state.spawnItem('manaPot', {'x' : this.x, 'y' : y});
    if(random.frac() < userGameData.healthPotProb) this.game_state.spawnItem('healthPot', {'x' : this.x, 'y' : y});
    var i;
    for(i = 0 ; i<gameConstants.coinSpawnNumber; i++){
        var coinValue = random.weightedPick(['Copper', 'Silver', 'Gold']);
        if(random.frac() < gameConstants.coinSpawnProb) this.game_state.spawnItem( coinValue+'Coin', {'x' : this.x, 'y' : y});
    }
};

Platformer.Enemy.prototype.has_tile_to_walk = function () {
    "use strict";
    var direction, postitioToCheck, map, nextTileGround;
    //direction = (this.body.velocity.x < 0) ? -1 : 1;
    direction = this.properties.direction;
    // check if the next position has a tile
    // the y is the position + 24(tileHeight)*altitude + 12 (magical offset from nowhere, but empirical) + 1(tile below)
    postitioToCheck = new Phaser.Point(this.x + (direction * this.body.width/2 ),  this.y + 24*this.altitude + 12 +1);
    //postitioToCheck = new Phaser.Point(this.x + (direction * this.game_state.map.tileWidth), this.bottom + 1);
    map = this.game_state.map;
    // getTileWorldXY returns the tile in a given position
    nextTileGround = map.getTileWorldXY(postitioToCheck.x, postitioToCheck.y, map.tileWidth, map.tileHeight, "collision");
    return nextTileGround !== null;
};

Platformer.Enemy.prototype.damage = function (dmg){
    if(dmg === 0) return;
    //if (this.objectGame.time.now > this.timeDelay){
        var hp = this._superSprite.damage.call(this, dmg).health;
        //var hp = this.health-1;
        if(hp>0){
            this.removeChildAt(hp);
        }else{
            //this.game_state.basicObjects.Byron.fillMana(1);
            this.destroy();
        }
      //  this.timeDelay = this.objectGame.time.now + this.timeInvulnerability;
    //}
};

Platformer.Enemy.prototype.detect_player = function (everywhere) {
    "use strict";
    var now = this.objectGame.time.now;
    if(now < this.nextAttack){
        return false;
    }

    var playX = this.game_state.basicObjects.Byron.x;
    var playY = this.game_state.basicObjects.Byron.y;
    //var distance_to_player = Math.abs(this.x - playX);
    var distance_to_player = Math.sqrt(Math.pow(this.x - playX,2) + Math.pow(this.y - playY,2));
    var directionPlayer = this.x - playX;
    //var result = (Math.abs(this.y - playY) < 200) && (Math.abs(distance_to_player) <= this.attackDistance);
    var result = (distance_to_player <= this.attackDistance);
    if(directionPlayer*this.properties.direction > 0 && result && everywhere){
        //console.log('switching to attack');
        this.switchDirection();
    }
    result = result && (directionPlayer*this.properties.direction < 0 || everywhere);
    if(result) this.nextAttack = now + this.preventAttack;
    return result;
        //&& distance_to_player*this.properties.direction < 0;
};

// Callback on event loop, being hit/invulnerable
Platformer.Enemy.prototype.blink = function(){
    "use strict";
    //console.log('blink called' + this.alpha);
    if (this.objectGame.time.now > this.dyingTime){
        //console.log('killing');
        this.alpha = 1;
        this._superSprite.kill.call(this);
        this.objectGame.time.events.remove(this.blinking);
    }else{
        if(this.alpha === 1) this.alpha = 0.3;
        else this.alpha = 1;
    }
};