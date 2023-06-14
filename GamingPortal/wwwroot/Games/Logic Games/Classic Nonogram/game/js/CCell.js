function CCell(iX,iY,iRow,iCol,oParentContainer, bSolution){
    var _bActive;
    var _iScale;
    var _oListenerDown;
    var _oListenerUp;
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams = [];

    var _oParentContainer = oParentContainer;
    var _oSprite;
    var _iState;
    var _bSolution;
    var _iRow;
    var _iCol;

    var _oWrongShape;
    var _oCorrectShape;

    var _oThis = this;

    this._init = function(iX,iY,iRow,iCol,bSolution){
        _bActive = true;
        _iScale = 1;
        _iState = CELL_STATE_EMPTY;
        _bSolution = bSolution;
        _iRow = iRow;
        _iCol = iCol;

        _oWrongShape = new createjs.Shape();
        _oWrongShape.graphics.beginFill("red").drawRoundRectComplex(iX,iY+5,CELL_WIDTH,CELL_HEIGHT-5,20,20,10,10);
        _oWrongShape.regX = CELL_WIDTH/2;
        _oWrongShape.regY = CELL_HEIGHT/2;
        _oWrongShape.alpha = 0.8;

        _oCorrectShape = new createjs.Shape();
        _oCorrectShape.graphics.beginFill(COLOR_2).drawRoundRectComplex(iX,iY+5,CELL_WIDTH,CELL_HEIGHT-5,20,20,10,10);
        _oCorrectShape.regX = CELL_WIDTH/2;
        _oCorrectShape.regY = CELL_HEIGHT/2;
        _oCorrectShape.alpha = 0.8;

        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        var oData = {   
            images: [s_oSpriteLibrary.getSprite("cubes_sprite")], 
            frames: {width:CELL_WIDTH, height:CELL_HEIGHT, regX:CELL_WIDTH/2, regY:CELL_HEIGHT/2}, 
            animations: {empty:0,filled:1,locked:2}
        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);

        _oSprite = createSprite(oSpriteSheet,"empty",CELL_WIDTH/2,CELL_HEIGHT/2,CELL_WIDTH,CELL_HEIGHT);
        _oSprite.stop();
        _oSprite.x = iX;
        _oSprite.y = iY;
        _oSprite.cursor = "pointer";
        _oParentContainer.addChild(_oSprite);

        this._initListener();
    };

    this.unload = function(){
        _oSprite.off("mousedown", _oListenerDown);
        _oSprite.off("pressup" , _oListenerUp); 
        
        _oParentContainer.removeChild(_oSprite);
    };

    this.activate = function(){
        _bActive = true;
    };
    
    this.deactivate = function(){
        _bActive = false;
    };

    this._initListener = function(){
        _oListenerDown = _oSprite.on("mousedown", this.cellDown);
        _oListenerUp = _oSprite.on("pressup" , this.cellRelease);      
    };
     
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
    };

    this.cellRelease = function(){
        if(_bActive === false || s_bPinchGesture || s_bPanGesture){
            return;
        }
        
        _oSprite.scaleX = _iScale;
        _oSprite.scaleY = _iScale;

        if(_iState == CELL_STATE_EMPTY){
            if(!s_bLock && _bSolution){
                playSound("click",1,false);    
                _oThis.setState(CELL_STATE_FILLED);
                _oThis.deactivate();
            }
            else{
                if(s_bLock && !_bSolution){
                    playSound("click",1,false);
                    _oThis.setState(CELL_STATE_LOCKED);
                    _oThis.deactivate();
                }
                else{
                    _oThis._playAnimation(_oWrongShape);
                    playSound("wrong",1,false);
                    if(s_oGame != null){
                        s_oGame.decreaseLives();
                        if(_bSolution){
                            _oThis.setState(CELL_STATE_FILLED);
                        }
                        else{
                            _oThis.setState(CELL_STATE_LOCKED);
                        }
                        _oThis.deactivate();
                    }
                }
            }
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_iRow,_iCol);
        }
    };

    this.fill = function(){
        if(_iState == CELL_STATE_EMPTY){
            if(!_bSolution){
                this.setState(CELL_STATE_LOCKED);
            }else{
                this.setState(CELL_STATE_FILLED);
            }
            this._playAnimation(_oCorrectShape);
        }
    }
    
    this._playAnimation = function(oShape){
        _oParentContainer.addChild(oShape);
        createjs.Tween.get(oShape)
        .to({alpha:0},400)
        .call(function(){
            _oParentContainer.removeChild(oShape);
            oShape.alpha = 0.8;
        })
    }

    this.setState = function(iState){
        if(iState == CELL_STATE_EMPTY){
            _oSprite.gotoAndStop("empty");
        }
        else if(iState == CELL_STATE_FILLED){
            _oSprite.gotoAndStop("filled");
        }
        else{
            _oSprite.gotoAndStop("locked");
        }

        _iState = iState;
    };
    
    this.cellDown = function(){
        if(_bActive === false || s_bPinchGesture || s_bPanGesture){
            return;
        }
        
        _oSprite.scaleX = _iScale*0.95;
        _oSprite.scaleY = _iScale*0.95;
        
        if(_aCbCompleted[ON_MOUSE_DOWN]){
            _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
        }

    };

    this.getX = function(){
        return _oSprite.x;
    };

    this.getY = function(){
        return _oSprite.y;
    };

    this.isSolution = function(){
        return _bSolution;
    };

    this.getCurrentState = function(){
        return _iState;
    }
    
    this._init(iX,iY,iRow,iCol,bSolution);
}