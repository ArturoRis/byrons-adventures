var Platformer = Platformer || {};
var Phaser = Phaser || {};
var userGameData = userGameData || {};

Platformer.Byron = function (game_state, position, properties) {
    "use strict";
    Platformer.BasicObject.call(this, game_state, position, properties);

    // MANAGE HEATLH ----------------------------------
    this.maxHealth = userGameData.maxHealth;
    this.hearths = [];
    var space= 5;
    this.space = space;
    var i, scl, temp;
    for(i = 0; i<this.maxHealth ; i++){
        scl = 1;
        temp = this.objectGame.add.sprite( (35*scl+space)*i + space + 35/2, space + 33/2, 'hearth', 0);
        temp.anchor.setTo(0.5,0.5);
        temp.fixedToCamera = true;
        temp.scale.setTo(scl);
        this.hearths[i] = temp;
    }
    this.heal(this.maxHealth);

    // MANAGE MANA ----------------------------------
    this.maxMana = userGameData.maxMana;
    if(this.maxMana > 0 ) this.showMana();

    // BYRON PROPERTIES -----------------------------
    this.originalBodyWidth = 22;
    this.originalBodyHeight = 47;
    this.attackRange = 87;
    this.attackOffset = -(this.originalBodyWidth - this.attackRange)/2;

    // MANAGE ANIMATION -----------------------------
    this.anchor.setTo(0.5,0.75);
    this.frame = 13*11;
    // 13*riga + frame che vuoi
    var n = 13;
    this.animations.add('left', _.range(n*9,n*9+9), 20, true);
    this.animations.add('right', _.range(n*11,n*11+9), 20, true);
    var an = this.animations.add('die', _.range(n*20,n*20+6), 7, false);
    an.onComplete.add(function(){
        setTimeout(function(gs){
            //myGame.state.start('BootState', true, false, 'menu');
            //new Platformer.PauseMenu(gs, true);
            userGameData.money = gs.money;
            saveProgress();
            gs.playerDead();
            //gs.nextLevel('Level 2');
        }, 500, this.game_state);
    },this);

    var fskip = 2;
    this.animations.add('attackLeft', _.range(n*13+fskip, n*13+6), 15, false);
    this.animations.add('attackRight', _.range(n*15+fskip, n*15+6), 15, false);

    this.weapon = this.objectGame.make.sprite(0,0, 'weapon');
    this.weapon.anchor.setTo(0.5,0.55);
    this.weapon.name = 'weapon';
    var animat = this.weapon.animations.add('attackLeft', _.range(7+fskip,12), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'left');
    animat.onComplete.add(this.resizeOriginalBody,this);

    animat = this.weapon.animations.add('attackRight', _.range(19+fskip,24), 15, false);
    animat.onStart.add(this.resizeAttackBody, this, 0, 'right');
    animat.onComplete.add(this.resizeOriginalBody, this);
    this.weapon.visible = false;
    this.addChild(this.weapon);

    animat = this.animations.add('castRight', _.range(n*3, n*3+7), 25, false);
    animat.onComplete.add(function(){this.casting = false;}, this);
    animat = this.animations.add('castLeft', _.range(n, n+7), 25, false);
    animat.onComplete.add(function(){this.casting = false;}, this);

    // MANAGE PHYSICS --------------------------------
    this.objectGame.physics.arcade.enable(this);
    this.body.setSize(this.originalBodyWidth, this.originalBodyHeight, 0, 0);
    this.body.collideWorldBounds = true;
    this.weapon.body.allowGravity = false;
    this.weapon.body.setSize(0,0,0,0);
    //this.weapon.body.setSize(this.attackRange, this.originalBodyHeight-20, this.attackOffset*this.scale.x, -6);
    //this.weapon.body.enable = false;
    this.facingLeft = false;

    // MANAGE SPELLS
    this.fireballs = this.objectGame.add.group();
    var prop;
    for(i = 0; i<5; i++){
        prop = {"texture":"fireball", "speed":300, "maxTime":userGameData.rangeFireball};
        this.fireballs.add(new Platformer.Projectile(this.game_state, {"x":0,"y":0}, prop));
    }
    this.waterballs = this.objectGame.add.group();
    for(i = 0; i<5; i++){
        prop = {"texture":"waterball", "speed":300, "maxTime":userGameData.rangeWaterball};
        this.waterballs.add(new Platformer.Projectile(this.game_state, {"x":0,"y":0}, prop));
    }

    // MANAGE GAMEPLAY
    this.cursors = {
        left : this.objectGame.input.keyboard.addKey(userGameData.leftKey),
        right : this.objectGame.input.keyboard.addKey(userGameData.rightKey)
    } ;
    //console.log(this.cursors);
    //    this.objectGame.input.keyboard.createCursorKeys();
    this.objectGame.input.keyboard.addKey(userGameData.jumpKey).onDown.add(this.jump, this);
    //this.activateOffensiveMove('basicAttack');
    //this.activateOffensiveMove('fireball');
    var index;
    //console.log(userGameData);
    for (index in userGameData.skillsObtained) {
        //console.log('the skill is');
        //console.log(userGameData.skillsObtained[index]);
        this.activateOffensiveMove(userGameData.skillsObtained[index]);
    }
    this.previousAttack = 0;
    this.currentAttack = 0;
    this.nextAttack = 0;  //timer to next attack 
    this.nextVulnerable = 0; //timer to became again vulnerable
    this.timeInvulnerability = 1000;  //time to wait before being vulnerable again
    this.preventAttack = 350;  //time to wait before attack again
    this.preventCasting = 350;  //time to wait before attack again
    this.nextCast = 0;  //timer to next castin
    this.blinking = 0;  //time.event for blinking
    this.doubleJump = true;
    this.jumping = false;
    this.movementSpeed = 150;
    this.jumpSpeed =420;
    this.doubleJumpSpeed = 330;
    this.attacking = false;
    this.casting = false;
};

