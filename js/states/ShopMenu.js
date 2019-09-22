var Phaser = Phaser || {};
var Platformer = Platformer || {};
var userGameData = userGameData || {};
var gameConstants = gameConstants || {};

Platformer.ShopMenu = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.ShopMenu;

Platformer.ShopMenu.prototype.init = function () {
    "use strict";
};

Platformer.ShopMenu.prototype.preload = function() {
    "use strict";

};

Platformer.ShopMenu.prototype.create = function () {
    "use strict";
    var bkg = this.add.sprite(0,0, 'background');
    bkg.width = this.game.width;
    bkg.height = this.game.height;
    bkg.smoothed = false;

    this.logo = this.add.image(150, 60, 'logo');
    this.logo.scale.setTo(0.3,0.3);
    this.logo.anchor.setTo(0.5,0.5);

    var top2 = 200;
    var menuName = this.game.add.text(this.game.width/2, top2-75, 'Shop', { font: 'Verdana',fontSize: '32px', fill: '#ffffff' });
    menuName.anchor.setTo(0.5,0.5);

    var i, name, shopButton, label, costTxt, text, icon, cost, offset, testo;
    text = 'Menu';
    name = text;
    var top = 150;
    shopButton = this.game.add.button(this.game.width/2+125+150, 60, 'button', this.buttonPress, this, 0, 1, 2);
    shopButton.anchor.setTo(0.5,0.5);
    shopButton.scale.setTo(0.8,0.8);
    shopButton.name = {name : 'Menu'};
    var style = {font: 'Verdana',fontSize: '32px', fill: '#ffffff' };
    label = this.game.make.text(0, 0, shopButton.name.name, style);
    label.anchor.setTo(0.5,0.5);
    shopButton.addChild(label);
    offset = -65;
    for(i = 0; i< gameConstants.powerUps.length ; i++){
        //var shopButton = this.game.add.image(this.game.width/2, +100 + 70*i, 'button');
        text = gameConstants.powerUps[i].text;
        name = gameConstants.powerUps[i].name;
        cost = gameConstants.powerUps[i].cost;
        if(contains(userGameData.powerUpsDisabled, name)) {
            shopButton = this.game.add.sprite(175+i/2*300, this.game.height/2 + top/2, 'disabledShopButton');
            shopButton.anchor.setTo(0.5,0.5);
        }else{
            if(contains(userGameData.powerUps, name)){
                shopButton = this.game.add.sprite(175+i/2*300, this.game.height/2+ top/2, 'shopButton');
                testo = 'Obtained';
                shopButton.frame = 2;
            }else {
                shopButton = this.game.add.button(175 + i / 2 * 300, this.game.height /2+top/2, 'shopButton', this.buttonPress, this, 0, 1, 2);
                testo = 'Cost:\n' + cost;
            }
            shopButton.name = {'name' : name, 'cost':cost};
            shopButton.anchor.setTo(0.5,0.5);

            label = this.game.make.text(0, offset, text, { font: 'Verdana',fontSize: '23px', fill: '#ffffff', align: 'center' });
            label.anchor.setTo(0.5,0.5);

            icon = this.game.make.image(0, offset+50, name);
            icon.anchor.setTo(0.5,0.5);
            if(name === 'waterball') icon.scale.setTo(0.7,0.7);

            costTxt = this.game.make.text(0, offset+130, testo, { font: 'Verdana',fontSize: '20px', fill: '#ffffff', align: 'center' });
            costTxt.anchor.setTo(0.5,0.5);

            shopButton.addChild(label);
            shopButton.addChild(icon);
            shopButton.addChild(costTxt);
        }
    }

    // CREATING MONEY TEXT
    this.moneyText = "Your coins: ";
    this.moneyTextSprite = this.game.add.text(this.game.width/2, top+75,this.moneyText + userGameData.money, { font: 'Verdana',fontSize: '27px', fill: '#ffffff' });
    this.moneyTextSprite.anchor.setTo(0.5,0.5);
};

Platformer.ShopMenu.prototype.buttonPress = function (button) {
    //console.log('loading ' + button.name);
    "use strict";

    switch (button.name.name){
        case 'Menu':
            saveProgress();
            myGame.state.start("BootState", true, false, 'menu');
            break;
        case 'hearth':
            if(userGameData.money >= button.name.cost){
                this.purchase(button.name.name ,button.name.cost);
                button.input.enabled = false;
                button.freezeFrames = true;
                button.frame = 2;
                button.children[2].setText('Obtained');
                userGameData.maxHealth += 1;
            }
            break;
        case 'mana':
            if(userGameData.money >= button.name.cost){
                this.purchase(button.name.name ,button.name.cost);
                button.input.enabled = false;
                button.freezeFrames = true;
                button.frame = 2;
                button.children[2].setText('Obtained');
                userGameData.maxMana += 1;
            }
            break;
        case 'fireball':
            if(userGameData.money >= button.name.cost){
                this.purchase(button.name.name ,button.name.cost);
                button.input.enabled = false;
                button.freezeFrames = true;
                button.frame = 2;
                button.children[2].setText('Obtained');
                userGameData.rangeFireball += 1000;
            }
            break;
        case 'waterball':
            if(userGameData.money >= button.name.cost){
                this.purchase(button.name.name ,button.name.cost);
                button.input.enabled = false;
                button.freezeFrames = true;
                button.frame = 2;
                button.children[2].setText('Obtained');
                userGameData.rangeWaterball += 1000;
            }
            break;
    }
};

Platformer.ShopMenu.prototype.purchase = function(powerup, qty){
    "use strict";
    userGameData.money -= qty;
    userGameData.powerUps.push(powerup);
    this.moneyTextSprite.setText(this.moneyText + userGameData.money);
};