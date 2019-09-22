var Platformer = Platformer || {};
var Phaser = Phaser || {};
var userGameData = userGameData || {};

Platformer.HelperGuy = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);

    this.properties = properties;

    this.objectGame.physics.arcade.enable(this);
    this.body.allowGravity = false;
    this.body.setSize(140,100,0,0);

    this.anchor.setTo(0.5,0.5);
    //this.scale.setTo(1.1,1.1);
    this.animations.add('moveLeft', [1, 2, 3, 4], 15, true);
    this.animations.add('moveRight', [5, 6, 7, 8], 15, true);

    var anim = this.properties.direction < 0 ? 'moveLeft' : 'moveRight';
    this.animations.play(anim);

    var bubbleHeight = -this.body.height*2/3;
    var bubble = this.objectGame.make.sprite( 0, bubbleHeight, 'bubble', 0);
    bubble.anchor.setTo(0.5,0.5);
    bubble.scale.setTo(1.3,1.3);
    this.addChild(bubble);

    //console.log('created helper');
    var testo = 'Hi, Byron !',//properties.text.toString().replace('\\n', '\n'),
        style = { fontSize: '14px', stroke: '#000000', align: 'center'},
        text = this.game.make.text(0, bubbleHeight, testo, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);

    testo = 'I will teach you\na new spell ...';//properties.text.toString().replace('\\n', '\n'),
    text = this.game.make.text(0, bubbleHeight, testo, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);

    switch (properties.spellToActivate){
        case 'fireball':
            //testo = 'You need mana\n(below your health)\nto cast a spell ...';
            testo = 'You need mana';
            var style2 = { fontSize: '12px', stroke: '#000000', align: 'center'};
            text = this.game.make.text(0, bubbleHeight, testo, style2);
            text.anchor.setTo(0.5,1);
            var testo2 = '(below your health)';
            var text2 = this.game.make.text(0, 3, testo2, style2);
            text2.anchor.setTo(0.5,0.5);
            text.addChild(text2);
            testo2 = 'to cast a spell ...';
            text2 = this.game.make.text(0, 28, testo2, style2);
            text2.anchor.setTo(0.5,1);
            text.addChild(text2);
            this.addChild(text);
            testo = 'Push \'' + keymapAscii[userGameData.cast1Key] + '\' to cast\na fireball !';//properties.text.toString().replace('\\n', '\n'),
            break;
        case 'snowball':
            testo = 'Push \'' + keymapAscii[userGameData.cast2Key] + '\' to cast\na snowball !';//properties.text.toString().replace('\\n', '\n'),
            break;
    }
    text = this.game.make.text(0, bubbleHeight, testo, style);
    text.anchor.setTo(0.5,0.5);
    this.addChild(text);

    testo = 'Good job!';//properties.text.toString().replace('\\n', '\n'),
    text = this.game.make.text(0, bubbleHeight, testo, style);
    text.anchor.setTo(0.5,0.5);
    this.addChild(text);

    var index;
    for (index in this.children) {
        //console.log(index);
        if(index < 2) continue;
        this.getChildAt(index).kill();
    }

    this.indexText = 1;

    this.started = false;
    this.keyCast1 = this.objectGame.input.keyboard.addKey(userGameData.cast1Key);
    this.keyCast2 = this.objectGame.input.keyboard.addKey(userGameData.cast2Key);
    this.casted = false;
};

Platformer.HelperGuy.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.HelperGuy.prototype.constructor = Platformer.HelperGuy;

Platformer.HelperGuy.prototype.update = function () {
    "use strict";
    this.objectGame.physics.arcade.overlap(this, this.game_state.groups.players, this.hitPlayer, null, this);
    if(!this.casted && this.started){

        switch (this.properties.spellToActivate){
            case 'fireball':
                if(this.keyCast1.isDown){
                    this.showNextText();
                    this.casted = true;
                    new Platformer.Item(this.game_state, {x : this.x, y : (this.y+50)}, {'texture' : 'manaPot', 'group' : 'items', 'static' : 'true'});
                }
                break;
            case 'snowball':
                if(this.keyCast2.isDown){
                    this.showNextText();
                    this.casted = true;
                    new Platformer.Item(this.game_state, {x : this.x, y : (this.y+50)}, {'texture' : 'manaPot', 'group' : 'items', 'static' : 'true'});
                }
                break;
        }
    }
};

Platformer.HelperGuy.prototype.hitPlayer = function (helper, player) {
    if(!this.started){
        //this.getChildAt(0).renderable = true;
        this.showNextText();
        this.getChildAt(this.indexText).revive();
        setTimeout(function(obj){
            obj.showNextText();
            if(obj.properties.spellToActivate === 'fireball'){
                setTimeout(function(obj){
                    obj.showNextText();
                }, 3000, obj);
            }
        }, 2200, this);

        var spell;
        switch (this.properties.spellToActivate){
            case 'fireball':
                spell = 'fireball';
                if(player.maxMana < 3) {
                    userGameData.maxMana = 3;
                    userGameData.manaPotProb = gameConstants.manaPotProb;
                    var index2 = userGameData.powerUpsDisabled.indexOf('mana');
                    if(index2 > -1) {
                        userGameData.powerUpsDisabled.splice(index2, 1);
                    }
                    player.showMana();
                }
                break;
            case 'snowball':
                spell = 'waterball';
                break;
        }

        player.activateOffensiveMove(spell);
        userGameData.skillsObtained.push(spell);
        var index = userGameData.powerUpsDisabled.indexOf(spell);
        if(index > -1) {
            userGameData.powerUpsDisabled.splice(index, 1);
        }
        this.started=true;
    }
};

Platformer.HelperGuy.prototype.showNextText = function () {
    if(!this.alive) return;
    this.getChildAt(this.indexText).kill();
    this.indexText += 1;
    this.getChildAt(this.indexText).revive();
};