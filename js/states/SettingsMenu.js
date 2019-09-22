var Phaser = Phaser || {};
var Platformer = Platformer || {};
var userGameData = userGameData || {};
var gameConstants = gameConstants || {};

Platformer.SettingsMenu = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.SettingsMenu;

Platformer.SettingsMenu.prototype.init = function (ending) {
    "use strict";
    this.ending = ending;
};

Platformer.SettingsMenu.prototype.preload = function() {
    "use strict";
};

Platformer.SettingsMenu.prototype.create = function () {
    "use strict";
    var bkg = this.add.sprite(0,0, 'background');
    bkg.width = this.game.width;
    bkg.height = this.game.height;
    bkg.smoothed = false;

    this.menuContainer = this.add.group();

    if(this.ending){
        this.showCredits();
    }else {
        this.createSettingsMenu(this.menuContainer);
    }
};

Platformer.SettingsMenu.prototype.update = function () {
    "use strict";
    //if(this.endText) console.log(this.endText.world.y);
    if(this.endText && this.endText.world.y < -50) this.destroyCredits();

};

Platformer.SettingsMenu.prototype.buttonPress = function (button) {
    //console.log('loading ' + button.name);
    "use strict";

    if(button.name === 'Menu'){
        saveProgress();
        myGame.state.start("BootState", true, false, 'menu');
        return;
    }

    if(button.name === 'Credits'){
        this.showCredits();
        return;
    }

    button.getChildAt(1).setText('Press new key');
    this.game.input.keyboard.onDownCallback = function(e) {
        //for demonstration, next line prints the keyCode to console
        button.getChildAt(1).setText(keymapAscii[e.keyCode]);

        switch (button.name) {
            case 'Left':
                userGameData.leftKey = e.keyCode;
                break;
            case 'Right':
                userGameData.rightKey = e.keyCode;
                break;
            case 'Attack':
                userGameData.basicAttackKey = e.keyCode;
                break;
            case 'Jump':
                userGameData.jumpKey = e.keyCode;
                break;
            case 'Fireball':
                userGameData.cast1Key = e.keyCode;
                break;
            case 'Waterball':
                userGameData.cast2Key = e.keyCode;
                break;
        }
        this.game.input.keyboard.onDownCallback = null;
        //here comes your stuff, you might check for certain key, or just trigger a function
    };
};

Platformer.SettingsMenu.prototype.purchase = function(powerup, qty){
    "use strict";
    userGameData.money -= qty;
    userGameData.powerUps.push(powerup);
    this.moneyTextSprite.setText(this.moneyText + userGameData.money);
};

Platformer.SettingsMenu.prototype.showCredits = function () {
    this.menuContainer.removeChildren();
    var top = this.game.height/2;
    var credits = this.make.sprite(this.game.width/2, top, 'logo');
    credits.scale.setTo(0.6,0.6);
    credits.anchor.setTo(0.5,0.5);
    this.menuContainer.addChild(credits);

    this.physics.arcade.enable(credits);
    credits.body.allowGravity = false;

    var style = { font: 'Verdana', fontSize: '32px', fill: '#ffffff', align: 'center' };
    var text = '---  Design and programming ---\nFabio Siliberto\nfor:\nTDDD23 course - LiU';
    top +=100; //top*2+20;
    var label = this.game.make.text(0, top, text, style);
    label.anchor.setTo(0.5,0.5);
    credits.addChild(label);

    text = '--- Graphics sources ---\nflamingtext.com\nUniversal-LPC-spritesheet by jrconway3\nrosprites.blogspot.com\ngamegraphycs.do.am\nrpgmakervxace.net';
    top = label.bottom + 100;
    label = this.game.make.text(0, top, text, style);
    label.anchor.setTo(0.5,0);
    credits.addChild(label);

    text = '--- Special thanks ---\nEmanuela for the name and testing\nMarco, Antonio, Sergio,\nFederica, Vezio, Dorian,\nViktor, Linda\nfor testing';
    top = label.bottom + 100;
    label = this.game.make.text(0, top, text, style);
    label.anchor.setTo(0.5,0);
    credits.addChild(label);

    text = '--- THANK YOU ! ---';
    top = label.bottom + 100;
    this.endText = this.game.make.text(0, top, text, style);
    this.endText.anchor.setTo(0.5,0);
    credits.addChild(this.endText);

    credits.body.velocity.y = -50;

    //this.input.keyboard.onDownCallback = this.destroyCredits;

    //console.log(credits);
    this.input.onDown.add(this.destroyCredits, this);

    //setTimeout(function(obj, dir){
    //    //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
    //    obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, -6);
    //    //this.weapon.body.enable = true;
    //}, (1/15)*1000, this, dir);

};

