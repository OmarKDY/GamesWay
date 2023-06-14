function CCell(iCol,iRow,iPosX,iPosY,oParentContainer){
    
    var _iCol;
    var _iRow;
    var _iPosX;
    var _iPosY;
    var _oContainer;
    var _oBitMap;
    var _oSpriteSheet;
    var _bEmpty = true;
    var _iColor = 99;
    var _oParentContainer;
    var _oParent = this;
    var _oListener = false;
    
    this.init = function(iCol,iRow,iPosX,iPosY,oParentContainer){
        _iCol = iCol;
        _iRow = iRow;
        _iPosX = iPosX;
        _iPosY = iPosY;
        _iYFix = 0;
        
        _oContainer = new createjs.Container();
        _oParentContainer = oParentContainer;
        
        _oBitMap = new createBitmap(s_oSpriteLibrary.getSprite("empty_cell"));
        _oBitMap.regX = PIECE_WIDTH/2;
        _oBitMap.regY = PIECE_HEIGHT/2;
        _oContainer.addChild(_oBitMap);
        _oContainer.x = _iPosX;
        _oContainer.y = _iPosY;
        _oListener = _oContainer.on("mousedown",_oParent.onClick,_oParent);
        _oParentContainer.addChild(_oContainer);
        
           var oSprite = s_oSpriteLibrary.getSprite("colors");
            var oData = {   // image to use
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: PIECE_WIDTH, height: PIECE_HEIGHT,regX:PIECE_WIDTH/2,regY:PIECE_HEIGHT/2}, 
                            animations: {  red: [0],blue: [1],yellow: [2],green: [3],pink: [4],black: [5],azure: [6],violet: [7]}
            };
            _oSpriteSheet = new createjs.SpriteSheet(oData);
    };
    
    this.getPosition = function(){
       return {x:_oContainer.x,y:_oContainer.y}; 
    };
    
    this.setPiece = function(iColor){
        var oSprite;
        _iColor = iColor;
        _oContainer.removeChild(_oBitMap);
        oSprite = createSprite(_oSpriteSheet,_iColor,PIECE_WIDTH/2,PIECE_HEIGHT/2,PIECE_WIDTH,PIECE_HEIGHT);
        oSprite.stop();
        _oContainer.addChild(oSprite);
        _bEmpty = false;
    };
    
    this.getAlreadyPlaced = function(){
       return _bEmpty; 
    };
    
    this.getCurrentColor = function(){
       return _iColor; 
    };
    
    this.onClick = function(){
       if (_bEmpty===false){
           playSound("click");
           s_oGame.removeCell(_iColor);
           _oContainer.removeAllChildren();
           _oContainer.addChild(_oBitMap);
           _iColor = 99;
           _bEmpty = true;
       }
    };
    
    this.disableCell = function(){
       _oContainer.off("mousedown",_oListener);
    };
    
    this.init(iCol,iRow,iPosX,iPosY,oParentContainer);
}