function CPlayer (iPlayer, oParentContainer){
    var _oParentContainer;
    var _oPlayerContainer;
    var _oPlayerBg;
    
    var _iPlayer;
    
    var _aDices;
    var _aCombinations;
    var _aOffsetX;
    var _aOffsetY;
    var _aRotations;
    
    this.init = function(){
        _aOffsetX = [0,0,40,-40];
        _aOffsetY = [-40,40,0,0];
        _aRotations = [0,180,90,270];
        
        _iPlayer = iPlayer;
        _aDices = [];
        _aCombinations = [];
        
        _oPlayerContainer = new createjs.Container();
        _oParentContainer.addChild(_oPlayerContainer);
        
        this._initFrame();
        this._initText();
        this._initDices();
        this._initCombinations();                
    };
    
    this._initFrame = function(){        
        var data = {
            images: [s_oSpriteLibrary.getSprite("player_frame" + iPlayer)],
            frames: {width: 427, height: 178},
            animations: {turn_off: [0,0, "turn_off"],
                         turn_on : [1,1, "turn_on"]},
            framerate: 0
        };
        var oSpriteSheet = new createjs.SpriteSheet(data);        
        _oPlayerBg = createSprite(oSpriteSheet, 0, 427 * 0.5, 178 * 0.5, 427, 178);
        _oPlayerBg.regX = 427 * 0.5;
        _oPlayerBg.regY = 178 * 0.5;
        _oPlayerBg.x = CANVAS_WIDTH_HALF + PLAYER_TEXT_POSITIONS_X[_iPlayer] + _aOffsetX[_iPlayer];
        _oPlayerBg.y = CANVAS_HEIGHT_HALF + PLAYER_TEXT_POSITIONS_Y[_iPlayer] + _aOffsetY[_iPlayer];
        _oPlayerBg.rotation = _aRotations[_iPlayer];
        _oPlayerBg.gotoAndStop("turn_off");
        _oPlayerContainer.addChild(_oPlayerBg);
    };
    
    this._initText = function(){
        var iPlayerTextN = _iPlayer+1;        
        var aPosX = [-120,100,-390,373];
        var aPosY = [168,-200,-120,100];
        
        var oPlayerNumberText = new CTLText(_oPlayerContainer, 
                    CANVAS_WIDTH_HALF + aPosX[_iPlayer]-75, CANVAS_HEIGHT_HALF + aPosY[_iPlayer], 170, 28, 
                    28, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_PLAYER + " " + iPlayerTextN,
                    true, true, false,
                    false );
                    

        if (_iPlayer === 2) {
            oPlayerNumberText.setRotation(90);
        } else if (_iPlayer > 2) {
            oPlayerNumberText.setRotation(270);
        } 
    };
    
    this._initDices = function(){
        for (var i = 0; i < DICES_NUMBER; i++) {
            var oDice = new CDice(_iPlayer, i, _oPlayerContainer);
            _aDices.push(oDice);
        };
    };
    
    this._initCombinations = function(){
        for (var i = 0; i < COMBINATIONS_NUMBER; i++) {
            _aCombinations[i] = {value: DEFAULT_VALUE, completed: false};
        };
    };
    
    this.setTurn = function(bValue){
        if (bValue) {
            _oPlayerBg.gotoAndStop("turn_on");
        } else {
            _oPlayerBg.gotoAndStop("turn_off");
        }
    };
    
    this.getPlayerNumber = function(){
        return _iPlayer;
    };
    
    this.getDices = function(){
        return _aDices;
    };
    
    this.getCombinations = function(){
        return _aCombinations;
    };
    
    this.setCombinationValue = function(iIndex, iValue){
        _aCombinations[iIndex].value = iValue;
        _aCombinations[iIndex].completed = true;
    };
    
    this.isTurnBlocked = function(){
        var bBlocked = false;
        
        for (var i = 0; i < _aDices.length; i++) {
            if (_aDices[i].isAnimationOn() === true) {
                bBlocked = true;
            }
        };
        
        return bBlocked;
    };
    
    this.setDicesValues = function(aValues){
        if (this.isTurnBlocked() === true) {
            return;
        }
        
        for (var i = 0; i < _aDices.length; i++) {
            if (_aDices[i].isLocked() === false) {
                _aDices[i].setValue(aValues[i]);
            }
        }
    };
    
    this.getTotal = function(iID){
        var iTotal = 0;
        
        switch(iID){
            case ID_SCORE_TOP_BONUS: {
                for (var i = 0; i < COMBINATION_TOP_LIMIT; i++) {
                    if (_aCombinations[i].value > -1) {
                        iTotal += _aCombinations[i].value;
                    }
                };
                
                if (iTotal < TOP_BONUS_LIMIT) {
                    iTotal = DEFAULT_VALUE;
                } else {
                    iTotal = TOP_BONUS_VALUE;
                }
                break;
            }
            case ID_SCORE_TOP_TOTAL: {
                for (var i = 0; i < COMBINATION_TOP_LIMIT; i++) {
                    if (_aCombinations[i].value > -1) {
                        iTotal += _aCombinations[i].value;
                    }
                };
                // ADD THE TOP BONUS IF VALID
                if (this.getTotal(ID_SCORE_TOP_BONUS) > -1) {
                    iTotal += this.getTotal(ID_SCORE_TOP_BONUS);
                }
                break;
            }
            case ID_SCORE_BOTTOM_TOTAL: {
                for (var i = COMBINATION_TOP_LIMIT; i < _aCombinations.length; i++) {
                    if (_aCombinations[i].value > -1) {
                        iTotal += _aCombinations[i].value;
                    }
                };
                break;
            }
        }
        return iTotal;
    };

    _oParentContainer = oParentContainer;
    
    this.init();
};