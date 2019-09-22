var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.BasicObject = function (game_state, position, properties) {
    "use strict";
    Phaser.Sprite.call(this, game_state.game, position.x, position.y, properties.texture);
    
    this.game_state = game_state;
    this.objectGame = game_state.game;
    
    if(properties.group) this.game_state.groups[properties.group].add(this);

    this._super = Platformer.BasicObject.prototype;

    this._superSprite = Phaser.Sprite.prototype;
};

Platformer.BasicObject.prototype = Object.create(Phaser.Sprite.prototype);
Platformer.BasicObject.prototype.constructor = Platformer.BasicObject;