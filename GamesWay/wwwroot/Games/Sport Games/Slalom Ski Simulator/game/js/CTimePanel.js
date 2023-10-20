function CTimePanel(){
    var _aIntervals;
    var _pStartPosScore;
    
    var _oTimeText;
    var _oBestText;
    var _oContainer;
    
    this._init = function(){
        var oSpriteScore = s_oSpriteLibrary.getSprite("time_panel");
        _pStartPosScore = {x:0,y:10};
        
        _oContainer = new createjs.Container();
        _oContainer.x = _pStartPosScore.x;
        _oContainer.y = _pStartPosScore.y;
        s_oStage.addChild(_oContainer);
        
        var oScoreBg = createBitmap(oSpriteScore);
        _oContainer.addChild(oScoreBg);
        
        _oTimeText = new CTLText(_oContainer, 
                    40, 42, 150, 30, 
                    30, "left", "#fff", FONT_GAME, 1,
                    0, 0,
                    "00:00:00",
                    true, true, false,
                    false );


        
        _oBestText = new CTLText(_oContainer, 
                    40, 8, 150, 24, 
                    24, "left", "#ff7800", FONT_GAME, 1,
                    0, 0,
                    " ",
                    true, true, false,
                    false );
 
        
        
        //INTERVAL PANELS
        var oSprite = s_oSpriteLibrary.getSprite("interval_time");
        
        var oMask = oFade = new createjs.Shape();
        oMask.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,oSpriteScore.height -1, oSprite.width/2, oSprite.height*3);
        _oContainer.addChild(oMask);
        

        _aIntervals = new Array();
        for(var i=0;i<NUM_INTERVAL;i++){
            var oPanel = new CBestIntervalPanel(0,33,oSprite,_oContainer);
            
            oPanel.setMask(oMask);
            
            _aIntervals.push(oPanel);
        }

    };
    
    this.refreshButtonPos = function(){
        _oContainer.x = _pStartPosScore.x + s_iOffsetX;
        _oContainer.y = _pStartPosScore.y + s_iOffsetY;
    };
    
    this.reset = function(iTotBest){
        _oTimeText.refreshText("00:00:00");
        _oBestText.refreshText(iTotBest);
        for(var i=0;i<NUM_INTERVAL;i++){
            _aIntervals[i].reset();
        }
    };
    
    this.refreshTime = function(iTime){
        _oTimeText.refreshText(formatTime(iTime,false,3));
    };
    
    this.showNextInterval = function(iIndex,iDiff){
        _aIntervals[iIndex].show(iIndex+1,iDiff);
    };
    
    this._init();
}