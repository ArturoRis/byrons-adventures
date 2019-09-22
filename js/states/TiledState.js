var Phaser = Phaser || {};
var Platformer = Platformer || {};
var userGameData = userGameData || {};

Platformer.TiledState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.TiledState.prototype = Object.create(Phaser.State.prototype);
Platformer.TiledState.prototype.constructor = Platformer.TiledState;

Platformer.TiledState.prototype.init = function (level_data) {
    "use strict";
    //console.log("TiledState called");
    //console.log(this.init.caller.toString());
    this.level_data = level_data;
    
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    
    // start physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 1000;
    
    // create map and set tileset
    // this.map = this.game.add.tilemap(level_data.map.key);
    // this.map.addTilesetImage(this.map.tilesets[0].name, level_data.map.tileset);
    this.map = this.add.tilemap(level_data.map.key);
    var tileset_index = 0;
    this.map.tilesets.forEach(function (tileset) {
        this.map.addTilesetImage(tileset.name, this.level_data.map.tilesets[tileset_index]);
        tileset_index += 1;
    }, this);
};

//Platformer.TiledState.prototype.preload = function (){
//};

Platformer.TiledState.prototype.create = function () {
    "use strict";
    var group_name, object_layer, collision_tiles;
    
    this.stage.backgroundColor = this.level_data.properties.bkgColor || '#80B0DA';

    // create map layers 
    this.layers = {};
    
    //adding image layers
    var index, len, image, imageLayer;
    for (index = 0, len = this.map.images.length; index < len; index++) {
        imageLayer = this.map.images[index];
        image = this.add.sprite(imageLayer.x, imageLayer.y, imageLayer.name);
        //image.height = this.game.height; //imageLayer.height*this.map.tileHeight;
        //image.width = this.game.width; //imageLayer.width*this.map.tileWidth;
        image.smoothed = false;
    }

    //adding tile layers
    this.map.layers.forEach(function (layer) {
        this.layers[layer.name] = this.map.createLayer(layer.name);
        //console.log(layer.properties.collision);
        if (layer.properties.collision) { // collision layer
            //console.log(layer.name);
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setCollision(collision_tiles, true, layer.name);
        }
        if (layer.properties.traps) { // collision layer
            collision_tiles = [];
            layer.data.forEach(function (data_row) { // find tiles used in the layer
                data_row.forEach(function (tile) {
                    // check if it's a valid tile index and isn't already in the list
                    if (tile.index > 0 && collision_tiles.indexOf(tile.index) === -1) {
                        collision_tiles.push(tile.index);
                    }
                }, this);
            }, this);
            this.map.setTileIndexCallback(collision_tiles, this.hitPlayer, this, layer.name);
        }
    }, this);

    // resize the world to be the size of the current layer
    this.layers[this.map.layer.name].resizeWorld();
    if(image){
    	image.width = this.world.width;
        image.height = this.world.height;
    }
    
    // create groups
    this.groups = {};
    this.level_data.groups.forEach(function (group_name) {
        this.groups[group_name] = this.add.group();
    }, this);
    
    this.basicObjects = {};
    
    for (object_layer in this.map.objects) {
        if (this.map.objects.hasOwnProperty(object_layer)) {
            // create layer objects
            this.map.objects[object_layer].forEach(this.create_object, this);
        }
    }

    this.world.bringToTop(this.groups.enemies);
    this.world.bringToTop(this.groups.items);
    this.world.bringToTop(this.groups.players);

    // CREATING PAUSE BUTTON
    var pauseButton = this.add.button(this.game.width/2, 20 , 'button', this.loadPauseMenu, this, 0, 1, 2);
    pauseButton.anchor.setTo(0.5,0.5);
    pauseButton.scale.setTo(0.5,0.5);
    //console.log(pauseButton.width);
    var label = this.game.make.text(0, 0,"Pause", { font: 'Verdana',fontSize: '34px', fill: '#ffffff' });
    label.anchor.setTo(0.5,0.5);
    pauseButton.addChild(label);
    pauseButton.fixedToCamera = true;

    // CREATING MONEY TEXT
    this.money = userGameData.money;
    this.moneyText = "Coins: ";
    this.moneyTextSprite = this.game.add.text(this.game.width -5, 5,this.moneyText + this.money, { font: 'Verdana',fontSize: '27px', fill: '#000000' });
    this.moneyTextSprite.anchor.setTo(1,0);
    this.moneyTextSprite.fixedToCamera = true;


    this.camera.follow(this.basicObjects.Byron);
    //this.game.onPause.add(this.loadPauseMenu, this);
};

