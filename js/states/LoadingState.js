var Phaser = Phaser || {};
var Platformer = Platformer || {};

Platformer.LoadingState = function () {
    "use strict";
    Phaser.State.call(this);
};

Platformer.prototype = Object.create(Phaser.State.prototype);
Platformer.prototype.constructor = Platformer.LoadingState;

Platformer.LoadingState.prototype.init = function (level_data) {
    "use strict";
    //console.log('LoadingState called');
    //console.log(this.init.caller.toString());

    this.level_data = level_data;
    this.loadingText = 0;
};

Platformer.LoadingState.prototype.preload = function () {
    "use strict";

    this.load.image('background', 'assets/images/sky.png');
    this.load.image('logo', 'assets/images/Logo4.png');
};

Platformer.LoadingState.prototype.startLoading = function () {
    "use strict";
    //console.log("load start");
    var assets, asset_loader, asset_key, asset;
    assets = this.level_data.assets;
    for (asset_key in assets) { // load assets according to asset key
        if (assets.hasOwnProperty(asset_key)) {
            asset = assets[asset_key];
            switch (asset.type) {
            case "image":
                this.load.image(asset_key, asset.source);
                break;
            case "spritesheet":
                this.load.spritesheet(asset_key, asset.source, asset.frame_width, asset.frame_height, asset.frames, asset.margin, asset.spacing);
                break;
            case "tilemap":
                this.load.tilemap(asset_key, asset.source, null, Phaser.Tilemap.TILED_JSON);
                break;
            case "atlas":
                this.load.atlas(asset_key, asset.image, asset.json);
                break;
            }
        }
    }
    this.load.start();
    //console.log("load start end");
};

Platformer.LoadingState.prototype.startLoadingMenu = function () {
    "use strict";
    //console.log("load start");
    this.load.spritesheet('button', 'assets/images/button.png', 145, 45);
    this.load.image('disabledButton', 'assets/images/DisabledButton.png');
    this.load.image('disabledShopButton', 'assets/images/DisabledShopButton.png');
    this.load.spritesheet('shopButton', 'assets/images/ShopButton.png', 100, 200);
    this.load.spritesheet('hearth', 'assets/images/ui/hearth.png', 35, 33);
    this.load.spritesheet('mana', 'assets/images/ui/mana.png', 32, 32);
    this.load.spritesheet('fireball', 'assets/images/player/fireball.png', 50, 22);
    this.load.image('waterball', 'assets/images/player/snowflake2.png');

    this.load.start();
    //console.log("load start end");
};

Platformer.LoadingState.prototype.create = function () {
    "use strict";

    //this.stage.backgroundColor = '#182d3b';

    var bkg = this.add.sprite(0,0, 'background');
    bkg.width = this.game.width;
    bkg.height = this.game.height;
    bkg.smoothed = false;

    var logo = this.add.image(this.game.width/2,this.game.height/2, 'logo');
    logo.scale.setTo(0.8,0.8);
    logo.anchor.setTo(0.5,0.5);

    //  You can listen for each of these events from Phaser.Loader
    this.load.onFileComplete.add(this.fileComplete, this);
    this.load.onLoadComplete.add(this.loadComplete, this);

    //  Just to kick things off

    //  Progress report
    this.loadingText = this.add.text(this.game.width/2, logo.bottom + 50, 'Loading ...', { fill: '#ffffff' });
    this.loadingText.anchor.setTo(0.5,0.5);

    if(this.level_data === 'menu'){
        this.startLoadingMenu();
    }else {
        this.startLoading();
    }
};

Platformer.LoadingState.prototype.fileComplete = function (progress, cacheKey, success, totalLoaded, totalFiles) {
    this.loadingText.setText("Loading ... " + progress + "% ");
};

Platformer.LoadingState.prototype.loadComplete = function () {
    //console.log("load Complete");
    this.loadingText.setText("Load Complete");

    //this.state.start("TiledState", true, false, this.level_data);
    setTimeout(function(obj){
        //console.log("calling TiledState");
        if(obj.level_data === 'menu'){
            myGame.state.start("BootState", true, false);
        }else {
            myGame.state.start("TiledState", true, false, obj.level_data);
        }
        //obj.state.start("BootState", true, false, 'menu');
    }, 500, this);
};

Platformer.LoadingState.prototype.shutdown = function () {
    Phaser.State.prototype.shutdown.call(this);
    this.load.onLoadComplete.removeAll();
    this.load.onFileComplete.removeAll();
};