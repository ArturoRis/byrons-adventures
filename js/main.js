var Phaser = Phaser || {};
var Platformer = Platformer || {};

//var myGame = new Phaser.Game(3000, 1680, Phaser.AUTO, 'gameDiv');
var keymapAscii ={
    65 : 'A',
    66 : 'B',
    67 : 'C',
    68 : 'D',
    69 : 'E',
    70 : 'F',
    71 : 'G',
    72 : 'H',
    73 : 'I',
    74 : 'J',
    75 : 'K',
    76 : 'L',
    77 : 'M',
    78 : 'N',
    79 : 'O',
    80 : 'P',
    81 : 'Q',
    82 : 'R',
    83 : 'S',
    84 : 'T',
    85 : 'U',
    86 : 'V',
    87 : 'W',
    88 : 'X',
    89 : 'Y',
    90 : 'Z',
    48 : 'ZERO',
    49 : 'ONE',
    50 : 'TWO',
    51 : 'THREE',
    52 : 'FOUR',
    53 : 'FIVE',
    54 : 'SIX',
    55 : 'SEVEN',
    56 : 'EIGHT',
    57 : 'NINE',
    96 : 'NUMPAD_0',
    97 : 'NUMPAD_1',
    98 : 'NUMPAD_2',
    99 : 'NUMPAD_3',
    100 : 'NUMPAD_4',
    101 : 'NUMPAD_5',
    102 : 'NUMPAD_6',
    103 : 'NUMPAD_7',
    104 : 'NUMPAD_8',
    105 : 'NUMPAD_9',
    106 : 'NUMPAD_MULTIPLY',
    107 : 'NUMPAD_ADD',
    108 : 'NUMPAD_ENTER',
    109 : 'NUMPAD_SUBTRACT',
    110 : 'NUMPAD_DECIMAL',
    111 : 'NUMPAD_DIVIDE',
    112 : 'F1',
    113 : 'F2',
    114 : 'F3',
    115 : 'F4',
    116 : 'F5',
    117 : 'F6',
    118 : 'F7',
    119 : 'F8',
    120 : 'F9',
    121 : 'F10',
    122 : 'F11',
    123 : 'F12',
    124 : 'F13',
    125 : 'F14',
    126 : 'F15',
    186 : 'COLON',
    187 : 'EQUALS',
    188 : 'COMMA',
    189 : 'UNDERSCORE',
    190 : 'PERIOD',
    191 : 'QUESTION_MARK',
    192 : 'TILDE',
    219 : 'OPEN_BRACKET',
    220 : 'BACKWARD_SLASH',
    221 : 'CLOSED_BRACKET',
    222 : 'QUOTES',
    8 : 'BACKSPACE',
    9 : 'TAB',
    12 : 'CLEAR',
    13 : 'ENTER',
    16 : 'SHIFT',
    17 : 'CONTROL',
    18 : 'ALT',
    20 : 'CAPS_LOCK',
    27 : 'ESC',
    32 : 'SPACEBAR',
    33 : 'PAGE_UP',
    34 : 'PAGE_DOWN',
    35 : 'END',
    36 : 'HOME',
    37 : 'LEFT',
    38 : 'UP',
    39 : 'RIGHT',
    40 : 'DOWN',
    43 : 'PLUS',
    44 : 'MINUS',
    45 : 'INSERT',
    46 : 'DELETE',
    47 : 'HELP',
    144 : 'NUM_LOCK'
};

function contains(a, obj) {
    var i = a.length;
    while (i--) {
        if (a[i] === obj) {
            return true;
        }
    }
    return false;
}

function setCookie(cname, cvalue, exdays) {
    //var d = new Date();
    //d.setTime(d.getTime() + (exdays*24*60*60*1000));
    //var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue ;//+ "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    var i,c;
    for(i=0; i<ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(name) === 0) return c.substring(name.length,c.length);
    }
    return "";
}

function saveProgress(){
    setCookie(coockieName, JSON.stringify(userGameData));
}

function deleteProgress(){
    document.cookie = coockieName+"=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
}

var coockieName = 'BA_game_data';
var dataSaved = getCookie(coockieName);
var userGameData;
if( dataSaved !== ""){
    userGameData = JSON.parse(dataSaved);
}else {
    userGameData = {
        'skillsObtained': ['basicAttack'],
        'money': 0,
        'maxHealth': 3,
        'maxMana': 0,
        'rangeFireball': 900,
        'rangeWaterball': 900,
        'powerUps': [],
        'powerUpsDisabled' : ['waterball', 'fireball', 'mana'],
        'levelsUnlocked' : ['1'],
        'leftKey': Phaser.Keyboard.LEFT,
        'rightKey': Phaser.Keyboard.RIGHT,
        'jumpKey': Phaser.Keyboard.SPACEBAR,
        'basicAttackKey': Phaser.Keyboard.A,
        'cast1Key': Phaser.Keyboard.S,
        'cast2Key': Phaser.Keyboard.D,
        'healthPotProb': 0,
        'manaPotProb': 0
    };
}
var gameConstants = {
	'healthPotProb' : 0.25,
	'manaPotProb' : 0.35,
	'coinSpawnNumber' : 6,
	'coinSpawnProb' : 0.4,
    'powerUps' : [
        {'text' : '+1','name' : 'hearth', 'cost' : 3000},
        {'text' : '+1','name' : 'mana', 'cost' : 3000},
        {'text' : '+\nrange','name' : 'fireball', 'cost' : 3000},
        {'text' : '+\nrange','name' : 'waterball', 'cost' : 3000}
    ]
};

var myGame = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv');
myGame.state.add("BootState", new Platformer.BootState());
myGame.state.add("ShopMenu", new Platformer.ShopMenu());
myGame.state.add("SettingsMenu", new Platformer.SettingsMenu());
myGame.state.add("LoadingState", new Platformer.LoadingState());
myGame.state.add("TiledState", new Platformer.TiledState());
myGame.state.start('LoadingState', true, false, 'menu');
//myGame.state.start("BootState", true, false, "Level 6");
//myGame.state.start("BootState", true, false);
//myGame.state.start("BootState", true, false, 'menu');
//myGame.state.start("ShopMenu", true, false);
//myGame.state.start("SettingsMenu", true, false);