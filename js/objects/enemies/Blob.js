var Platformer = Platformer || {};
var Phaser = Phaser || {};

Platformer.Blob = function (game_state, position, properties) {
    "use strict";
    Platformer.Enemy.call(this, game_state, position, properties);
    this._super = Platformer.Enemy.prototype;

    this.attackDistance = properties.attackDistance;

    // MANAGE ANIMATIONS -------------------------------------------------------
    if(properties.texture === 'blob'){
        this.anchor.setTo(0.5,1);
        this.animations.add('moveRight', [0, 1, 2, 3], 10, true);
        this.animations.add('moveLeft', [4, 5, 6, 7], 10, true);
    }else if(properties.texture === 'slime'){
        this.anchor.setTo(0.5,0.9);
        //this.body.setSize(30,15);
        this.scale.setTo(1.5,1.5);
        this.animations.add('moveLeft', Phaser.Animation.generateFrameNames('slime', 2, 5, '', 0), 10, true);
        this.animations.add('moveRight', Phaser.Animation.generateFrameNames('slimeR', 2, 5, '', 0), 10, true);
    }else if(properties.texture === 'crocodile'){
        this.anchor.setTo(0.5,0.75);
        this.body.setSize(this.body.width, this.body.height-2, 0, -2);
        // this.animations.add('moveLeft', [4, 5, 6, 7], 10, true);
        // this.animations.add('moveRight', [8, 9, 10, 11], 10, true);
        this.animations.add('moveLeft', [0, 1, 2, 3], 10, true);
        this.animations.add('moveRight', [4, 5, 6, 7], 10, true);
    }
    this.animations.play('moveLeft');
    
    this.switched = true;
    this.go = false;
};

Platformer.Blob.prototype = Object.create(Platformer.Enemy.prototype);
Platformer.Blob.prototype.constructor = Platformer.Blob;

Platformer.Blob.prototype.update = function () {
    "use strict";
    this._super.update.call(this);
    //console.log(this.properties.direction + ' before');
    if(this.properties.texture === 'crocodile'){
        if(this.detect_player(true)){
            this.attacking = true;
            setTimeout(function(obj){
                obj.go = true;
            }, 300, this);
        }
        //console.log(this.properties.direction);
    }
    if(this.attacking === true){

        if(this.switched){
            if(!this.go){
                this.body.velocity.x = 0;
                this.frame = this.properties.direction < 0 ? 0 : 4;
            }
            else{
                this.body.velocity.x = 250 * this.properties.direction;
                this.switched = false;
                this.attacking = false;
                this.go = false;
            }
        }
    }
};

Platformer.Blob.prototype.switchDirection = function(){
    this._super.switchDirection.call(this);
    this.switched = true;
};