Platformer.Byron.prototype = Object.create(Platformer.BasicObject.prototype);
Platformer.Byron.prototype.constructor = Platformer.Byron;

Platformer.Byron.prototype.showMana = function(){
    this.maxMana = userGameData.maxMana;
    this.manas = [];
    var space = this.space;
    var sclM, tempM;
    for(i = 0; i<this.maxMana ; i++){
        sclM = 1;
        tempM = this.objectGame.add.sprite( (35*sclM+space)*i + space + 35/2, space+this.hearths[0].height + 33/2, 'mana', 0);
        tempM.anchor.setTo(0.5,0.5);
        tempM.fixedToCamera = true;
        tempM.scale.setTo(sclM);
        this.manas[i] = tempM;
    }
    this.mana = this.maxMana;
    this.fillMana(this.maxMana);
};

Platformer.Byron.prototype.heal = function (qty) {
    //console.log('filling health');
    "use strict";
    var i;
    qty = qty || this.maxHealth;
    for(i = 0; i< qty; i++){
        if(this.health < this.maxHealth){
            this.hearths[this.health].frame = 0;
            this.health +=1;
        }
    }
    this._super.heal.call(this, qty);
};

Platformer.Byron.prototype.useMana = function () {
    "use strict";
    this.mana -= 1;
    this.manas[this.mana].frame = 1;
    //if(this.mana === 0){
        //this.fillMana(this.maxMana);
    //}
};

Platformer.Byron.prototype.fillMana = function (qty) {
    //console.log('filling mana');
    "use strict";
    var i;
    qty = qty || this.maxMana;
    for(i = 0; i< qty; i++){
        if(this.mana < this.maxMana){
            this.manas[this.mana].frame = 0;
            this.mana +=1;
        }
    }
};

// Callback on attack animation complete
Platformer.Byron.prototype.resizeOriginalBody = function(){
    "use strict";
    this.weapon.visible = false;
    this.attacking = false;
    //this.body.setSize(this.originalBodyWidth, this.originalBodyHeight, 0, 0);
    this.weapon.body.setSize(0, 0, 0, 0);
    //this.weapon.body.enable = false;
};

// Callback on attack animation start
Platformer.Byron.prototype.resizeAttackBody = function(player, animation, direction){
    "use strict";
    this.attacking = true;
    this.weapon.visible = true;
    //console.log(dir);
    var dir = direction === 'left' ? -1 : 1;
    //var obj =this;
    setTimeout(function(obj, dir){
        //obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, 0);
        obj.weapon.body.setSize(obj.attackRange, obj.originalBodyHeight-20, dir*obj.attackOffset*obj.scale.x, -6);
        //this.weapon.body.enable = true;
    }, (1/15)*1000, this, dir);  //(2 frame / 15 fps)*1000 per msec   ---- for fps see animation above
};

