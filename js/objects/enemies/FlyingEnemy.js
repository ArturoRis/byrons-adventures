var Platformer = Platformer || {};

Platformer.FlyingEnemy = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // flying enemies are not affected by gravity
    this.body.allowGravity = false;

    this.anchor.setTo(0.5,0.5);
    this.animations.add("moveLeft", [0, 1, 2], 12, true);
    this.animations.add("moveRight", [3, 4, 5], 12, true);
    this.animations.play('moveLeft');

    if(properties.texture === 'libellula') this.scale.setTo(0.9,0.9);

    var i;
    this.bullets = this.objectGame.add.group();
    for(i = 0; i<5; i++){
        var prop = {"texture":"bullet", "speed":300, "maxTime":this.attackDistance, "type": 'directional'};
        this.bullets.add(new Platformer.EnemyProjectile(this.game_state, {"x":0,"y":0}, prop));
    }

    //console.log(this.body.velocity.x);
    // this.attacking = false;
    // this.preventAttack = 2000;  //time to wait before attack again
    // this.nextAttack = 0;
};

Platformer.FlyingEnemy.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.FlyingEnemy.prototype.constructor = Platformer.FlyingEnemy;

Platformer.FlyingEnemy.prototype.update = function () {
    "use strict";

    // var now =this.objectGame.time.now;
    // if (now > this.nextAttack && this.detect_player()) {
    //     this.nextAttack = now + this.preventAttack;
    if(this.detect_player(false)){
        //console.log('player detected');
        // player is inside detection range, run towards it
        //console.log('player detected bee' + this.objectGame.time.now);
        var shoot = this.properties.direction > 0 ? 4 : 1;
        var xTarget = this.game_state.basicObjects.Byron.x;
        var yTarget = this.game_state.basicObjects.Byron.y;
        setTimeout(function(obj, xT, yT){
            //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
            if(obj.alive) obj.bullets.getFirstDead().fire(obj.x, obj.y-10, obj.properties.direction, xT, yT);
            obj.attacking = false;
            //this.weapon.body.enable = true;
        }, 200, this, xTarget, yTarget);
        if(this.properties.attacksNum){
            setTimeout(function(obj){
                //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
                var xT = obj.game_state.basicObjects.Byron.x;
                var yT = obj.game_state.basicObjects.Byron.y;
                if(obj.alive) obj.bullets.getFirstDead().fire(obj.x, obj.y-10, obj.properties.direction, xT, yT);
                //obj.attacking = false;
                //this.weapon.body.enable = true;
            }, 500, this);
        }
        this.animations.stop();
        this.animations.frame = shoot;
        this.attacking = true;
    }
    this._super.update.call(this, this.attacking);
    if(this.attacking){
        this.body.velocity.x = 0;
    }else{
        this.body.velocity.x = this.properties.direction * this.walking_speed;
        var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
        this.animations.play(anim);
    }
};

// Platformer.FlyingEnemy.prototype.detect_player = function () {
//     "use strict";
//     //var now =this.objectGame.time.now;
//     //if(now < this.nextAttack){
//     //    return false;
//     //}
//     //console.log('looking for player');
//     var playX = this.game_state.basicObjects.Byron.x;
//     var distance_to_player = this.x - playX;
//     //return (Math.abs(this.y - playY) < 100) && (Math.abs(distance_to_player) <= this.attackDistance)
//     return (Math.abs(distance_to_player) <= this.attackDistance)
//         && distance_to_player*this.properties.direction < 0;
// };