Platformer.SettingsMenu.prototype.destroyCredits = function (e) {
    //if(!this.menuContainer.getChildAt(0).alive) return;

    this.menuContainer.removeChildren();
    this.createSettingsMenu(this.menuContainer);
    //this.input.keyboard.onDownCallback = null;
    this.endText = null;
    this.input.onDown.removeAll();
    if(this.ending){
        myGame.state.start('LoadingState', true, false, 'menu');
    }
    //here comes your stuff, you might check for certain key, or just trigger a function
};

Platformer.SettingsMenu.prototype.createSettingsMenu = function (container) {
    var logo = this.add.image(150, 60, 'logo');
    logo.scale.setTo(0.3,0.3);
    logo.anchor.setTo(0.5,0.5);
    container.addChild(logo);

    var top = 200;
    var menuName = this.game.add.text(this.game.width/2, top-75, 'Settings', { font: 'Verdana',fontSize: '32px', fill: '#ffffff' });
    menuName.anchor.setTo(0.5,0.5);
    container.addChild(menuName);

    var i, shopButton, label, texts, x, y, keys;
    shopButton = this.game.add.button(this.game.width/2+125+150, 60, 'button', this.buttonPress, this, 0, 1, 2);
    shopButton.anchor.setTo(0.5,0.5);
    shopButton.scale.setTo(0.8,0.8);
    shopButton.name = 'Menu';
    var style = {font: 'Verdana',fontSize: '32px', fill: '#ffffff' };
    label = this.game.make.text(0, 0, shopButton.name, style);
    label.anchor.setTo(0.5,0.5);
    shopButton.addChild(label);
    container.addChild(shopButton);


    texts = ['Left', 'Right', 'Jump', 'Attack', 'Fireball', 'Snowball'];
    keys =  [userGameData.leftKey, userGameData.rightKey, userGameData.jumpKey, userGameData.basicAttackKey, userGameData.cast1Key, userGameData.cast2Key];

    x=0; y=0;
    for(i = 0; i< texts.length ; i++){
        shopButton = this.game.add.button(220+ 300*x, top + 50*y, 'button', this.buttonPress, this, 0, 1, 2);
        shopButton.scale.setTo(0.7,0.7);
        shopButton.name = texts[i];
        shopButton.anchor.setTo(0.5,0.5);
        label = this.game.make.text(0, 0, texts[i], { font: 'Verdana', fontSize: '28px', fill: '#ffffff', align: 'top' });
        label.anchor.setTo(0.5,0.5);
        shopButton.addChild(label);
        label = this.game.make.text(100, 0, keymapAscii[keys[i]], { font: 'Verdana', fontSize: '28px', fill: '#ffffff', align: 'top' });
        label.anchor.setTo(0,0.5);
        shopButton.addChild(label);

        container.addChild(shopButton);

        if((i+1)%2===0) {
            y+=1;
            x=0;
        }else {
            x += 1;
        }
    }

    shopButton = this.game.add.button(this.game.width/2, top + 50*y + 100, 'button', this.buttonPress, this, 0, 1, 2);
    shopButton.scale.setTo(0.7,0.7);
    shopButton.name = 'Credits';
    shopButton.anchor.setTo(0.5,0.5);
    label = this.game.make.text(0, 0, shopButton.name, { font: 'Verdana', fontSize: '28px', fill: '#ffffff', align: 'top' });
    label.anchor.setTo(0.5,0.5);
    shopButton.addChild(label);
    container.addChild(shopButton);

};