Platformer.Byron.prototype.update = function () {
    "use strict";
    this.objectGame.physics.arcade.collide(this, this.game_state.layers.collision);
    this.objectGame.physics.arcade.overlap(this, this.game_state.groups.items, this.obtain, null, this);
    this.objectGame.physics.arcade.collide(this, this.game_state.layers.traps);
    //this.objectGame.physics.arcade.overlap(this, this.game_state.groups.enemies, this.enemyHit, null, this);
    if(this.weapon.alive) this.objectGame.physics.arcade.overlap(this.weapon, this.game_state.groups.enemies, this.enemyHit, null, this);
    
    this.body.velocity.x = 0;
    if (this.cursors.left.isDown){
        this.moveLR('left');
    }
    else if (this.cursors.right.isDown){
        this.moveLR('right');
    }
    else {
        //  Stand still
        if(!this.alive) return;
        if (!this.attacking && !this.jumping && !this.casting){
            this.animations.stop();
            //this.frameName = this.facingLeft ? "ByronMove17" : "ByronMove27";
            this.frame = this.facingLeft ? 13*9 : 13*11;
        }
    }
    
    if(this.jumping && !this.attacking && !this.casting){
        //this.frameName = this.facingLeft ? "ByronMove18" : "ByronMove28";
        this.frame = this.facingLeft ? 13*9+1 : 13*11+1;
    }

    if(this.body.blocked.down){
        this.doubleJump = true;
        this.jumping = false;
    }
};


Platformer.Byron.prototype.moveLR = function (dir) {
    "use strict";
    if(!this.alive) return;
    this.body.velocity.x = (dir === 'left' ? -1 : 1) * this.movementSpeed;
    if (!this.attacking && !this.casting){
        this.animations.play(dir);
    }else{
        if(this.body.blocked.down) this.body.velocity.x = 0;
    }
    this.facingLeft = dir === 'left';
};

// Callback on 'UP' key down
Platformer.Byron.prototype.jump = function () {
    "use strict";
    if(!this.alive) return;
    //  Allow the player to jump if they are touching the ground.
    if (this.body.blocked.down || this.doubleJump)
    {
        this.jumping = true;
        if(!this.body.blocked.down){
            this.doubleJump = false;
        }
        this.body.velocity.y =  !this.doubleJump ? -this.doubleJumpSpeed : -this.jumpSpeed;
        //if(!this.doubleJump){
        //    console.log(this.body.velocity.y);
        //    this.body.velocity.y += -this.doubleJumpSpeed + this.body.velocity.y;
        //}else{
        //    this.body.velocity.y = -this.jumpSpeed;
        //}
        //console.log("doubleJump " + this.doubleJump);
    }
};

// Callback on overlap with item
Platformer.Byron.prototype.obtain = function (byron, item) {
    "use strict";
    if(!byron.alive) return;
    switch (item.type){
        case 'manaPot':
            if(this.mana !== this.maxMana) {
                this.fillMana(this.maxMana);
                item.destroy();
            }
            break;
        case 'healthPot':
            //console.log(this.health + ' ' + this.maxHealth);
            if(this.health !== this.maxHealth) {
                this.heal(this.maxHealth);
                item.destroy();
            }
            break;
        default:
            var values = {'GoldCoin':100, 'SilverCoin':50, 'CopperCoin':10};
            this.game_state.addCoins(values[item.type]);
            item.destroy();
    }
};

// Callback on overlap with enemies
Platformer.Byron.prototype.enemyHit = function (byron, enemy) {
    "use strict";
    //console.log('hitting enemy');
    if(!this.alive) return;
    if (byron.name === 'weapon') {
        if(this.previousAttack !== this.currentAttack){
            enemy.damage(1);
        }
        this.previousAttack = this.currentAttack;
        //if(!enemy.alive){
            //byron.fillMana();
        //}
    } else {
        //this.damage(1);
        //this.game_state.restart_level();
    }
};

