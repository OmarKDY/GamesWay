function CPieceTable (iPieces){
    var _oContainer;
    var _iPieces;
    var _aStandardX;
    var _aPieces;
    
    this.init = function(iPieces){
        _aPieces = new Array();
        _oContainer = new createjs.Container();
        _iPieces = iPieces;
        
        var oPiece;
        _oContainer.y = (CANVAS_HEIGHT/2)+400;
        _oContainer.x = (CANVAS_WIDTH/2)-((PIECE_WIDTH/2)*(_iPieces-1));
        
        for (var i=0;i<_iPieces;i++){
            _aPieces[i] = new CPiece(i,(PIECE_WIDTH*i),0,_oContainer);
            _oContainer.addChild(_aPieces[i].getContainer());
        };
        
        //_oContainer.x = (CANVAS_WIDTH)-((PIECE_WIDTH*_iPieces))+PIECE_WIDTH/2/2;
       
        s_oStage.addChild(_oContainer);
        
        
    };
    
    this.getPosition = function(){
       return{x:_oContainer.x,y:_oContainer.y}; 
    };
    
    this.addPiece = function(iColor,iX){
        var oPiece;
        oPiece = new CPiece(iColor,iX,0,_oContainer);
        _oContainer.addChild(oPiece.getContainer());
    };
    
    this.getXNewPiece = function(iColor){
        return iColor*PIECE_WIDTH;
    };
    
    this.removeAllListener = function(){
       for (var i=0;i<_aPieces.length;i++){
          _aPieces[i].removeListener(); 
       }; 
    };
    
    this.initAllListener = function(){
        for (var i=0;i<_aPieces.length;i++){
          _aPieces[i].initListener(); 
       }; 
    };
    
    this.unload = function(){
        
        for (var i=0;i<_iPieces;i++){
            _aPieces[i].unload();
        };
        
       s_oStage.removeChild(_oContainer); 
    };
    
    this.init(iPieces);
}