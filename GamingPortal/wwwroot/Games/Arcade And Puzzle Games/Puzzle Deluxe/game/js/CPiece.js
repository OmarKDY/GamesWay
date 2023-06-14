function CPiece(iX, iY, iIndex, oParentContainer, iRow, iCol){
    
    var _iNumPieces;
    var _iNumCut;
    var _iWidth;
    var _iHeight;
    var _iIndex;
    var _iRow;
    var _iCol;
    
    var _oSourceImage;
    var _oPieceContainer;
    var _oPiece;
    var _oTarget;
    
    
    
    this._init = function(iX, iY, iIndex, oParentContainer, iRow, iCol){
        
        _iRow = iRow;
        _iCol = iCol;        
        _iNumCut = s_iMode +3;
        _iNumPieces = _iNumCut * _iNumCut;
        _iIndex = iIndex;
        
        _oPieceContainer = new createjs.Container();
        _oPieceContainer.x = iX;
        _oPieceContainer.y = iY;
        _oPieceContainer.on("mousedown", this._onPieceClick, this, false, _iIndex);
        oParentContainer.addChild(_oPieceContainer);
        
        _oSourceImage = s_oSpriteLibrary.getSprite(s_szImage);
        _iWidth = _oSourceImage.width;
        _iHeight = _oSourceImage.height;
    
        var iCuttedWidth = _iWidth/_iNumCut;
        var iCuttedHeight = _iHeight/_iNumCut;

        var oData = {   
                        images: [_oSourceImage], 
                        // width, height & registration point of each sprite
                        frames: {width: iCuttedWidth, height: iCuttedHeight, regX: iCuttedWidth/2, regY: iCuttedHeight/2}, 
                        animations: {image:[0, _iNumPieces-1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oPiece = createSprite(oSpriteSheet, "image",iCuttedWidth/2,iCuttedHeight/2,iCuttedWidth,iCuttedHeight);
        _oPiece.gotoAndStop(_iIndex);
        
        var oNumPos;
        if(s_iMode === EASY_MODE){
            oNumPos = {x:125, y:125};
        } else if(s_iMode === NORMAL_MODE){
            oNumPos = {x:95, y:95};
        } else {
            oNumPos = {x:75, y:75};
        }
        
        _oTarget = new createjs.Shape();
        _oTarget.graphics.beginStroke("#ff8814").setStrokeStyle(10).drawRect(-iCuttedWidth/2, -iCuttedHeight/2, iCuttedWidth, iCuttedHeight);
        _oTarget.visible = false;
        
        _oPieceContainer.addChild(_oPiece, _oTarget);
        
    }; 
    
    this.unload = function(){
        _oPieceContainer.off("mousedown", this._onPieceClick, this, false, _iIndex);
        oParentContainer.removeChild(_oPieceContainer);
    };
    
    this._onPieceClick = function(evt, i){      
        s_oGame.onPieceClick(i);        
    };
    
    this.getIndex = function(){
        return _iIndex;
    };
    
    this.setTargetVisible = function(bVal){
        _oTarget.visible= bVal;
    };
    
    this.setInvisible = function(){
        _oPieceContainer.visible = false;
        _iIndex = -1;
    };  
    
    this.move = function(iX, iY){
        createjs.Tween.get(_oPieceContainer).to({x:iX, y:iY}, SHUFFLE_SPEED[s_iMode], createjs.Ease.cubicOut).call(function(){s_oGame.onCellMoved();});
    };
    
    this.getPos = function(){
        return {x: _oPieceContainer.x, y: _oPieceContainer.y};
    };
    
    this.setLogicPos = function(iRow, iCol){
        _iRow = iRow;
        _iCol = iCol;        
    };
    
    this.getLogicPos = function(){
        return {row: _iRow, col: _iCol};
    };
    
    this._init(iX, iY, iIndex, oParentContainer, iRow, iCol);
    
};