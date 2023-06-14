function CPiece(iX,iY,iType,oParentContainer){

    var _iType = iType;
    var _iIndexPoint;
    var _aCbCompleted;
    var _aCbOwner;
    var _oListener;
    
    var _oSprite;
    var _oHighlight;
    var _oHighlightRed;
    var _oContainer;
    var _oParentContainer = oParentContainer;
    
    this._init = function(iX,iY,iType){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteHighlight = s_oSpriteLibrary.getSprite("highlight");
        _oHighlight = createBitmap(oSpriteHighlight);
        _oHighlight.visible = false;
        _oHighlight.regX = oSpriteHighlight.width/2;
        _oHighlight.regY = oSpriteHighlight.height/2;
        _oContainer.addChild(_oHighlight);
        
        var oSpriteHighlight = s_oSpriteLibrary.getSprite("removable");
        _oHighlightRed = createBitmap(oSpriteHighlight);
        _oHighlightRed.visible = false;
        _oHighlightRed.regX = oSpriteHighlight.width/2;
        _oHighlightRed.regY = oSpriteHighlight.height/2;
        _oContainer.addChild(_oHighlightRed);
        
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite("piece"+iType)], 
                        framerate:15,
                        // width, height & registration point of each sprite
                        frames: {width: PIECE_WIDTH, height: PIECE_HEIGHT, regX: PIECE_WIDTH/2, regY: PIECE_HEIGHT/2}, 
                        animations: {start:0,anim:[0,4,"end"],end:4,loop_anim:[0,4]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
	_oSprite = createSprite(oSpriteSheet, "start",PIECE_WIDTH/2,PIECE_HEIGHT/2,PIECE_WIDTH,PIECE_HEIGHT);
        
        
        _oSprite.rotation = 90;
        _oContainer.addChild(_oSprite);
    };
    
    this.unload = function(){
        _iIndexPoint = -1;
        _oParentContainer.removeChild(_oContainer);
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.setScale = function(iScale){
        _oContainer.scaleX = _oContainer.scaleY = iScale;
    };
    
    this.move = function(pEndPos,szAnim,iIndex,oCallback,oOwner){
        _iIndexPoint = iIndex;
        _oSprite.gotoAndPlay(szAnim);
        _oSprite.visible = true;
        _oHighlight.visible = false;
        
        createjs.Tween.get(_oContainer).to({x: pEndPos.x,y:pEndPos.y}, 1000, createjs.Ease.cubicOut).call(function(){
                                                                                                            playSound("piece",1,false);
                                                                                                            if(oCallback !== null){
                                                                                                                oCallback.call(oOwner,this);
                                                                                                            }
                                                                                                        });
    };
    
    this.initListener = function(){
        _oListener = _oContainer.on("click",this._onSelect,this,false,{index:_iIndexPoint});
    };
    
    this.removeListener = function(){
        _oContainer.off("click",_oListener);
    };
    
    this.highlight = function(){
        _oHighlight.visible = true;
       _oHighlightRed.visible = false;
    };
    
    this.highlightRed = function(){
        playSound("locked",1,false);
        _oHighlightRed.visible = true;
        _oHighlight.visible = false;
    };
    
    this.unlight = function(){
        _oHighlight.visible = false;
        _oHighlightRed.visible = false;
    };
    
    this._onSelect = function(evt,oData){
        if(_aCbCompleted[ON_SELECT_PIECE]){
           _aCbCompleted[ON_SELECT_PIECE].call(_aCbOwner[ON_SELECT_PIECE],this,oData["index"]);
        }
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this.getPointIndex = function(){
        return _iIndexPoint;
    };
    
    this._init(iX,iY,iType);
}