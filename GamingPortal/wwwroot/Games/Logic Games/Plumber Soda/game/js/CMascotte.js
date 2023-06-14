function CMascotte(oParentContainer) {
    var _iRandomCounter;  // HOW MANY IDLE ANIMATIONS HAS BEEN PLAYED FOR LOOP
    var _iRandomN;        // HOW MANY TIMES THE IDLE ANIMATION WILL BE PLAYED BEFORE GOING TO THE DRINK ANIMATION
    
    var _oParentContainer;
    var _oMascotteSpritesheet;
    
    this._init = function () {
        _iRandomCounter = 0;
        _iRandomN = Math.floor((Math.random() * 10) + 5);
        
        // ACCORDING TO THE CHOSEN PLAYER, SET THE SPRITESHEETS
        var aWidths = [284, 234];
        var aHeights = [294, 352];
        var aMascottePosX = [240, 250];
        var aMascottePosY = [630, 640];
       
        var aSpriteImages = [];       
        for (var i = 0; i < 123; i++) {
            aSpriteImages.push( s_oSpriteLibrary.getSprite("character" + s_iMascotteType + "_" + i) );
        };
       
        var data = {
            images: aSpriteImages,
            frames: {width: aWidths[s_iMascotteType], height: aHeights[s_iMascotteType], regX: aWidths[s_iMascotteType] * 0.5, regY: aHeights[s_iMascotteType]}, 
            animations: {idle:  [ 0,  29, false],
                         drink: [31,  75, 'idle'],
                         win:   [77,  92, 'win'],
                         lose:  [94, 121, 'lose']},
            framerate: FPS_MASCOTTE
        };        
        var oSpriteSheet = new createjs.SpriteSheet(data);
        
        _oMascotteSpritesheet = createSprite(oSpriteSheet, 'idle', 0, 0, aWidths[s_iMascotteType], aHeights[s_iMascotteType]);
        _oMascotteSpritesheet.x = aMascottePosX[s_iMascotteType];
        _oMascotteSpritesheet.y = aMascottePosY[s_iMascotteType];
        _oMascotteSpritesheet.addEventListener("animationend", this.changeAnimation);
        _oParentContainer.addChild(_oMascotteSpritesheet);
    };
    
    this.changeAnimation = function(){
        if (_oMascotteSpritesheet.currentAnimation === "win") {
            _oMascotteSpritesheet.gotoAndPlay("win");
        } else if (_oMascotteSpritesheet.currentAnimation === "lose") {
            _oMascotteSpritesheet.gotoAndPlay("lose");
        // FOR "IDLE" ANIMATION ONLY, THERE'S A RANDOMIZER FOR "DRINK" ANIMATION
        } else {
            _iRandomCounter++;

            if (_iRandomCounter > _iRandomN) {
                _iRandomCounter = 0;        
                playSound("gulp",1,false);
                _oMascotteSpritesheet.gotoAndPlay("drink");
            } else {
                _oMascotteSpritesheet.gotoAndPlay("idle");
            };
        };
    };
    
    this.playAnimation = function(szAnimation){
        _oMascotteSpritesheet.gotoAndPlay(szAnimation);
    };
    
    this.changeContainer = function(oContainer){
        oContainer.addChild(_oMascotteSpritesheet);
    };
    
    _oParentContainer = oParentContainer;

    this._init();
}