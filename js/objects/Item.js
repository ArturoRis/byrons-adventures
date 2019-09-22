var Platformer = Platformer || {};

Platformer.Item = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);
    
    this.game_state.game.physics.arcade.enable(this);
    this.type = properties.texture;
    this.anchor.setTo(0.5,0);
    if(!properties.static){
        this.body.bounce.y = 0.6;
        this.body.collideWorldBounds = true;

        var random = this.objectGame.rnd;
        this.body.velocity.x = random.realInRange(0.4, 1) * 150 * random.pick([-1, 1]);
        this.body.velocity.y = random.realInRange(0.3, 0.8) * -300;

    }else{
        this.body.allowGravity = false;
    }
    //console.log('item created ' + this.y);
};

Platformer.Item.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Item.prototype.constructor = Platformer.Item;

Platformer.Item.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);

    if (this.body.velocity.x > 1) {
        this.body.velocity.x -= 1;
        return;
    }
    if (this.body.velocity.x < -1) {
        this.body.velocity.x += 1;
        return;
    }
    this.body.velocity.x = 0;
};