function CPipe(iType, iColumn, iRow, oParentContainer, iPosition, aColumnCoords, aRowCoords) {
    var _oSquareInfo;       // THIS WILL HAVE ALL THE INFOS NEEDED
    var _oParentContainer;
    var _oPipeSprite;
    
    var _iPosition;
    var _iColumn;
    var _iRow;
    
    var _bStartPipe;
    var _bMovingPipe;
    var _bAnimationOver;
    
    this._init = function() {
        _iColumn = iColumn;
        _iRow = iRow;
        _iPosition = iPosition;
        _oSquareInfo = new Array;
        _oSquareInfo = SQUARE_TYPES[iType];
        _bStartPipe = false;
        _bMovingPipe = false;
        _bAnimationOver = false;
        
        // IF IT'S THE START PIPE
        if (_oSquareInfo.img === PIPE_IMG_START) {
            var data = {
                images: [s_oSpriteLibrary.getSprite("dispenser_tube")],
                frames: {width: 170, height: 130},
                animations: { PIPE_START: [0,0],
                              PIPE_START_WATER: [1,26, false] },
                framerate: FPS_LIQUID_FLOW
            };
        
            var oSpriteSheet = new createjs.SpriteSheet(data);             
            _oPipeSprite = createSprite(oSpriteSheet, "PIPE_START", 0, 0, 170, 130);
            _oPipeSprite.regX = 170*0.5 + 54;
            _oPipeSprite.regY = 130*0.5 + 22;
            _oPipeSprite.x = aColumnCoords[_iColumn];
            _oPipeSprite.y = aRowCoords[_iRow];
            _oPipeSprite.rotation = _oSquareInfo.solution_rot[0];
            _oPipeSprite.gotoAndPlay(szAnimationType);
            _oParentContainer.addChild(_oPipeSprite);        

            _bStartPipe = true;            
            return;
        }
        
        // IF NOT A START PIPE
        var data = {
            images: [s_oSpriteLibrary.getSprite("pipe1a"),
                     s_oSpriteLibrary.getSprite("pipe1b"),
                     s_oSpriteLibrary.getSprite("pipe2a"),
                     s_oSpriteLibrary.getSprite("pipe2b")],
            frames: {width: PIPE_FRAME_SIZE, height: PIPE_FRAME_SIZE},
            animations: {PIPE_HORIZONTAL: [0,0],
                         PIPE_HORIZONTAL_WATER_1: [1,19, false],
                         PIPE_HORIZONTAL_WATER_2: [21,39, false],
                         PIPE_ANGLE: [40,40],
                         PIPE_ANGLE_WATER_1: [41,59, false],
                         PIPE_ANGLE_WATER_2: [61,79, false]},
            framerate: FPS_LIQUID_FLOW
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);        
        var szAnimationType;
        switch (_oSquareInfo.img) {
            case PIPE_IMG_EMPTY:
                // AVOID CREATING A PIPE IF IT'S EMPTY
                return;
            case PIPE_IMG_HORIZONTAL:
                szAnimationType = "PIPE_HORIZONTAL";
                break;
            case PIPE_IMG_ANGLE:
                szAnimationType = "PIPE_ANGLE";
                break;
        };
        
        _oPipeSprite = createSprite(oSpriteSheet, szAnimationType, 0, 0, PIPE_FRAME_SIZE, PIPE_FRAME_SIZE);
        _oPipeSprite.regX = _oPipeSprite.regY = PIPE_FRAME_SIZE * 0.5;
        _oPipeSprite.x = aColumnCoords[_iColumn];
        _oPipeSprite.y = aRowCoords[_iRow];
        _oPipeSprite.rotation = _oSquareInfo.solution_rot[0];
        _oPipeSprite.gotoAndPlay(szAnimationType);
        _oParentContainer.addChild(_oPipeSprite);        
        _oPipeSprite.on("pressup", this.onClickedSquare);

        if (!s_bMobile) {
            _oPipeSprite.cursor = "pointer";
        };
    };
    
    this.setPaused = function(bValue){        
        if (_bAnimationOver) {
            return;
        };
        
        if (bValue) {
            _oPipeSprite.stop();
        } else {            
            _oPipeSprite.play();            
        };
    };
    
    this.getPipeInfos = function(){
        return _oSquareInfo;
    };
    
    this.rotatePipe = function(iValue){
        if (_bStartPipe) {
            return;
        };
        
        if ( _oSquareInfo.img === PIPE_IMG_HORIZONTAL ) {
            if (iValue === 0 || iValue === 180) {
                _oPipeSprite.rotation = 0;
            } else {
                _oPipeSprite.rotation = 90;
            }
        } else {    
            _oPipeSprite.rotation = iValue;
        };
    };
    
    this.onClickedSquare = function(){
        if (_bStartPipe || _bMovingPipe || s_oGame.isStartGame() === false) {
            return;
        };
        
        _bMovingPipe = true;
        
        // ROTATE THE PIPE
        var iNewRotation = _oPipeSprite.rotation + 90;        
        createjs.Tween.get(_oPipeSprite)
            .to({rotation: iNewRotation}, 200, createjs.Ease.cubicOut)
            .call(function(){
                if ( _oSquareInfo.img === PIPE_IMG_HORIZONTAL ) {
                    if (iNewRotation === 0 || iNewRotation === 180) {
                        _oPipeSprite.rotation = 0;
                    } else {
                        _oPipeSprite.rotation = 90;
                    }
                }
        
                if (_oPipeSprite.rotation === 360) {
                    _oPipeSprite.rotation = 0;
                };

                s_oGame.onClickedPipe();
                _bMovingPipe = false;
            });
    };

    this.updateImageHorizontal = function(iProvenience){    
        var szAnimation = "PIPE_HORIZONTAL_WATER_1";
        
        if (iProvenience === PROVENIENCE_RIGHT ||
            iProvenience === PROVENIENCE_BOTTOM ) {
            szAnimation = "PIPE_HORIZONTAL_WATER_2";
        };
        
        this.setAnimation(szAnimation);
    };
    
    this.updateImageAngle = function(iProvenience){
        var oPipeRot = _oPipeSprite.rotation;
        
        var szAnimation = "PIPE_ANGLE_WATER_1";
        if (oPipeRot === 0 && iProvenience === PROVENIENCE_TOP ||
            oPipeRot === 90 && iProvenience === PROVENIENCE_RIGHT ||
            oPipeRot === 180 && iProvenience === PROVENIENCE_BOTTOM ||
            oPipeRot === 270 && iProvenience === PROVENIENCE_LEFT ) {
            szAnimation = "PIPE_ANGLE_WATER_2";
        };
        this.setAnimation(szAnimation);
    };
    
    this.updateImageStart = function(){
        this.setAnimation("PIPE_START_WATER");
    };
    
    this.setAnimation = function(szAnimation){
        _oPipeSprite.gotoAndPlay(szAnimation);
        _oPipeSprite.removeAllEventListeners();
        
        if (_oPipeSprite.currentAnimation === szAnimation) {
            _oPipeSprite.on("animationend", function(){
                _bAnimationOver = true;
                s_oGame.onPipeAnimationEnd();
            });
        };
    };
    
    this.setWatered = function(iProvenience){
        if ( _oSquareInfo.img === PIPE_IMG_EMPTY) {    // EMPTY PIPE
            return;
        };
        
        // SET WATERED AND CHANGE IMAGE (NOT FOR A START PIPE)
        if ( _oSquareInfo.img !== PIPE_IMG_START) {
            new createjs.Tween.get(_oPipeSprite)
                .to({scaleX: 1.1, scaleY: 1.1}, 250, createjs.Ease.cubicIn)
                .to({scaleX: 1, scaleY: 1}, 250, createjs.Ease.cubicOut);
        };
        
        switch( _oSquareInfo.img ) {
            case PIPE_IMG_HORIZONTAL: // HORIZONTAL PIPE
                this.updateImageHorizontal(iProvenience);                    
                break;
            case PIPE_IMG_ANGLE: // ANGLE PIPE
                this.updateImageAngle(iProvenience);                    
                break;
            case PIPE_IMG_START: // START PIPE                
                this.updateImageStart(iProvenience);                    
                break;
        };
    };
    
    this.getColumn = function(){
        return _iColumn;
    };
    
    this.getRow = function(){
        return _iRow;
    };
    
    this.isCorrectlyRotated = function(){
        var aCorrectRotations = _oSquareInfo.solution_rot;
        
        if ( aCorrectRotations.indexOf(_oPipeSprite.rotation) !== -1 ) {            
            return true;
        };

        return false;
    };
    
    this.setFrameRate = function(iVal){
        _oPipeSprite.framerate = iVal;
    };
    
    this.getCurPipeState = function(){
        var oState = null;
        switch (_oSquareInfo.img) {
            case PIPE_IMG_HORIZONTAL:
                if(_oPipeSprite.rotation === 0){
                    oState = {open_top:false, open_right:true, open_bottom:false, open_left:true};
                }else {
                    oState = {open_top:true, open_right:false, open_bottom:true, open_left:false};
                }
                break;
            case PIPE_IMG_ANGLE:
                switch(_oPipeSprite.rotation){
                    case 0:{
                            oState = {open_top:true, open_right:false, open_bottom:false, open_left:true};
                            break;
                    }
                    case 90:{
                            oState = {open_top:true, open_right:true, open_bottom:false, open_left:false};
                            break;
                    }
                    case 180:{
                            oState = {open_top:false, open_right:true, open_bottom:true, open_left:false};
                            break;
                    }
                    case 270:{
                            oState = {open_top:false, open_right:false, open_bottom:true, open_left:true};
                            break;
                    }
                }
                break;
            default:{   

                break;
            }
        };

        return oState;
    };
    
    this.unload = function(){
        _oPipeSprite = null;
    };
    
    
    _oParentContainer = oParentContainer;
    
    this._init();
}