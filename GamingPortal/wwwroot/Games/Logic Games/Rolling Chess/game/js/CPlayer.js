function CPlayer(iLevel, oParentContainer) {
    var _iRandomCounter; // HOW MANY IDLE ANIMATIONS HAS BEEN PLAYED FOR LOOP
    var _iRandomN;       // HOW MANY TIMES THE IDLE ANIMATION WILL BE PLAYED BEFORE GOING TO THE VARIATION ANIMATION    
    var _iLevel;

    var _bIsSleeping;
    var _bWin;
    
    var _oParentContainer;    
    var _oPlayerAnimation;
    
    this._init = function () {
        _bIsSleeping = false;
        _bWin = false;
        _iRandomCounter = 0;
        _iRandomN = Math.floor((Math.random()*10)+5);
        
        var aImages = [];
        var iWidth = 142;
        var iHeight = 118;
        for (var i = 0; i < 247; i++) {
            aImages.push( s_oSpriteLibrary.getSprite("player_"+i) );
        };
        var data = {
            images: aImages,
            frames: {width: iWidth, height: iHeight, regX: iWidth*0.5, regY: iHeight}, 
            animations: {idle  : [  0, 39,  false],
                         idle2 : [ 40, 79, "idle"],
                         lose  : [ 80,119, "lose"],
                         angry : [120,141,  false],
                         chew  : [160,180,  false],                         
                         sleep : [181,220,"sleep"],
                         wakeup: [221,238, "idle"],
                         // WE USE THE SAME ANIMATION FOR EAT CHEESE AND EAT STRAWBERRIES
                         eat   : [239,246, "chew"],
                         eatcoin:[239,246, "idle"]},
            framerate: 30
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);        
        _oPlayerAnimation = createSprite(oSpriteSheet, 'idle', 0, 0, iWidth, iHeight);
        _oPlayerAnimation.x = PLAYER_POSITION[_iLevel].x + 10;
        _oPlayerAnimation.y = PLAYER_POSITION[_iLevel].y;
        _oPlayerAnimation.addEventListener("animationend", this.changeAnimation);
        _oPlayerAnimation.visible = true;
        _oParentContainer.addChild(_oPlayerAnimation);
    };
    
    this.changeAnimation = function(){
        if (_bWin) {
            // IF THE LEVEL IS FINISHED (WIN), THE MOUSE WILL JUST KEEP CHEWING
            _oPlayerAnimation.gotoAndPlay("chew");
        } else {
            switch( _oPlayerAnimation.currentAnimation ) {
                case "idle": {
                    _iRandomCounter++;
                    if (_iRandomCounter > _iRandomN) {
                        _oPlayerAnimation.gotoAndPlay("idle2");                
                        _iRandomCounter = 0;
                    } else {
                        _oPlayerAnimation.gotoAndPlay("idle");                        
                    }
                    break;
                };
                case "eatcoin":
                case "idle2":            
                case "wakeup": {
                    _oPlayerAnimation.gotoAndPlay("idle");
                    break;
                };
                case "lose": {
                    _oPlayerAnimation.gotoAndPlay("lose");
                    break;
                };
                case "eat": {
                    _oPlayerAnimation.gotoAndPlay("eat");
                    break;
                };
                case "sleep": {
                    _oPlayerAnimation.gotoAndPlay("sleep");
                    break;
                };
                case "chew": {
                    _oPlayerAnimation.gotoAndPlay("chew");
                    break;
                };
            };
        }
    };
        
    this.animationEatCoin = function(){
        stopSound("player_sleeping");
        if (soundPlaying("player_eating") === false) {
            playSound("player_eating", 1, 0);
        }        
        _oPlayerAnimation.gotoAndPlay("eatcoin");        
    };
        
    this.onWakeUp = function(){
        stopSound("player_sleeping");
        if (soundPlaying("player_wakeup") === false) {
            playSound("player_wakeup", 1, 0);
        }
        _bIsSleeping = false;
        _oPlayerAnimation.gotoAndPlay("wakeup");
    };
    
    this.animationWin = function(){
        _bWin = true;
        stopSound("player_sleeping");
        _oPlayerAnimation.gotoAndPlay("eat");
    };
    
    this.animationLose = function(){
        stopSound("player_sleeping");
        // AFTER TOO MANY GAMEOVER, THE ANIMATION WILL CHANGE
        if (s_iAnimationIndex > LOSE_ANIMATION_INDEX) {
            if (soundPlaying("player_angry") === false) {
                playSound("player_angry", 1, 0);
            }
            s_iAnimationIndex = 0;
            _oPlayerAnimation.gotoAndPlay("angry");
        } else {
            _oPlayerAnimation.gotoAndPlay("lose");
        }
    };
    
    this.onSleep = function(){
        if (soundPlaying("player_sleeping") === false) {
            playSound("player_sleeping", 1, true);
        }
        _bIsSleeping = true;
        _oPlayerAnimation.gotoAndPlay("sleep");
    };
    
    this.isSleeping = function(){
        return _bIsSleeping;
    };
    
    this.unload = function(){
        stopSound("player_sleeping");
        _oParentContainer.removeChild(_oPlayerAnimation);                
    };
    
    _iLevel = iLevel;
    _oParentContainer = oParentContainer;

    this._init();
}