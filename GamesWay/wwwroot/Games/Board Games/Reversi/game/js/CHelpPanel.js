function CHelpPanel(){
    
    var _aPawn;
    
    var _oText1;
    var _oText2;

    var _oHelpBg;
    var _oGroup;
    var _oParent;
    var _oListener;

    this._init = function(){
        _oGroup = new createjs.Container();
        
        var oParent = this;
        _oHelpBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oGroup.addChild(_oHelpBg);
  
        var oSprite = s_oSpriteLibrary.getSprite('pawn');
        var oData = {   // image to use
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: PAWN_SIZE, height: PAWN_SIZE, regX:PAWN_SIZE/2,regY:PAWN_SIZE/2}, 
                        animations: {  black: [0],white:[1]}
                        
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _aPawn = new Array();
        for(var i=0; i<4; i++){
            _aPawn[i] = createSprite(oSpriteSheet,i%2,PAWN_SIZE/2,PAWN_SIZE/2,PAWN_SIZE,PAWN_SIZE);
            _aPawn[i].stop();
            if(i<2){
                _aPawn[i].y = 850; 
                if(i%2 === 0){
                    _aPawn[i].x = CANVAS_WIDTH/2 + 50;
                } else {
                    _aPawn[i].x = CANVAS_WIDTH/2 - 50;
                }
            } else {
                _aPawn[i].y = 950; 
                if(i%2 === 0){
                    _aPawn[i].x = CANVAS_WIDTH/2 - 50;
                } else {
                    _aPawn[i].x = CANVAS_WIDTH/2 + 50;
                }
            }       
        }

        var oText1Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2)- 270};
  
        var iWidth = 700;
        var iHeight = 180;
        var iTextX = oText1Pos.x;
        var iTextY = oText1Pos.y;
        _oText1 = new CTLText(_oGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP1,
                    true, true, true,
                    false );
  
        var oText2Pos = {x: CANVAS_WIDTH/2, y: (CANVAS_HEIGHT/2) + 160};

        var iWidth = 700;
        var iHeight = 180;
        var iTextX = oText2Pos.x;
        var iTextY = oText2Pos.y;
        _oText2 = new CTLText(_oGroup, 
                    iTextX-iWidth/2, iTextY-iHeight/2, iWidth, iHeight, 
                    40, "center", "#fff", PRIMARY_FONT, 1,
                    2, 2,
                    TEXT_HELP2,
                    true, true, true,
                    false );
        
        
        _oGroup.addChild(_aPawn[0], _aPawn[1], _aPawn[2], _aPawn[3]);
        _oGroup.alpha=0;
        s_oStage.addChild(_oGroup);

        createjs.Tween.get(_oGroup).to({alpha:1}, 700);        
        
        _oListener = _oGroup.on("pressup",function(){oParent._onExitHelp();});
        
        
    };

    this.unload = function(){
        s_oStage.removeChild(_oGroup);

        var oParent = this;
        _oGroup.off("pressup", _oListener);
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame._onExitHelp();
    };

    _oParent=this;
    this._init();

}
