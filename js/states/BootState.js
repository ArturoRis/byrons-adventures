var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.BootState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.BootState;

Platformer.BootState.prototype.init = function (levelName) {
    "use strict";
    //console.log('BootState called ' + levelName);
    //console.log(this.init.caller.toString());
    this.levelName = levelName;
};

Platformer.BootState.prototype.preload = function() {
    "use strict";
    this.load.text("Level 1", 'assets/levels/Level 1.json');
    this.load.text("Level 2", 'assets/levels/Level 2.json');
    this.load.text("Level 3", 'assets/levels/Level 3.json');
    this.load.text("Level 4", 'assets/levels/Level 4.json');
    this.load.text("Level 5", 'assets/levels/Level 5.json');
    this.load.text("Level 6", 'assets/levels/Level 6.json');
    this.load.text("Level 7", 'assets/levels/Level 7.json');
    this.load.text("Level 8", 'assets/levels/Level 8.json');
    this.load.text("Level 9", 'assets/levels/Level 9.json');
    //this.load.image('background', 'assets/images/sky.png');
    //this.load.spritesheet('button', 'assets/images/button.png', 145, 45);
    //this.load.image('disabledButton', 'assets/images/DisabledButton.png');
    //this.load.image('logo', 'assets/images/Logo4.png');
    //this.load.image('disabledShopButton', 'assets/images/DisabledShopButton.png');
    //this.load.spritesheet('shopButton', 'assets/images/ShopButton.png', 100, 200);
    //this.load.spritesheet('hearth', 'assets/images/ui/hearth.png', 35, 33);
    //this.load.spritesheet('mana', 'assets/images/ui/mana.png', 32, 32);
    //this.load.spritesheet('fireball', 'assets/images/player/fireball.png', 50, 22);
    //this.load.image('waterball', 'assets/images/player/snowflake2.png');
};

Platformer.BootState.prototype.create = function () {
    "use strict";
    //console.log(this.levelName != 'menu');
    if(this.levelName && this.levelName !== 'menu'){
        var lvl = {'name' :this.levelName};
        this.loadLevel(lvl);
        return;
    }

    if(this.levelName === 'menu'){
        this.createMenu();
        return;
    }

    var bkg = this.add.sprite(0,0, 'background');
    bkg.width = this.game.width;
    bkg.height = this.game.height;
    bkg.smoothed = false;

    this.logo = this.add.image(this.game.width/2,this.game.height/2, 'logo');
    this.logo.scale.setTo(0.8,0.8);
    this.logo.anchor.setTo(0.5,0.5);

    var label = this.game.make.text(0, 200, 'Click to start', { font: 'Verdana' ,fontSize: '50px', fill: '#ffffff' });
    label.anchor.setTo(0.5,0);
    this.logo.addChild(label);

    this.blinking = this.time.events.loop(300, this.blink, this, label);

    myGame.input.onDown.add(this.startGame, this);

    //this.createMenu();
    //console.log('BootState creation end');
};

Platformer.BootState.prototype.blink = function(label){
    //console.log('blnk called');
    "use strict";
    if (!label.alive){
        this.time.events.remove(this.blinking);
    }else{
        if(label.alpha === 1) label.alpha = 0;
        else label.alpha = 1;
    }
};

Platformer.BootState.prototype.loadLevel = function (button) {
    //console.log('loading ' + button.name);
    var level_text, level_data;
    level_text = this.game.cache.getText(button.name);
    level_data = JSON.parse(level_text);
    myGame.state.start("LoadingState", true, false, level_data);
    //myGame.state.start("BootState", true, false, 'menu');
};

Platformer.BootState.prototype.loadShop = function() {
    myGame.state.start('ShopMenu', true, false);
};

Platformer.BootState.prototype.loadSettings = function() {
    myGame.state.start('SettingsMenu', true, false);
};

Platformer.BootState.prototype.startGame = function () {
    myGame.input.onDown.removeAll();
    this.logo.children[0].kill();
    var s = this.add.tween(this.logo.scale);
    s.to({x: 0.3, y:0.3}, 1000, Phaser.Easing.Linear.None);
    var s2 = this.add.tween(this.logo.position);
    s2.to({x: 150, y:60}, 1000, Phaser.Easing.Linear.None);
    s.onComplete.addOnce(this.createMenu, this);
    s.start();
    s2.start();
};

Platformer.BootState.prototype.createMenu = function () {

    var bkg = this.add.sprite(0,0, 'background');
    bkg.width = this.game.width;
    bkg.height = this.game.height;
    bkg.smoothed = false;

    if(!this.logo) {
        this.logo = this.add.image(150, 60, 'logo');
        this.logo.scale.setTo(0.3, 0.3);
        this.logo.anchor.setTo(0.5, 0.5);
    }

    var top = 200;
    var menuName = this.game.add.text(this.game.width/2, top-75, 'Menu', { font: 'Verdana',fontSize: '32px', fill: '#ffffff' });
    menuName.anchor.setTo(0.5,0.5);

    var levelButton = this.game.add.button(this.game.width/2+125, 60, 'button', this.loadShop, this, 0, 1, 2);
    levelButton.anchor.setTo(0.5,0.5);
    levelButton.scale.setTo(0.8,0.8);
    var style = {font: 'Verdana',fontSize: '32px', fill: '#ffffff' };
    var label = this.game.make.text(0, 0, 'Shop', style);
    label.anchor.setTo(0.5,0.5);
    levelButton.addChild(label);

    levelButton = this.game.add.button(this.game.width/2+125+150, 60, 'button', this.loadSettings, this, 0, 1, 2);
    levelButton.anchor.setTo(0.5,0.5);
    levelButton.scale.setTo(0.8,0.8);
    label = this.game.make.text(0, 0, 'Settings', style);
    label.anchor.setTo(0.5,0.5);
    levelButton.addChild(label);

    var offsetY = 220;
    var offsetX = 200;
    var i,name,y= 0,x =0;
    for(i = 0; i< 9 ; i++){
        //var levelButton = this.game.add.image(this.game.width/2, +100 + 70*i, 'button');
        if(!contains(userGameData.levelsUnlocked, i+1+'')){
            levelButton = this.game.add.image(offsetX+200*x, offsetY + 100*y, 'disabledButton');
            levelButton.anchor.setTo(0.5,0.5);
        }else {
            name = 'Level ' + (i + 1);
            levelButton = this.game.add.button(offsetX + 200 * x, offsetY + 100 * y, 'button', this.loadLevel, this, 0, 1, 2);
            levelButton.name = name;
            levelButton.anchor.setTo(0.5, 0.5);

            label = this.game.make.text(0, 0, levelButton.name, style);
            label.anchor.setTo(0.5, 0.5);

            levelButton.addChild(label);
        }
        if((i+1)%3===0) {
            y+=1;
            x=0;
        }else {
            x += 1;
        }
    }
};