var Platformer = Platformer || {};

Platformer.EnemyProjectile = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);

    this.objectGame.physics.arcade.enable(this);

    // BLOB PROPERTIES -------------------------------------------------------
    this.speed = properties.speed;
    this.maxTime = properties.maxTime*3.5;
    this.killTime = 0;
    //this.startTime = 0;
    this.txt = properties.type;
    this.properties = properties;

    // MANAGE ANIMATIONS -------------------------------------------------------
    this.anchor.setTo(0.5,0.5);
    this.body.allowGravity = false;

    if(properties.texture === 'largeBullet') {
        this.anchor.setTo(0.5,0.3);
        this.scale.setTo(0.5,0.5);
        this.body.setSize(15,35);
        this.maxTime *=1.5; 
    }

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.kill();
};

Platformer.EnemyProjectile.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.EnemyProjectile.prototype.constructor = Platformer.EnemyProjectile;

Platformer.EnemyProjectile.prototype.update = function () {
    "use strict";
    if(!this.alive) return;
    //this.game.debug.body(this);
    this.objectGame.physics.arcade.collide(this, this.game_state.layers.collision, this.collisionDetected);
    this.objectGame.physics.arcade.overlap(this, this.game_state.groups.players, this.hitPlayer, null, this);

    if(this.objectGame.time.now > this.killTime){
        this.kill();
    }
};

Platformer.EnemyProjectile.prototype.hitPlayer = function (proj, player) {
    "use strict";
    this.kill();
    player.damage(1);
};

Platformer.EnemyProjectile.prototype.collisionDetected = function(s, obj){
    "use strict";
    s.kill();
};

Platformer.EnemyProjectile.prototype.fire = function(x, y, dir, xT, yT){
    "use strict";
    //this.startTime = this.objectGame.time.now;
    this.killTime = this.objectGame.time.now + this.maxTime;
    this.direction = dir;
    this.reset(x - dir*this.width/3, y);
    var angleDeg =0;
    switch (this.txt) {
        case 'straight':
            this.frame = dir > 0 ? 1 : 0;
            break;
        case 'directional':
            angleDeg = Math.atan2(y - yT, x - xT) * 180 / Math.PI;
            if(this.properties.texture === 'largeBullet'){
                this.frame = dir > 0 ? 1 : 0;
            }else{
                this.angle = angleDeg;
            }
            dir = -1;
            this.body.velocity.y = dir*this.speed * Math.sin(angleDeg*Math.PI/180);
    }
    //console.log(this.body);
    this.body.velocity.x = dir * this.speed *Math.cos(angleDeg*Math.PI/180);
};