var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.PauseMenu = function (game_state, rdButton, nextL){
    
    var i;
    var names = [];
    switch (rdButton){
        case thirdButton.RESUME:
            names = ['Restart' , 'Menu', 'Resume'];
            break;
        case thirdButton.GAME_OVER:
            names = ['Restart' , 'Menu', 'Lose'];
            break;
        case thirdButton.NEXT:
            names = ['Next' , 'Menu', 'Win'];
            break;
        case thirdButton.END:
            names = ['The End', 'End'];
            break;
    }

    this.game_state = game_state;
    this.nextLevel = nextL;

    this.menu = game_state.game.add.image(game_state.width/2,game_state.height/2, 'pauseBkg');
    this.menu.anchor.setTo(0,0);
    //this.menu.fixedToCamera = true;
    this.menu.smoothed = false;
    this.menu.width = game_state.world.width;
    this.menu.height = game_state.world.height;


    this.buttons = [];
    var endLabel, text;
    //console.log(game_state.game.camera);
    for(i = 0; i< names.length ; i++){
        //console.log('button creation');
        //var levelButton = this.game.add.image(this.game.width/2, +100 + 70*i, 'button');
        var name = names[i];
        if(name === 'Lose' || name === 'Win' || name === 'End'){
            switch (name){
                case 'Lose':
                    text = 'You are dead';
                    break;
                case 'Win':
                    text = 'Level Complete';
                    break;
                case 'End':
                    text = 'Congratulations !';
                    break;
            }
            //text = name === 'Lose' ? 'You are dead' : 'Level Complete';
            endLabel = game_state.game.add.text(game_state.game.camera.x +game_state.game.width/2,
                game_state.game.height/2 + game_state.game.camera.y - 100+ 70*i, text, {font: 'Verdana', fontSize: '60px', fill: '#ffffff' });
            endLabel.anchor.setTo(0.5,0);
            continue;
        }

        //var button = game_state.game.add.button(game_state.game.width/2, +100 + 70*i, 'button', this.buttonClicked, this, 0, 0, 0);
        var button = game_state.game.add.button(game_state.game.camera.x +game_state.game.width/2,
                game_state.game.height/2 + game_state.game.camera.y - 100+ 70*i, 'button', this.buttonClicked, this, 0, 1, 2);
        //var button = game_state.game.add.button(0, 70*i, 'button', this.buttonClicked, this, 0, 0, 0);
        //console.log(button);
        button.name = name;
        //button.fixedToCamera = true;
        button.anchor.setTo(0.5,0.5);

        var label = game_state.game.add.text(0, 0, button.name, { font: 'Verdana',fontSize: '32px', fill: '#ffffff' });
        label.anchor.setTo(0.5,0.5);

        button.addChild(label);
        game_state.world.bringToTop(button);
        //this.menu.addChild(button);
        this.buttons[i] = button;
    }

    var enoughMoney = false, i2;
    for(i2 = 0; i2 < gameConstants.powerUps.length; i2++){
        //console.log(gameConstants.powerUps[i2].cost);
        if(userGameData.money >= gameConstants.powerUps[i2].cost)
            enoughMoney = true;
    }

    if(enoughMoney && userGameData.powerUps.length < (gameConstants.powerUps.length - userGameData.powerUpsDisabled.length)) {
        var goToShop = game_state.game.add.text(game_state.game.camera.x + game_state.game.width / 2,
            game_state.game.height / 2 + game_state.game.camera.y - 220, 'You can buy a powerup !\nGo to the shop in the menu', {
                font: 'Verdana',
                fontSize: '25px',
                fill: '#ffffff',
                align: 'center'
            });
        goToShop.anchor.setTo(0.5, 0);
        this.buttons.push(goToShop);
    }

    //console.log('creation');
    //console.log(this.buttons);
    myGame.input.onDown.add(this.buttonClicked, this);
    // pause the game
    game_state.game.paused = true;
    game_state.game.input.enabled = true;
    //this.buttons[0].enable = true;
};

var thirdButton = { 'NEXT' : 'Next Level', 'RESUME' : 'Resume', 'GAME_OVER' : 'Game Over', 'END': 'End'};

Platformer.PauseMenu.prototype.buttonClicked = function(event) {
    //console.log('clicked');
    //console.log(this.buttons);
    //console.log(event);
    //console.log(event.x + ' ' + event.y);
    //if (this.game_state.game.paused) {
    //   switch (event.name) {
    //       case 'Restart':
    //           myGame.state.restart();
    //           break;
    //       case 'Menu':
    //           myGame.state.start('BootState', true, false, 'menu');
    //           break;
    //       case 'Resume':
    //           this.game_state.game.paused = false;
    //           this.menu.destroy();
    //           break;
    //   }
    //}

    var i;
    //console.log(event);
    //var r = this.game_state.game.add.graphics( 0, 0 );
    ////r.fixedToCamera = true;
    //r.beginFill(0xFFFF00, 1);
    //r.boundsPadding = 0;
    ////completionSprite.bounds = new PIXI.Rectangle(0, 0, 200, 200);
    ////r.drawRect(event.x + event.game.camera.x, event.y + event.game.world.height + event.game.camera.height, 10, 10);
    //r.drawRect(event.x + event.game.camera.x, event.y + event.game.camera.y , 10, 10);

    //console.log(event.game.camera);

    for(i = 0; i<this.buttons.length; i++){
        //var button  = this.menu.getChildAt(i);
        //console.log('creating rect');
        var button  = this.buttons[i];
        var rect = new Phaser.Rectangle().copyFrom(button);
        rect.setTo(rect.x - rect.halfWidth, rect.y-rect.halfHeight,rect.width,rect.height);
        // var completionSprite = this.game_state.game.add.graphics( 0, 0 );
        // completionSprite.fixedToCamera = true;
        // completionSprite.beginFill(0xFFFF00, 1);
        // //completionSprite.bounds = new PIXI.Rectangle(0, 0, 200, 200);
        // completionSprite.drawRect(rect.x, rect.y, rect.width, rect.height);
        //
        //
        //console.log('buttons');
        //console.log(rect);
        //console.log(rect.x +' ' +rect.y);
        // check if the user tapped inside the rectangle
        //console.log(rect.contains(event.x,event.y + event.game.world.height - event.game.camera.height));
        if (rect.contains(event.x + event.game.camera.x, event.y + event.game.camera.y)) {
            switch (button.name) {
                case 'Restart':
                    this.game_state.game.paused = false;
                    myGame.input.onDown.removeAll();
                    this.game_state.restart_level();
                    break;
                case 'Menu':
                    this.game_state.game.paused = false;
                    myGame.input.onDown.removeAll();
                    myGame.state.start('BootState', true, false, 'menu');
                    break;
                case 'Resume':
                    this.game_state.game.paused = false;
                    myGame.input.onDown.removeAll();
                    this.menu.destroy();
                    for(i = 0; i<this.buttons.length; i++){
                        this.buttons[i].destroy();
                    }
                    break;
                case 'Next':
                    this.game_state.game.paused = false;
                    myGame.input.onDown.removeAll();
                    myGame.state.start('BootState', true, false, this.nextLevel);
                    break;
                case 'The End':
                    this.game_state.game.paused = false;
                    myGame.input.onDown.removeAll();
                    myGame.state.start('SettingsMenu', true, false, true);
                    break;
            }
        }
    }

};

