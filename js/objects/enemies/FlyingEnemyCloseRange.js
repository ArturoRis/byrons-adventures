var Platformer = Platformer || {};

Platformer.FlyingEnemyCloseRange = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // flying enemies are not affected by gravity
    this.body.allowGravity = false;

    this.anchor.setTo(0.5,0.5);
    this.scale.setTo(0.9,0.9);
    this.animations.add("moveLeft", Phaser.Animation.generateFrameNames('left', 1, 16, '', 0), 12, true);
    this.animations.add("moveRight", Phaser.Animation.generateFrameNames('right', 1, 16, '', 0), 12, true);
    this.animations.play('moveLeft');

    var animat = this.animations.add('attackRight', Phaser.Animation.generateFrameNames('right', 17, 24, '', 0), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'right');
    animat.onComplete.add(this.resizeOriginalBody,this);
    animat = this.animations.add('attackLeft', Phaser.Animation.generateFrameNames('left', 17, 24, '', 0), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'left');
    animat.onComplete.add(this.resizeOriginalBody,this);

    //console.log(this.body.velocity.x);
    // this.attacking = false;
    // this.preventAttack = 2000;  //time to wait before attack again
    // this.nextAttack = 0;
    this.prevPosition = {};
    this.goingBack = false;
    this.prevX = 0;
    this.prevY = 0;
    this.prevBodyY = 0;
    this.xTarget = 0;
    this.yTarget = 0;
    this.targetAcquired = false;
    //console.log(this.body.y);
};

Platformer.FlyingEnemyCloseRange.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.FlyingEnemyCloseRange.prototype.constructor = Platformer.FlyingEnemyCloseRange;

Platformer.FlyingEnemyCloseRange.prototype.resizeOriginalBody = function(){
    "use strict";
    this.attacking = false;
    this.targetAcquired = false;
    this.body.setSize(this.properties.bodySizeW, this.properties.bodySizeH, 0, 0);
    var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
    this.goingBack = true;
    this.animations.play(anim);
    //this.weapon.body.enable = false;
};

// Callback on attack animation start
Platformer.FlyingEnemyCloseRange.prototype.resizeAttackBody = function(player, animation, direction){
    "use strict";
    this.attacking = true;
    this.targetAcquired = true;
    //console.log(dir);
    var dir = direction === 'left' ? -1 : 1;
    //var obj =this;
    //setTimeout(function(obj, dir){
        //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
        this.body.setSize(this.properties.bodySizeW/1+10, this.properties.bodySizeH, dir*(this.properties.bodySizeW)/2, 0);
        //this.weapon.body.enable = true;
    //}, (1/15)*1000, this, dir);  //(2 frame / 15 fps)*1000 per msec   ---- for fps see animation above
};

Platformer.FlyingEnemyCloseRange.prototype.update = function () {
    "use strict";
    //console.log(this.goingBack + ' '+ this.body.velocity.x);
    if(this.goingBack){
        this.nextAttack = this.objectGame.time.now + this.preventAttack + 200;
        this.objectGame.physics.arcade.moveToXY(this, this.prevX, this.prevY, 200);
        var dx = this.prevX - this.x;
        var dy = this.prevY - this.y;
        //console.log(dx + ' ' + dy);
        if(-2<dx==dx<2 && -2<dy==dy<2){
        //if(dx===dy===0){
            // this.y = this.prevPosition.y;
            // this.x = this.prevPosition.x;
            this.goingBack = false;
            this.body.velocity.y = 0;
            this.body.y = this.prevBodyY;
        }
        return;
    }
    //console.log(this.body.y + ' ' + this.prevY);
    // var now =this.objectGame.time.now;
    // if (now > this.nextAttack && this.detect_player()) {
    //     this.nextAttack = now + this.preventAttack;
    if(this.detect_player(false) && ! this.targetAcquired){
        //console.log('player detected');
        // player is inside detection range, run towards it
        //console.log('player detected bee' + this.objectGame.time.now);
        var animat = this.properties.direction < 0 ? 'attackLeft' : 'attackRight';
        this.prevX= this.x;
        this.prevY = this.y;
        this.prevBodyY = this.body.y;
        this.xTarget = this.game_state.basicObjects.Byron.x;
        this.yTarget = this.game_state.basicObjects.Byron.y;
        //this.animations.play(animat);
        setTimeout(function(obj, xT, yT){
            obj.animations.play(animat);
        }, 300, this, animat);
        this.animations.stop();
        this.attacking = true;
    }
    this._super.update.call(this, this.attacking);
    if(!this.targetAcquired && this.attacking){
        this.animations.stop();
        this.body.velocity.x = 0;
        return;
    }
    if(this.targetAcquired){
        this.game_state.game.physics.arcade.moveToXY(this, this.xTarget, this.yTarget, 200);
    }else{
        this.body.velocity.x = this.properties.direction * this.walking_speed;
        var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
        this.animations.play(anim);
    }
};
