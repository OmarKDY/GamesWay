function CDice (iPlayer, iIndex, oParentContainer){
    var _oParentContainer;
    var _oDiceContainer;
    var _oDiceSprite;
    var _oDiceHighlight;
    var _oHitArea;
    
    var _iPlayer;
    var _iIndex;
    var _iX;
    var _iY;
    var _iValue;
    
    var _bLocked;
    
    var PLAYERS_VERTICAL_OFFSET = 250;
    var PLAYERS_HORIZONTAL_OFFSET = 440;
    
    this.init = function(){        
        _iPlayer = iPlayer;
        _iIndex = iIndex;
        _iValue = 0;
        _bLocked = false;
        
        this.calculatePosition();

        _oDiceContainer = new createjs.Container();
        _oParentContainer.addChild(_oDiceContainer);

        this.addHighlight();
        this.addDiceSpritesheet();
        
        _oDiceContainer.rotation = 0;
        _oDiceContainer.x = _iX;
        _oDiceContainer.y = _iY;
        
        // IF THE PLAYER IS HUMAN, ADD SOME INTERACTIONS
        if (_iPlayer === PLAYER_HUMAN_NUMBER)  {
            this.initHitArea();
        }
    };
    
    this.calculatePosition = function(){
        // SET POSITION ACCORDING TO THE PLAYER AND DICE
        var iDiceSpace = DICE_FRAME_SIZE * 0.8;
        var iDiceStartPosition = -1.9*iDiceSpace;
        var aHorizontalOffset = [iDiceStartPosition,iDiceStartPosition,-1*PLAYERS_HORIZONTAL_OFFSET,PLAYERS_HORIZONTAL_OFFSET+10];
        var aVerticalOffset = [PLAYERS_VERTICAL_OFFSET,-0.95*PLAYERS_VERTICAL_OFFSET,iDiceStartPosition,iDiceStartPosition];
        
        if (_iPlayer < 2) {
            _iX = CANVAS_WIDTH_HALF + aHorizontalOffset[_iPlayer] + (_iIndex * iDiceSpace);
            _iY = CANVAS_HEIGHT_HALF + aVerticalOffset[_iPlayer];
        } else {
            _iX = CANVAS_WIDTH_HALF + aHorizontalOffset[_iPlayer];
            _iY = CANVAS_HEIGHT_HALF + aVerticalOffset[_iPlayer] + (_iIndex * iDiceSpace);
        }
    };
    
    this.addDiceSpritesheet = function(){
        var data = {
            images: [s_oSpriteLibrary.getSprite("roll"),
                     s_oSpriteLibrary.getSprite("roll_1"),
                     s_oSpriteLibrary.getSprite("roll_2"),
                     s_oSpriteLibrary.getSprite("roll_3"),
                     s_oSpriteLibrary.getSprite("roll_4"),
                     s_oSpriteLibrary.getSprite("roll_5"),
                     s_oSpriteLibrary.getSprite("roll_6")],
            frames: {width: DICE_FRAME_SIZE, height: DICE_FRAME_SIZE},
            animations: {empty  : [0],
                         roll   : [0,9],
                         roll_1 : [10,24, "stop1"],
                         stop1  : [24],
                         roll_2 : [25,39, "stop2"],
                         stop2  : [39],
                         roll_3 : [40,54, "stop3"],
                         stop3  : [54],
                         roll_4 : [55,69, "stop4"],
                         stop4  : [69],
                         roll_5 : [70,84, "stop5"],
                         stop5  : [84],
                         roll_6 : [85,99, "stop6"],
                         stop6  : [99]},
            framerate: 30
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);        
        _oDiceSprite = createSprite(oSpriteSheet, 0, DICE_FRAME_SIZE * 0.5, DICE_FRAME_SIZE * 0.5, DICE_FRAME_SIZE, DICE_FRAME_SIZE);
        _oDiceSprite.regX = DICE_FRAME_SIZE * 0.5;
        _oDiceSprite.regY = DICE_FRAME_SIZE * 0.5;
        if (_iPlayer === 2) {
            _oDiceSprite.x = 8;
        }
        _oDiceSprite.alpha = 0;
        _oDiceContainer.addChild(_oDiceSprite);
    };
    
    this.addHighlight = function(){
        var aPosX = [-10,-8,-4,-12];
        var aPosY = [ -4,-8,-6, -6];
        
        var oSprite = s_oSpriteLibrary.getSprite("highlight");
        _oDiceHighlight = createBitmap(oSprite);
        _oDiceHighlight.regX = oSprite.width * 0.5;
        _oDiceHighlight.regY = oSprite.height * 0.5;
        _oDiceHighlight.x = aPosX[_iPlayer];
        _oDiceHighlight.y = aPosY[_iPlayer];
        _oDiceHighlight.visible = false;
        _oDiceContainer.addChild(_oDiceHighlight);
    };
    
    this.initHitArea = function(){
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#000").drawRect(0, 0, DICE_FRAME_SIZE, DICE_FRAME_SIZE);
        _oHitArea.x = _oDiceSprite.x;
        _oHitArea.y = _oDiceSprite.y;
        _oDiceSprite.hitArea = _oHitArea;	
        
        _oDiceSprite.on("pressup", this.onClickedDice);        
        if (!s_bMobile) {
            _oDiceSprite.cursor = "pointer";
        };
    };
    
    this.onClickedDice = function(){
        if (s_oGame.getTurn() !== PLAYER_HUMAN_NUMBER || 
            s_oGame.hasLaunched() === false || 
            s_oGame.isEndOfTurn() === true) {
            return;
        };
        
        playSound("dice",1,false);
        if (_bLocked) {
            _bLocked = false;
        } else {
            _bLocked = true;
        };
        _oDiceHighlight.visible = _bLocked;
    };
    
    this.resetDice = function(){
        _bLocked = false;
        _oDiceSprite.gotoAndStop("stop_"+_iValue);
        _oDiceSprite.on("animationend", function(){ });
        _oDiceHighlight.visible = false;
        createjs.Tween.get(_oDiceSprite)
            .wait(200)
            .to({alpha: 0}, 500, createjs.Ease.cubicIn)
            .call(function(){
                _iValue = 0;
                createjs.Tween.removeTweens(_oDiceSprite);
            });
    };
    
    this.setHighlightVisible = function(bValue){
        _oDiceHighlight.visible = bValue;
    };
    
    this.isLocked = function(){
        return _bLocked;
    };
    
    this.setLocked = function(bValue){
        if (soundPlaying("dice") === false) {
            playSound("dice",1,false);
        };
        _bLocked = bValue;
    };
    
    this.getValue = function(){
        return _iValue;
    };
    
    this.isAnimationOn = function(){
        if (_oDiceSprite.currentAnimation === "roll_1" || 
            _oDiceSprite.currentAnimation === "roll_2" ||
            _oDiceSprite.currentAnimation === "roll_3" ||
            _oDiceSprite.currentAnimation === "roll_4" ||
            _oDiceSprite.currentAnimation === "roll_5" ||
            _oDiceSprite.currentAnimation === "roll_6" ) {
            return true;
        } else {
            return false;
        };
    };
    
    this.setValue = function(iValue){
        _oDiceSprite.on("animationend", function(){ });
        
        _iValue = iValue;
        _oDiceSprite.gotoAndPlay( "roll_" + (1+_iValue) );
        
        createjs.Tween.get(_oDiceSprite)
            .wait(DICE_TIME_DELAY*_iIndex)
            .to({alpha: 1}, 200, createjs.Ease.cubicIn)
            .call(function(){ 
                _oDiceSprite.on("animationend", function(){ 
                    s_oGame.checkToActivateRollButton(); 
                    s_oGame.onAnimationsOver();
                }); 
            });
    };
    
    _oParentContainer = oParentContainer;
    
    this.init();
};