// Callback on 'X' key down
Platformer.Byron.prototype.castFireball = function(){
    //console.log(this.mana);
    "use strict";
    if(!this.alive) return;
    var now = this.objectGame.time.now;
    if (now > this.nextCast && this.fireballs.countDead() > 0 && this.mana > 0) //&& now > this.nextVulnerable )//&& !this.attacking)
    {
        this.useMana();
        this.nextCast = this.objectGame.time.now + this.preventCasting;
        var dir = -1;
        var cast = 'castLeft';
        if(!this.facingLeft){
            dir = 1;
            cast = 'castRight';
        }
        this.fireballs.getFirstDead().fire(this.x, this.y-10, dir);
        this.casting = true;
        this.animations.play(cast);
    }
};

// Callback on 'C' key down
Platformer.Byron.prototype.castWaterball = function(){
    //console.log(this.mana);
    "use strict";
    if(!this.alive) return;
    var now = this.objectGame.time.now;
    if (now > this.nextCast && this.fireballs.countDead() > 0 && this.mana > 0) //&& now > this.nextVulnerable )//&& !this.attacking)
    {
        this.useMana();
        this.nextCast = this.objectGame.time.now + this.preventCasting;
        var dir = -1;
        var cast = 'castLeft';
        if(!this.facingLeft){
            dir = 1;
            cast = 'castRight';
        }
        this.waterballs.getFirstDead().fire(this.x, this.y-10, dir);
        this.casting = true;
        this.animations.play(cast);
    }
};

// Callback on 'Z' key down
Platformer.Byron.prototype.attack = function(){
    "use strict";
    if(!this.alive) return;
    var now = this.objectGame.time.now;
    if ( now > this.nextAttack )//&& now > this.nextVulnerable ) //&& !this.casting )
    {
        this.casting = false;
        //this.weapon.revive();
        //this.weapon.reset(this.x,this.y);
        if(this.facingLeft){
            this.animations.play('attackLeft');
            this.weapon.animations.play('attackLeft');
        }else{
            this.animations.play('attackRight');
            this.weapon.animations.play('attackRight');
        }
        this.currentAttack += 1;
        //console.log(this.currentAttack);
        this.nextAttack = this.objectGame.time.now + this.preventAttack;
    }
};

Platformer.Byron.prototype.kill = function(){
    "use strict";
    //console.log('kill called');
    this.alive = false;
    this.animations.play('die');
};

//Overriding
Platformer.Byron.prototype.damage = function(dmg){
    //"use strict";
    //console.log(this.objectGame.time.now > this.nextAttack && !this.casting);
    //console.log('damage called');
    //dmg = 1;
    if(!this.alive) return;
    if (this.objectGame.time.now > this.nextVulnerable){
        //console.log('damage called');
        //console.log(arguments.callee.caller.toString());
        var hp = this._super.damage.call(this,dmg).health;
        this.hearths[hp].frame = 1;
        if(hp === 0){
            //this.visible= true;
            this.animations.play('die');
            //this.revive(this.maxHealth);
            //this.game_state.restart_level();
            //this.game_state.nextLevel();
        }
        this.blinking = this.objectGame.time.events.loop(90, this.blink, this);
        this.nextVulnerable = this.objectGame.time.now + this.timeInvulnerability;
    }
};

//Overriding
Platformer.Byron.prototype.revive = function(hl){
    "use strict";
    this._super.revive.call(this, hl);
    // var i = 0;
    // for(i=0; i<hl;i++){
    //     this.hearths[i].frame = 0;
    // }
    // return this.health;
};

// Callback on event loop, being hit/invulnerable
Platformer.Byron.prototype.blink = function(){
    //console.log('blnk called');
    "use strict";
    if (this.objectGame.time.now > this.nextVulnerable){
        this.alpha = 1;
        this.objectGame.time.events.remove(this.blinking);
    }else{
        if(this.alpha === 1) this.alpha = 0.3;
        else this.alpha = 1;
    }
};

// Activate the use of the spell as parameter
Platformer.Byron.prototype.activateOffensiveMove = function(spellName){
    "use strict";
    switch (spellName){
        case 'fireball':
            this.objectGame.input.keyboard.addKey(userGameData.cast1Key).onDown.add(this.castFireball, this);
            break;
        case 'waterball':
            this.objectGame.input.keyboard.addKey(userGameData.cast2Key).onDown.add(this.castWaterball, this);
            break;
        case 'basicAttack':
            this.objectGame.input.keyboard.addKey(userGameData.basicAttackKey).onDown.add(this.attack, this);
            break;
    }
};