Platformer.TiledState.prototype.hitPlayer = function(){
    //console.log('trap overlap');
    "use strict";
    this.basicObjects.Byron.damage(1);
};

Platformer.TiledState.prototype.addCoins = function(qty){
    "use strict";
    this.money += qty;
    this.moneyTextSprite.setText(this.moneyText + this.money);
};

Platformer.TiledState.prototype.create_object = function (object) {
    "use strict";
    var position, basicObject;
    // tiled coordinates starts in the bottom left corner
    position = {"x": object.x + (this.map.tileHeight / 2), "y": object.y - (this.map.tileHeight / 2)};
    // create object according to its type
    switch (object.type) {
    case "Byron":
        basicObject = new Platformer.Byron(this, position, object.properties);
        break;
    case "ground_enemy":
        basicObject = new Platformer.Enemy(this, position, object.properties);
        break;
    case "flyingEnemy":
        basicObject = new Platformer.FlyingEnemy(this, position, object.properties);
        break;
    case "flyingEnemyCloseRange":
        basicObject = new Platformer.FlyingEnemyCloseRange(this, position, object.properties);
        break;
    case "goal":
        basicObject = new Platformer.Goal(this, position, object.properties);
        break;
    case "item":
        basicObject = new Platformer.Item(this, position, object.properties);
        break;
    case "sign":
        basicObject = new Platformer.Sign(this, position, object.properties);
        break;
    case "blob":
        basicObject = new Platformer.Blob(this, position, object.properties);
        break;
    case "archer":
        basicObject = new Platformer.Archer(this, position, object.properties);
        break;
    case "fighter":
        basicObject = new Platformer.Fighter(this, position, object.properties);
        break;
    case "skeleton":
        basicObject = new Platformer.Skeleton(this, position, object.properties);
        break;
    case "wakwak":
        basicObject = new Platformer.Wakwak(this, position, object.properties);
        break;
    case "clock":
        basicObject = new Platformer.Clock(this, position, object.properties);
        break;
    case "helper":
        basicObject = new Platformer.HelperGuy(this, position, object.properties);
        break;
    }
    this.basicObjects[object.name] = basicObject;
};

Platformer.TiledState.prototype.restart_level = function () {
    "use strict";
    //console.log('restart called');
    myGame.state.restart(true, false, this.level_data);
};

Platformer.TiledState.prototype.nextLevel = function (nextL) {
    "use strict";
    //myGame.state.start("BootState", true, false,"Level 2");
    //this.game.state.start("BootState", true, false,"menu");
    new Platformer.PauseMenu(this, thirdButton.NEXT, nextL);
};

Platformer.TiledState.prototype.loadPauseMenu = function () {
    "use strict";
    //console.log(this);
    new Platformer.PauseMenu(this, thirdButton.RESUME);
    // myGame.state.start("BootState", true, true, 'menu');
};

Platformer.TiledState.prototype.playerDead = function () {
    "use strict";
    //console.log(this);
    new Platformer.PauseMenu(this, thirdButton.GAME_OVER);
    // myGame.state.start("BootState", true, true, 'menu');
};

Platformer.TiledState.prototype.spawnItem = function(name, position){
    //console.log('spawning ' + name);
    "use strict";
    new Platformer.Item(this, position, {'texture' : name, 'group' : 'items'});
};

Platformer.TiledState.prototype.render = function(){
    //console.log(this.basicObjects.Player);
    //this.game.debug.body(this.basicObjects.Byron);
    //this.game.debug.body(this.basicObjects.Byron.weapon);
    //this.game.debug.body(this.basicObjects.Skeleton.weapon);
    //this.game.debug.body(this.basicObjects.Fairy);
    //this.game.debug.body(this.basicObjects.Orologio);
    //this.game.debug.body(this.basicObjects.Green1);
    //this.game.debug.body(this.basicObjects.Tutorial2);
    //var i;
    //console.log(this.groups.item.children);
    //for(i= 0; i < this.groups.item.children.length; i++){
    //    this.game.debug.body(this.groups.item.children[i]);
    //
    // }
};
