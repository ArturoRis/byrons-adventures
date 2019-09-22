var Platformer = Platformer || {};

Platformer.Archer = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // MANAGE ANIMATIONS -------------------------------------------------------
    this.anchor.setTo(0.5,0.75);
    var n = 13; //13 per riga
    this.animations.add('moveLeft', _.range(n*9, n*9+9), 20, true);
    this.animations.add('moveRight', _.range(n*11, n*11+9), 20, true);
    var animat = this.animations.add('shootLeft', _.range(n*17, n*17+11), 25, false);
    animat.onComplete.add(function(){
        this.attacking = false;
        this.animations.play('moveLeft');
    }, this);
    animat = this.animations.add('shootRight', _.range(n*19, n*19+11), 25, false);
    animat.onComplete.add(function(){
        this.attacking = false;
        this.animations.play('moveRight');
    }, this);

    var frame = this.properties.direction < 0 ? n*17 : n*19;
    this.frame = frame;

    //console.log('archer created');
    var i;
    this.arrows = this.objectGame.add.group();
    for(i = 0; i<5; i++){
        var prop = {"texture":"arrow", "speed":300, "maxTime":this.attackDistance, "type": 'straight'};
        this.arrows.add(new Platformer.EnemyProjectile(this.game_state, {"x":0,"y":0}, prop));
    }

    // this.attacking = false;
    // this.preventAttack = 2000;  //time to wait before attack again
    // this.nextAttack = 0;
};

Platformer.Archer.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.Archer.prototype.constructor = Platformer.Archer;

Platformer.Archer.prototype.update = function () {
    "use strict";

    if (this.detect_player(false)) {
        // player is inside detection range, run towards it
        //console.log('player detected');
        var shoot = this.properties.direction > 0 ? 'shootRight' : 'shootLeft';
        setTimeout(function(obj){
            //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
            if(obj.alive) obj.arrows.getFirstDead().fire(obj.x, obj.y-10, obj.properties.direction);
            //this.weapon.body.enable = true;
        }, (9/25)*1000, this);
        this.animations.play(shoot);
        this.attacking = true;
    }

    this._super.update.call(this, true);
    if(this.attacking){
        this.body.velocity.x = 0;
    }else{
        //this.body.velocity.x = this.properties.direction * this.walking_speed;
        var frame = this.properties.direction < 0 ? 13*17 : 13*19;
        this.frame = frame;
    }
};

// Platformer.Archer.prototype.detect_player = function () {
//     "use strict";
//     var now = this.objectGame.time.now;
//     if(now < this.nextAttack){
//         return false;
//     }

//     this.nextAttack = now + this.preventAttack;
//     var playX = this.game_state.basicObjects.Byron.x;
//     var playY = this.game_state.basicObjects.Byron.y;
//     var distance_to_player = this.x - playX;
//     return (Math.abs(this.y - playY) < 50) && (Math.abs(distance_to_player) <= this.attackDistance)
//             && distance_to_player*this.properties.direction < 0;
// };