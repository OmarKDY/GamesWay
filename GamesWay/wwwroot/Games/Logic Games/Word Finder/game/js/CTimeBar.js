function CTimeBar(iX,iY){
    var _iX;
    var _iY;
    var _iHeight;
    var _iMaskWidth;
    var _oTimeText;
    var _oMask;
    var _oContainer;
    
    this._init = function(iX,iY){
       _iX = iX;
       _iY = iY;
       _oContainer = new createjs.Container();
       _oContainer.x = iX;
       _oContainer.y = iY;
       s_oStage.addChild(_oContainer); 
       
       var oSprite = s_oSpriteLibrary.getSprite('timebar_bg');
       var oBg = createBitmap(oSprite);
       oBg.y = 25;
       _oContainer.addChild(oBg);
       
       _oMask  = createBitmap(s_oSpriteLibrary.getSprite('timebar_fill'));
       _oMask.y = oBg.y + oSprite.height;
       _oMask.regY = oSprite.height;
       _oContainer.addChild(_oMask);

       _oTimeText = new createjs.Text("","20px "+FONT_GAME, "#55bcff");
       _oTimeText.x = oSprite.width/2;
       _oTimeText.y = oBg.y + oSprite.height + 20;
       _oTimeText.textAlign = "center";
       _oTimeText.textBaseline = "alphabetic";
       _oContainer.addChild(_oTimeText);
       
       _iHeight = oSprite.height;
       
       var oSpriteIcon = s_oSpriteLibrary.getSprite('time_icon');
       var oTimeIcon = createBitmap(oSpriteIcon);
       oTimeIcon.regX = oSpriteIcon.width/2;
       oTimeIcon.regY = oSpriteIcon.height/2;
       oTimeIcon.x = oSprite.width/2;
       _oContainer.addChild(oTimeIcon);
    };
    
    this.refreshTime= function(iTime){
        _oTimeText.text = formatTime(Math.floor(iTime));
			
	var iPerc = (iTime/TIME_LEVEL).toFixed(2);
	_oMask.scaleY = iPerc;
    };
    
    this._init(iX,iY);
}