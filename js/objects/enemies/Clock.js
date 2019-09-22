var Platformer = Platformer || {};
var Phaser = Phaser || {};

Platformer.Clock = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // MANAGE ANIMATIONS -------------------------------------------------------
    this.anchor.setTo(0.5,0.8);
    this.scale.setTo(0.8,0.8);
    this.body.setSize(this.properties.bodySizeW, this.properties.bodySizeH, 0, 0);
    this.animations.add('moveLeft', Phaser.Animation.generateFrameNames('left', 1, 16, '', 0), 15, true);
    this.animations.add('moveRight', Phaser.Animation.generateFrameNames('right', 1, 16, '', 0), 15, true);
    
    var animat = this.animations.add('attackLeft', Phaser.Animation.generateFrameNames('left', 17, 32, '', 0), 20, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'left');
    animat.onComplete.add(this.resizeOriginalBody,this);
    animat = this.animations.add('attackRight', Phaser.Animation.generateFrameNames('right', 17, 32, '', 0), 20, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'right');
    animat.onComplete.add(this.resizeOriginalBody,this);

    this.animations.play('moveLeft');
    
};

Platformer.Clock.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.Clock.prototype.constructor = Platformer.Clock;

Platformer.Clock.prototype.resizeOriginalBody = function(){
    "use strict";
    this.attacking = false;
    this.anchor.setTo(0.5,0.8);
    this.body.setSize(this.properties.bodySizeW, this.properties.bodySizeH, 0, 0);
    var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
    this.animations.play(anim);
};

// Callback on attack animation start
Platformer.Clock.prototype.resizeAttackBody = function(player, animation, direction){
    "use strict";
    this.attacking = true;
    var scale = this.properties.direction > 0 ? 0.2 : 0.8;
    this.anchor.setTo(scale, 0.8);
    var dir = direction === 'left' ? -1 : 1;
    //var obj =this;
    setTimeout(function(obj, dir){
        //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
        if(obj.alive) obj.body.setSize(obj.properties.bodySizeW/1+155, obj.properties.bodySizeH, dir*(obj.properties.bodySizeW)/2, 0);
        //this.weapon.body.enable = true;
    }, (8/20)*1000, this, dir);  //(2 frame / 15 fps)*1000 per msec   ---- for fps see animation above
};

Platformer.Clock.prototype.update = function () {
    "use strict";
    this._super.update.call(this);
    if (this.detect_player(false)) {
        // player is inside detection range, run towards it
        //console.log('player detected');
        //var attack = this.properties.direction > 0 ? 'attackRight' : 'attackLeft';
        //var obj = this;
        setTimeout(function(obj){
            //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
            if(obj.alive){
                //console.log('attacking');
                var anim = obj.properties.direction < 0 ? 'attackLeft' : 'attackRight';
                obj.animations.play(anim);
            }
            //this.weapon.body.enable = true;
        }, 400, this);
        //this.animations.play(attack);
        this.attacking = true;
    }
    this._super.update.call(this);
    if(this.attacking){
        this.body.velocity.x = 0;
    }else{
        this.body.velocity.x = this.properties.direction * this.walking_speed;
    }
};
