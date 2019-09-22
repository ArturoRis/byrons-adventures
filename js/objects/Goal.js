var Platformer = Platformer || {};
var userGameData = userGameData || {};

Platformer.Goal = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);
    
    this.nextLevel = properties.next_level;
    this.type = properties.texture;
    this.game_state.game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    
    this.anchor.setTo(0.5,0);
};

Platformer.Goal.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Goal.prototype.constructor = Platformer.Goal;

Platformer.Goal.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.goalReached, null, this);
};

Platformer.Goal.prototype.goalReached = function (goal, player) {
    "use strict";
    userGameData.money = this.game_state.money;
    userGameData.levelsUnlocked.push(this.nextLevel);
    saveProgress();
    //this.game_state.nextLevel(this.next_level);
    if(this.nextLevel === 'end'){
        //myGame.state.start('SettingsMenu', true, false, true);
        new Platformer.PauseMenu(this.game_state, thirdButton.END);
    }else {
        goal.game_state.nextLevel('Level ' + this.nextLevel);
    }
};

