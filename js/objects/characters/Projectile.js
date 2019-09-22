var Platformer = Platformer || {};

Platformer.Projectile = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);
    
    this.objectGame.physics.arcade.enable(this);

    // BLOB PROPERTIES -------------------------------------------------------
    this.speed = properties.speed;
    this.maxTime = properties.maxTime;
    this.killTime = 0;
    //this.startTime = 0;
    this.txt = properties.texture;

    // MANAGE ANIMATIONS -------------------------------------------------------
    this.anchor.setTo(0.5,0.5);
    switch (this.txt){
        case 'fireball':
            //this.scale.setTo(1.5,1.5);
            this.animations.add('moveLeft', [0, 1, 2, 3], 15, true);
            this.animations.add('moveRight', [4, 5, 6, 7], 15, true);
            this.body.allowGravity = false;
            break;
        case 'waterball':
            //this.scale.setTo(0.2,0.2);
            //this.scale.setTo(1.2,1.2);
            this.scale.setTo(0.7,0.7);
            this.body.setSize(this.width, this.height);
            this.body.gravity.y *=6;
            this.direction = -1;
            //this.body.bounce.y = 0;
            //this.body.scale.setTo(0.2,0.2);
            break;
    }

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;

    this.kill();    
};

Platformer.Projectile.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Projectile.prototype.constructor = Platformer.Projectile;

Platformer.Projectile.prototype.update = function () {
    "use strict";
    if(!this.alive) return;

    this.objectGame.physics.arcade.collide(this, this.game_state.layers.collision, this.collisionDetected);
    this.objectGame.physics.arcade.overlap(this, this.game_state.groups.enemies, this.hitEnemy, null, this);

    if(this.txt === 'waterball') {
        this.angle += 4*this.direction;
        if(this.body.blocked.left || this.body.blocked.right){
            //this.kill();
            //console.log('changing direction');
            this.direction *= -1;
            this.body.velocity.x = this.direction * this.speed;
        }
    }

    if(this.objectGame.time.now > this.killTime){
        this.kill();
    }
};

Platformer.Projectile.prototype.hitEnemy = function (spell, enemy) {
    this.kill();
    enemy.damage(1);
};

Platformer.Projectile.prototype.collisionDetected = function(s, obj){
    if(s.txt === 'fireball') {
        s.kill();
    }
};

Platformer.Projectile.prototype.fire = function(x, y, dir){
    //this.startTime = this.objectGame.time.now;
    this.killTime = this.objectGame.time.now + this.maxTime;
    this.direction = dir;
    this.reset(x - dir*this.width/3, y);
    switch (this.txt) {
        case 'fireball':
            var anim = dir > 0 ? 'moveRight' : 'moveLeft';
            this.animations.play(anim);
            break;
    }
    this.body.velocity.x = dir * this.speed;
};