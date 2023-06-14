function CCell(oSpriteSheet, iRow,iCol,iX,iY,oParentContainer,szstate, iScale){
    var _iRow;
    var _iCol;
    var _iScale = iScale;
    var _iIndex = iRow;
    var _jIndex = iCol;
    var _iState;
    var _iDirectionWithChange = NONE;
    var _iDirectionWithoutChange = NONE;
    
    var _oParticleSourceImage;
    
    var _szValue;
    
    var _oCell;
    var _oCellBg;
    
    this._init = function(oSpriteSheet, iRow,iCol,iX,iY,oParentContainer,szstate, iScale){
        _iRow = iRow;
        _iCol = iCol;
            
        _szValue = szstate;
        _iState = null;
       
        
        _oCellBg = createBitmap(s_oSpriteLibrary.getSprite("background"));
        _oCellBg.x = iX;
        _oCellBg.y = iY;
        _oCellBg.regX = (CELL_WIDTH/2);
        _oCellBg.regY = (CELL_HEIGHT/2);
        _oCellBg.scaleX = _oCellBg.scaleY = _iScale;
        oParentContainer.addChild(_oCellBg);
       
        
        _oCell = createSprite(oSpriteSheet, szstate, (CELL_WIDTH/2)*iScale, (CELL_HEIGHT/2)*iScale, CELL_WIDTH*iScale, CELL_HEIGHT*iScale);
        _oCell.x = iX;
        _oCell.y = iY;
        _oCell.scaleX = _oCell.scaleY = _iScale;
         oParentContainer.addChild(_oCell);
                
        if (!s_bMobile){
            _oCell.cursor = "pointer";
	}        
        _oCell.on("mousedown", this._onCellClick, this); 
        _oCell.on("pressup", this._releaseForm, this );
    };
    
    this.refreshScale = function(iNewX, iNewY, iNewScale){
        
        _iScale = iNewScale;
        
        _oCellBg.x = iNewX;
        _oCellBg.y = iNewY;
        _oCellBg.regX = (CELL_WIDTH/2);
        _oCellBg.regY = (CELL_HEIGHT/2);
        _oCellBg.scaleX = _oCellBg.scaleY = iNewScale;
        
        _oCell.x = iNewX;
        _oCell.y = iNewY;
        _oCell.scaleX = _oCell.scaleY = iNewScale;
    };
    
    this.changeCellState = function(szColor, iState, iRotation, iDirection, iDirectionChanged, bIsNewType){
        
   
        if(szColor === "hide"){
            _oCell.alpha = 1;
            if(!s_bMobile || s_bIsIphone){
                createjs.Tween.get(_oCell, {override:true}).to({alpha:0 }, 150).call(function() {
                    _oCell.gotoAndStop(szColor);
                    _szValue = szColor;
                    _iState = iState;
                    _iDirectionWithChange = iDirectionChanged;
                    _iDirectionWithoutChange = iDirection;
                    _oCell.rotation = iRotation;
                });
            }else{
                _oCell.gotoAndStop(szColor);
                _szValue = szColor;
                _iState = iState;
                _iDirectionWithChange = iDirectionChanged;
                _iDirectionWithoutChange = iDirection;
                _oCell.rotation = iRotation;
            }
        }else if(bIsNewType && iState !== 5 && iState !== 0){
            _oCell.gotoAndStop(szColor+iState);
            if(!s_bMobile || s_bIsIphone){
                _oCell.alpha = 0;
                createjs.Tween.get(_oCell, {override:true}).to({alpha:1 }, 500).call(function() {});



                _oParticleSourceImage = s_oSpriteLibrary.getSprite("particle");

                var oDataParticle = {   
                                images: [_oParticleSourceImage], 
                                framerate: 35,
                                // width, height & registration point of each sprite
                                frames: {width: PARTICLE_WIDTH, height: PARTICLE_HEIGHT, regX: PARTICLE_WIDTH/2, regY: PARTICLE_HEIGHT/2}, 
                                animations: {idle:[0, 15]}
                            };
                var oSpriteSheetParticle = new createjs.SpriteSheet(oDataParticle);
                var oParticle = createSprite(oSpriteSheetParticle, szstate, PARTICLE_WIDTH/2, PARTICLE_HEIGHT/2, PARTICLE_WIDTH, PARTICLE_HEIGHT);
                switch(iDirection){
                    case UP:
                        oParticle.x = iX;
                        oParticle.y = iY+CELL_HEIGHT/2;
                        break;
                    case DOWN:
                        oParticle.x = iX;
                        oParticle.y = iY-CELL_HEIGHT/2;
                        break;
                    case LEFT:
                        oParticle.x = iX+CELL_WIDTH/2;
                        oParticle.y = iY;
                        break;
                    case RIGHT:
                        oParticle.x = iX-CELL_WIDTH/2;
                        oParticle.y = iY;
                        break;
                }
                oParticle.gotoAndPlay("idle");
                oParticle.scaleX = oParticle.scaleY = _iScale;
                s_oStage.addChild(oParticle);
                createjs.Tween.get(oParticle).to({alpha:0 }, 500).call(function() {s_oStage.addChild(this);});
            }
      
        }else{
            if(iState === 1){
                this.flowerGrow(iState, iRotation, iDirection, iDirectionChanged);
            }else {
                _oCell.gotoAndStop(szColor+iState);
            }
        }
        if(szColor !== "hide"){
            _szValue = szColor;
            _iState = iState;
            _iDirectionWithChange = iDirectionChanged;
            _iDirectionWithoutChange = iDirection;
            _oCell.rotation = iRotation;
        }
    };
    
    this.flowerGrow = function(iState, iRotation, iDirection, iDirectionChanged){
        if(!s_bMobile || s_bIsIphone){
            _oCell.gotoAndPlay(_szValue+"Growing");
        }else{
            _oCell.gotoAndStop(_szValue+"5");
        }
        _iState = iState;
        _iDirectionWithChange = iDirectionChanged;
        _iDirectionWithoutChange = iDirection;
        _oCell.rotation = iRotation;
    };
    
    this.flowerDwarfing = function(iState, iRotation, iDirection, iDirectionChanged){
        if(!s_bMobile || s_bIsIphone){
            _oCell.gotoAndPlay(_szValue+"Dwarfing");
            createjs.Tween.get(_oCell, {override:true}).to({rotation:iRotation }, 150).call(function() {});
        }else{
            _oCell.gotoAndStop(_szValue+"0");
            _oCell.rotation = iRotation;
        }
        _iState = iState;
        _iDirectionWithChange = iDirectionChanged;
        _iDirectionWithoutChange = iDirection;
    };
    
    this._onCellClick = function(event){
        s_oGame.onCellClick(event, _iIndex, _jIndex);
    };
    
    this._releaseForm = function(event){
        s_oGame.releaseForm(event); 
    }; 
    
    this.getX = function(){
        return iX;
    };
    
    this.getY = function(){
        return iY;
    };
    
    this.getValue = function(){
        return _szValue;
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.getDirection = function(){
        return _iDirectionWithChange;
    };
    
    this.getDirectionNoChange = function(){
        return _iDirectionWithoutChange;
    };
    
    this.getRotation = function(){
        return _oCell.rotation;
    };
    
    this.unload = function(){
        _oCell.removeAllEventListeners();
    };
    
    s_oCell = this;
    
    this._init(oSpriteSheet, iRow,iCol,iX,iY,oParentContainer,szstate, iScale);
    
}