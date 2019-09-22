var Platformer = Platformer || {};

Platformer.Sign = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);

    this.game_state.game.physics.arcade.enable(this);

    this.body.bounce.y = 0;
    this.body.setSize(this.body.width * 1.5, this.body.height, 0, 0);

    this.anchor.setTo(0.5, 0.5);

    var testo,// = properties.text.toString().replace('\\n', '\n'),
        style = { fontSize: '14px', stroke: '#000000', align: 'center'};

    switch (properties.text){
        case '1':
            testo = 'Try \'' + keymapAscii[userGameData.leftKey] + '\'\nand \'' + keymapAscii[userGameData.rightKey] + '\'';
            break;
        case '2':
            testo = '\'' + keymapAscii[userGameData.jumpKey] + '\'\nto jump';
            break;
        case '3':
            //testo = '\'' + keymapAscii[userGameData.jumpKey] + '\' x 2\nto double jump';
            testo = 'Try \'' + keymapAscii[userGameData.jumpKey] + '\'\nin air';
            break;
        case '4':
            testo = '\'' + keymapAscii[userGameData.basicAttackKey] + '\'\nto attack';
            break;
        default :
            testo = properties.text.toString().replace('\\n', '\n');
    }

    var text = this.game.make.text(0, 5, testo, style);
    text.anchor.setTo(0.5, 1);
    this.addChild(text);
    this.renderable = false;
};

Platformer.Sign.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Sign.prototype.constructor = Platformer.Sign;

Platformer.Sign.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    if (!this.renderable)
        this.game_state.game.physics.arcade.overlap(this, this.game_state.basicObjects.Byron, this.collided, null);
};

Platformer.Sign.prototype.collided = function(obj){
    "use strict";
    //console.log('overlapping');
    //console.log(obj);
    if(obj === obj.game_state.basicObjects.Tutorial4) userGameData.healthPotProb = gameConstants.healthPotProb;
    obj.renderable = true;
};