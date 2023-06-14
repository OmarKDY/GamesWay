function CFakeMovingCell(iType,pStartPos,pEndPos,iFinalRow,iFinalCol,oParentContainer){
    var _iType;
    var _pFinalCoord;
    var _pEndPos;
    var _oCell;
    var _oContainer;
    var _oParentContainer;
    var _oThis;
    
    this._init = function(iType,pStartPos,pEndPos,iFinalRow,iFinalCol){
        _iType = iType;
        _pEndPos = pEndPos;
        _pFinalCoord = {row:iFinalRow,col:iFinalCol};
        
        _oContainer = new createjs.Container();
        _oContainer.x = pStartPos.x;
        _oContainer.y = pStartPos.y;
        _oParentContainer.addChild(_oContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite("cells");
        var oData = {
            images: [oSprite],
            // width, height & registration point of each sprite
            frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: CELL_WIDTH/2, regY: CELL_HEIGHT/2},
            animations: { cell_0: [-1], cell_1: [0], cell_2: [1], cell_3: [2], cell_4: [3], 
                          cell_5: [4], cell_6: [5], cell_7: [6],cell_8: [7], cell_9: [8], 
                          cell_10: [9], cell_11: [10],cell_12:[11]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oCell = createSprite(oSpriteSheet, "cell_"+_iType, CELL_WIDTH / 2, CELL_HEIGHT / 2, CELL_WIDTH, CELL_HEIGHT);
        _oContainer.addChild(_oCell); 
    };
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.playMovingAnim = function(){
        createjs.Tween.get(_oContainer).to({x:_pEndPos.x,y:_pEndPos.y}, 100,createjs.Ease.linear).call(function(){
                                                                                    s_oGame.movingCellArrived(_pFinalCoord.row,_pFinalCoord.col);
                                                                                    _oThis.unload();
                                                                                });
    };
    
    this.getCoord = function(){
        return {row:_pFinalCoord.row,col:_pFinalCoord.col};
    };
    
    _oThis = this;
    _oParentContainer = oParentContainer;
    this._init(iType,pStartPos,pEndPos,iFinalRow,iFinalCol);
}