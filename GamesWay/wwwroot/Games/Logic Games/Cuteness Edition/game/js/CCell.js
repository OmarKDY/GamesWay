function CCell(iX,iY,oParentContainer){
    var _iType;
    var _oSpriteSheet;
    var _oCell;
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iX,iY){
        _iType = 0;
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("cells");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: CELL_WIDTH/2, regY: CELL_HEIGHT/2},
            animations: { cell_0: [-1], cell_1: [0], cell_2: [1], cell_3: [2], cell_4: [3], 
                          cell_5: [4], cell_6: [5], cell_7: [6],cell_8: [7], cell_9: [8], 
                          cell_10: [9], cell_11: [10],cell_12:[11],cell_13:[12]}
        };

        _oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCell = createSprite(_oSpriteSheet, "cell_"+_iType, CELL_WIDTH / 2, CELL_HEIGHT / 2, CELL_WIDTH, CELL_HEIGHT);
        _oContainer.addChild(_oCell); 
    };
    
    this.reset = function(){
        this.setValue(0);
    };
    
    this.setValue = function(iNewValue){
        _iType = iNewValue;
        _oCell.gotoAndStop("cell_"+_iType);
    };
    
    this.setNextValue = function(){
        _iType++;
        _oCell.gotoAndStop("cell_"+_iType);
    };
    
    this.setEmpty = function(){
        _iType = 0;
        _oCell.gotoAndStop("cell_"+_iType);
    };
    
    this.playSpawnAnim = function(){
        _oCell.scaleX = _oCell.scaleY = 0.1;
        this.setNextValue();
        createjs.Tween.get(_oCell).to({scaleX:1,scaleY:1}, 500,createjs.Ease.backOut).call(function(){});
    };
    
    this.playNewValueAnim = function(iNewValue){
        if(_iType > 0){
            playSound("matching", 1, false);
            if(_iType > 7){
                playSound("great_matching", 1, false);
            }
            createjs.Tween.get(_oCell).to({scaleX:1.1,scaleY:1.1}, 100,createjs.Ease.linear).call(function(){
                                                                                createjs.Tween.get(_oCell).to({scaleX:1,scaleY:1}, 100,createjs.Ease.linear)
                                                                                    });
        }
       
        this.setValue(iNewValue);
    };
    
    this.getPos = function(){
        return {x:_oContainer.x,y:_oContainer.y};
    };
    
    this.getType = function(){
        return _iType;
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}