var Platformer = Platformer || {};

Platformer.Skeleton = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // MANAGE ANIMATIONS -------------------------------------------------------
    this.anchor.setTo(0.5,0.75);
    var n = 13; //13 per riga
    var fskip = 1;
    this.animations.add('moveLeft', _.range(n*9, n*9+9), 20, true);
    this.animations.add('moveRight', _.range(n*11, n*11+9), 20, true);
    var animat = this.animations.add('attackRight', _.range(n*7+fskip, n*7+7), 15, false);
    //animat.onComplete.add(function(){
    //    this.attacking = false;
    //    this.animations.play('moveLeft');
    //}, this);
    animat = this.animations.add('attackLeft', _.range(n*5+fskip, n*5+7), 15, false);
    //animat.onComplete.add(function(){
    //    this.attacking = false;
    //    this.animations.play('moveRight');
    //}, this);


    this.weapon = this.objectGame.make.sprite(0,0, 'skeletonWeapon');
    this.weapon.anchor.setTo(0.45,0.58);
    this.attackRange=50;
    this.weapon.name = 'weapon';
    animat = this.weapon.animations.add('attackLeft', _.range(8+fskip,14), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'left');
    animat.onComplete.add(this.resizeOriginalBody,this);

    animat = this.weapon.animations.add('attackRight', _.range(24+fskip,30), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'right');
    animat.onComplete.add(this.resizeOriginalBody, this);
    this.weapon.visible = false;
    this.addChild(this.weapon);

    this.objectGame.physics.arcade.enable(this.weapon);
    this.weapon.body.allowGravity = false;
    this.weapon.body.setSize(0,0,0,0);

    // this.attacking = false;
    // this.preventAttack = 2000;  //time to wait before attack again
    // this.nextAttack = 0;
    //console.log(this.weapon);
    this.wait = false;
};

Platformer.Skeleton.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.Skeleton.prototype.constructor = Platformer.Skeleton;

// Callback on attack animation complete
Platformer.Skeleton.prototype.resizeOriginalBody = function(){
    "use strict";
    this.weapon.visible = false;
    this.attacking = false;
    //this.body.setSize(this.originalBodyWidth, this.originalBodyHeight, 0, 0);
    this.weapon.body.setSize(0, 0, 0, 0);
    var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
    this.animations.play(anim);
    //this.weapon.body.enable = false;
};

// Callback on attack animation start
Platformer.Skeleton.prototype.resizeAttackBody = function(player, animation, direction){
    "use strict";
    this.attacking = true;
    this.weapon.visible = true;
    //console.log(dir);
    var dir = direction === 'left' ? -1 : 1;
    //var obj =this;
    setTimeout(function(obj, dir){
        //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
        obj.weapon.body.setSize(obj.attackRange, obj.height-40, dir*obj.width/2, -6);
        //this.weapon.body.enable = true;
    }, (1/15)*1000, this, dir);  //(2 frame / 15 fps)*1000 per msec   ---- for fps see animation above
};

Platformer.Skeleton.prototype.update = function () {
    "use strict";
    if(this.weapon.visible) this.objectGame.physics.arcade.overlap(this.weapon, this.game_state.groups.players, this.playerHit, null, this);
    this._super.update.call(this);
    if (this.detect_player(false)) {
        // player is inside detection range, run towards it
        //console.log('player detected');
        setTimeout(function(obj){
            setTimeout(function(obj){
                //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
                if(obj.alive){
                    //console.log('attacking');
                    var anim = obj.properties.direction < 0 ? 'attackLeft' : 'attackRight';
                    obj.animations.play(anim);
                    obj.weapon.animations.play(anim);
                }
                //this.weapon.body.enable = true;
            }, 300, obj);
            obj.wait = false;
        }, 300, this);
        this.wait = true;
        this.attacking = true;
    }
    if(this.attacking){
        if(this.wait){
            this.body.velocity.x = true;
            this.frame = this.properties.direction <0 ? 13*9 : 13*11;
        }else {
            //console.log(this.body.velocity.x );
            //console.log(this.properties.direction);
            //console.log(this.has_tile_to_walk() );
            //if (this.body.velocity.x !== 0) this.body.velocity.x = 200 * this.properties.direction;
            if (this.has_tile_to_walk()) this.body.velocity.x = 200 * this.properties.direction;
        }
    }else{
        this.body.velocity.x = this.properties.direction * this.walking_speed;
    }
};

Platformer.Skeleton.prototype.playerHit = function (weapon, player) {
    //"use strict";
    player.damage(1);
};

// Platformer.Skeleton.prototype.detect_player = function () {
//     "use strict";
//     var now = this.objectGame.time.now;
//     if(now < this.nextAttack){
//         return false;
//     }

//     this.nextAttack = now + this.preventAttack;
//     var playX = this.game_state.basicObjects.Byron.x;
//     var playY = this.game_state.basicObjects.Byron.y;
//     var distance_to_player = this.x - playX;
//     var result = (Math.abs(this.y - playY) < 200) && (Math.abs(distance_to_player) <= this.attackDistance);
//     if(distance_to_player*this.properties.direction > 0 && result){
//         //console.log('switching to attack');
//         this.switchDirection();
//     }
//     return result;
//         //&& distance_to_player*this.properties.direction < 0;
// };
