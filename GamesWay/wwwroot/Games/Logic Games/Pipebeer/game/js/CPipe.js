function CPipe(aType, iColumn, iRow, iLevel) {
    var _aSquareInfo = [];   // THIS ARRAY WILL HAVE ALL THE INFOS NEEDED
    
    var _oThis;
    var _oArrow;
    var _oContainer;
    var _oPipeSprite;
    var _oExplosion;
    var _oMalus;
    
    var _iPosition;
    var _iColumn = iColumn;
    var _iRow = iRow;
    var _iFrameSize = 66;
    var _iLevel = iLevel;
    
    var _bWatered;
    
    this._init = function() {
        _aSquareInfo.length = 0;
        _aSquareInfo = aType;
        _bWatered = false;
        _oMalus = null;
        
        _iPosition = s_oBoard.findSquarePosition(_iColumn, _iRow);
        _oContainer = s_oBoard.getContainer();
        
        var data = {
            images: [s_oSpriteLibrary.getSprite("pipe0"),
                     s_oSpriteLibrary.getSprite("pipe1a"),
                     s_oSpriteLibrary.getSprite("pipe1b"),
                     s_oSpriteLibrary.getSprite("pipe2a"),
                     s_oSpriteLibrary.getSprite("pipe2b"),
                     s_oSpriteLibrary.getSprite("pipe3a1"),
                     s_oSpriteLibrary.getSprite("pipe3a2"),
                     s_oSpriteLibrary.getSprite("pipe3b1"),
                     s_oSpriteLibrary.getSprite("pipe3b2"),
                     s_oSpriteLibrary.getSprite("pipe3c1"),
                     s_oSpriteLibrary.getSprite("pipe3c2"),
                     s_oSpriteLibrary.getSprite("pipe3d1"),
                     s_oSpriteLibrary.getSprite("pipe3d2"),
                     s_oSpriteLibrary.getSprite("pipe4"),
                     s_oSpriteLibrary.getSprite("pipe11")],
            frames: {width: _iFrameSize, height: _iFrameSize},
            animations: { EMPTY_PIPE: [0,0],
                          PIPE_HORIZONTAL: [1,1],
                          PIPE_HORIZONTAL_WATER_1: [2,60, false],
                          PIPE_HORIZONTAL_WATER_2: [62,120, false],
                          PIPE_ANGLE: [121,121],
                          PIPE_ANGLE_WATER_1: [122,180, false],
                          PIPE_ANGLE_WATER_2: [182,240, false],
                          PIPE_CROSS: [241,241],
                          PIPE_CROSS_WATER_H1: [242,300, false],
                          PIPE_CROSS_WATER_H2: [302,360, false],
                          PIPE_CROSS_WATER_V1: [362,420, false],
                          PIPE_CROSS_WATER_V2: [422,480, false],
                          PIPE_CROSS_WATER_FULL_H1: [482,540, false],
                          PIPE_CROSS_WATER_FULL_H2: [542,600, false],
                          PIPE_CROSS_WATER_FULL_V1: [602,660, false],
                          PIPE_CROSS_WATER_FULL_V2: [662,720, false],
                          PIPE_START: [721,721],
                          PIPE_START_WATER: [722,762, false, 30/LEVEL_WATER_SPEED[_iLevel]],    // DIFFERENT SPEED
                          PIPE_BARRIER: [763,763] },
            framerate: LEVEL_WATER_SPEED[_iLevel]
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        
        var szAnimationType;
        switch (_aSquareInfo[0]) {
            case 0:
                szAnimationType = "EMPTY_PIPE";
                break;
            case 1:
                szAnimationType = "PIPE_HORIZONTAL";
                break;
            case 2:
                szAnimationType = "PIPE_ANGLE";
                break;
            case 3:
                szAnimationType = "PIPE_CROSS";
                break;
            case 4:                
                szAnimationType = "PIPE_START";                
                break;
            case 11:
                szAnimationType = "PIPE_BARRIER";
                break;
        };
        
        _oPipeSprite = createSprite(oSpriteSheet, szAnimationType, 0, 0, _iFrameSize, _iFrameSize);
        _oPipeSprite.regX = _oPipeSprite.regY = _iFrameSize/2;
        _oPipeSprite.x = COLUMNS_COORDS[_iColumn];
        _oPipeSprite.y = ROWS_COORDS[_iRow];
        _oPipeSprite.rotation = _aSquareInfo[1];
        _oPipeSprite.gotoAndPlay(szAnimationType);
        _oContainer.addChild(_oPipeSprite);
        
        this.initExplosion();
        
        if (_iPosition < BOARD_SQUARES) {
            _oPipeSprite.on("pressup", this.onClickedSquare);
            
            if (!s_bMobile) {
                _oPipeSprite.cursor = "pointer";
            };
        };
    };
    
    this.setPaused = function(bValue){
        _oPipeSprite.paused = bValue;
    };
    
    this.setStartArrow = function(){
        _oArrow = createBitmap(s_oSpriteLibrary.getSprite('arrow'));
        _oArrow.regX = 9;
        _oArrow.regY = 13;
        _oArrow.x = COLUMNS_COORDS[_iColumn];
        _oArrow.y = ROWS_COORDS[_iRow];
        _oArrow.rotation = _aSquareInfo[1];        
        _oContainer.addChild(_oArrow);
        
        new createjs.Tween.get(_oArrow, {loop: true})
            .to({scaleX: 1.5, scaleY: 1.5}, 1000, createjs.Ease.cubicIn)
            .to({scaleX: 1, scaleY: 1}, 1000, createjs.Ease.cubicIn);
    };
    
    this.initExplosion = function(){
        var iFrameSize = 104;
        var data = {
            images: [s_oSpriteLibrary.getSprite("explosion")],
            frames: {width: iFrameSize, height: iFrameSize},
            animations: { idle: [4,20, false]},
            framerate: 20
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);
        _oExplosion = createSprite(oSpriteSheet, "idle", iFrameSize/2, iFrameSize/2, iFrameSize, iFrameSize);
        _oExplosion.regX = _oExplosion.regY = iFrameSize/2;
        _oExplosion.x = COLUMNS_COORDS[_iColumn];
        _oExplosion.y = ROWS_COORDS[_iRow];
        _oExplosion.scaleX = _oExplosion.scaleY = 1.2;
        _oExplosion.visible = false;
        _oExplosion.addEventListener("animationend", function(){
            _oExplosion.visible = false;
        });
        _oContainer.addChild(_oExplosion);
    };
    
    this.setMaxSpeed = function(){
        _oPipeSprite.framerate = 120;
    };
    
    this.getInfoArray = function(){
        return _aSquareInfo;
    };
    
    this.setInfoArray = function(aNewArray){
        _aSquareInfo = aNewArray;
        _oPipeSprite.rotation = _aSquareInfo[1];
        _oThis.updateStaticImage();
    };

    this.startExplode = function(iPoints){
        var iWaitTime = 0;
        
        if(s_oGame.isStartGame() === false){
            // ONLY FOR THE END OF THE LEVEL, ADD A LITTLE RANDOM DELAY
            iWaitTime = Math.floor((Math.random() * CHECK_LEVEL_DELAY));
        };

        new createjs.Tween.get(_oExplosion)
            .wait(iWaitTime)
            .to({rotation: 0}, 100)
            .call(function() {
                _oThis.initMalus(iPoints);      // ADD A "- XX POINTS" INDICATION
        
                playSound("explosion",1,false);
                _oExplosion.visible = true;                
                _oExplosion.gotoAndPlay("idle");
                
                if (s_oGame.isStartGame() === false) {
                    _oPipeSprite.visible = false;
                };
            });
    };
    
    this.initMalus = function(iPoints){
        var iX = COLUMNS_COORDS[_iColumn];
        var iY = ROWS_COORDS[_iRow];
        _oMalus = new CMalus(iX, iY, iPoints);
    };
    
    this.onClickedSquare = function(){
        // IF THE PIPE CAN'T BE CHANGED, OR HAS BEER IN IT, STOP THIS
        if (_aSquareInfo[0] > 3 || !s_oGame.isStartGame() || 
            s_oGame.getClickBlocked() || _bWatered === true) {
            return;
        };

        s_oGame.setClickBlocked(true);
        
        // IF THE SQUARE IS NOT EMPTY, YOU LOSE POINTS
        if (_aSquareInfo[0] !== 0){
            s_oGame.subtractPoints(CHANGED_PIPE_MALUS);
            _oThis.startExplode(CHANGED_PIPE_MALUS);
        };        
        
        // SET THE NEW SQUARE SETTINGS ON THE CLICKED SQUARE
        var oNextSquare = s_oBoard.getNextSquare();
        var aInfoArray = oNextSquare.getInfoArray();

        // MOVEMENT ANIMATION
        var oNextSquareImage = oNextSquare.getImage();
        new createjs.Tween.get(oNextSquareImage)
            .to({alpha: 0}, 800, createjs.Ease.cubicIn);    
        new createjs.Tween.get(oNextSquareImage)                    
            .to({x: _oPipeSprite.x, y: _oPipeSprite.y}, 500, createjs.Ease.cubicIn)            
            .call( function() {                
                _oThis.setInfoArray(aInfoArray);  // SET THE NEW SQUARE SETTINGS ON THE CLICKED SQUARE                
                s_oBoard.updateNextSquares();     // REFRESH NEXT SQUARES LIST
            });
        
        playSound("place_pipe",1,false);
    };

    this.setNewGridPosition = function(iColumn, iRow){
        _iColumn = iColumn;
        _iRow = iRow;
    };

    this.setX = function(iPos){
        var iX = BOARD_COORDS[iPos][0];
        new createjs.Tween.get(_oPipeSprite)
                .to({x: iX}, 150, createjs.Ease.cubicIn);
    };
    
    this.setY = function(iPos){
        var iY = BOARD_COORDS[iPos][1];
        new createjs.Tween.get(_oPipeSprite)
                .to({y: iY}, 150, createjs.Ease.cubicIn);
    };
    
    this.getImage = function(){
        return _oPipeSprite;
    };

    this.updateStaticImage = function(){
        _bWatered = false;            // SET WATERED FALSE
        
        switch (_aSquareInfo[0]) {
            case 1:
                _oPipeSprite.gotoAndPlay("PIPE_HORIZONTAL");
                break;
            case 2:
                _oPipeSprite.gotoAndPlay("PIPE_ANGLE");
                break;
            case 3:
                _oPipeSprite.gotoAndPlay("PIPE_CROSS");
                break;
            case 4:
                _oPipeSprite.gotoAndPlay("PIPE_START");                
                break;
            case 11:
                _oPipeSprite.gotoAndPlay("PIPE_BARRIER");
                break;
        }
    };

    this.updateImageHorizontal = function(iProvenience){
        var szAnimation = "PIPE_HORIZONTAL_WATER_1";
        if (_aSquareInfo[1] === 0 && iProvenience === 1 ||
            _aSquareInfo[1] !== 0 && iProvenience === 2 ) {
            szAnimation = "PIPE_HORIZONTAL_WATER_2";
        };
        _oThis.setAnimation(szAnimation, iProvenience);
    };
    
    this.updateImageAngle = function(iProvenience){
        var szAnimation = "PIPE_ANGLE_WATER_1";
        if (_aSquareInfo[1] === 0 && iProvenience === 0 ||
            _aSquareInfo[1] === 90 && iProvenience === 1 ||
            _aSquareInfo[1] === 180 && iProvenience === 2 ||
            _aSquareInfo[1] === 270 && iProvenience === 3) {
            szAnimation = "PIPE_ANGLE_WATER_2";
        };
        _oThis.setAnimation(szAnimation, iProvenience);
    };
    
    this.updateImageStart = function(iProvenience){
        _oThis.setAnimation("PIPE_START_WATER", iProvenience);
    };
    
    this.setAnimation = function(szAnimation, iProvenience){
        _oPipeSprite.gotoAndPlay(szAnimation);
        _oPipeSprite.removeAllEventListeners();
        
        if (_oPipeSprite.currentAnimation === szAnimation) {
            _oPipeSprite.on("animationend", function(){                
                s_oGame.checkNextSquare(_aSquareInfo, iProvenience, _iColumn, _iRow);
            });
        };
    };

    this.setAnimationCross = function(iPassage, iProvenience){
        var aAnimations;
        if (iPassage === 1) {
            aAnimations = ["PIPE_CROSS_WATER_V2", "PIPE_CROSS_WATER_H2", 
                           "PIPE_CROSS_WATER_V1", "PIPE_CROSS_WATER_H1"];
        } else {
            aAnimations = ["PIPE_CROSS_WATER_FULL_H2", "PIPE_CROSS_WATER_FULL_V2", 
                           "PIPE_CROSS_WATER_FULL_H1", "PIPE_CROSS_WATER_FULL_V1"];            
        };
        
        _oPipeSprite.gotoAndPlay(aAnimations[iProvenience]);
        _oPipeSprite.removeAllEventListeners();
        
        if (iPassage === 1) {
            if (_oPipeSprite.currentAnimation === aAnimations[iProvenience]) {
                _oPipeSprite.on("animationend", function() {
                    s_oGame.checkNextSquare(_aSquareInfo, iProvenience, _iColumn, _iRow);
                });
            };
        } else {
            if (_oPipeSprite.currentAnimation === aAnimations[iProvenience]) {
                _oPipeSprite.on("animationend", function() {
                    s_oGame.checkNextSquare(_aSquareInfo, iProvenience, _iColumn, _iRow);
                });
            };
        };
    };

    this.setPaused = function(bValue) {
        _oPipeSprite.paused = bValue;
    };
    
    this.setWatered = function(iProvenience){
        if (_aSquareInfo[0] === 0) {    // EMPTY PIPE
            s_oGame.checkLevel();
            return;
        };
        
        // SET WATERED AND CHANGE IMAGE (NOT FOR A START PIPE)
        if (_aSquareInfo[0] !== 4) {            
            s_oGame.subtractLevelGoal();
            s_oGame.addPipePoints();
            
            new createjs.Tween.get(_oPipeSprite)
                .to({scaleX: 1.1, scaleY: 1.1}, 250, createjs.Ease.cubicIn)
                .to({scaleX: 1, scaleY: 1}, 250, createjs.Ease.cubicOut);
        };
        
        switch(_aSquareInfo[0]) {
            case 1: // HORIZONTAL PIPE
                if (_bWatered === true) {    // WATERED ALREADY, GAME OVER
                    s_oGame.checkLevel();
                } else {
                    _oThis.updateImageHorizontal(iProvenience);                    
                };
                break;
            case 2: // ANGLE PIPE
                if (_bWatered === true) {    // WATERED ALREADY, GAME OVER                    
                    s_oGame.checkLevel();
                } else {
                    _oThis.updateImageAngle(iProvenience);                    
                };                
                break;
            case 3: // CROSS PIPE
                if (_bWatered === false) {   // FIRST PASSAGE
                    _oThis.setAnimationCross(1, iProvenience);                    
                } else {                     // SECOND PASSAGE
                    _oThis.setAnimationCross(2, iProvenience);
                };
                break;
            case 4: // START PIPE                
                if (_bWatered === true) {    // WATERED ALREADY, GAME OVER
                    s_oGame.checkLevel();
                } else {                    
                    _oThis.updateImageStart(iProvenience);                    
                };                
                break;
        };
        
        _bWatered = true;                    
    };
    
    this.isWatered = function(){
        return _bWatered;
    };

    this.getColumn = function(){
        return _iColumn;
    };
    
    this.getRow = function(){
        return _iRow;
    };

    this.unload = function(){
        _oThis = null;
        _oArrow = null;
        _oPipeSprite = null;
        _oExplosion = null;
        _oMalus = null;
   };
    
    _oThis = this;
    
    this._init();
}