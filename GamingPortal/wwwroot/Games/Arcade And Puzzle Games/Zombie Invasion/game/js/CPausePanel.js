function CPausePanel (oParentContainer){
    
    var _oBg;
    var _oFade;
    var _oMsgTextBack;
    var _oMsgText;
    var _oGroup;
    
    this._init = function(oParentContainer){
        
        //_oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH,CANVAS_HEIGHT);

        _oMsgTextBack = new createjs.Text(TEXT_PAUSE," 150px "+PRIMARY_FONT, "#ffffff");
        _oMsgTextBack.x = CANVAS_WIDTH/2 + 4;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2) +4;
        _oMsgTextBack.textAlign = "center";
        _oMsgTextBack.textBaseline = "middle";

        _oMsgText = new createjs.Text(TEXT_PAUSE," 150px "+PRIMARY_FONT, "#ff0000");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2);
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "middle";
        
        _oGroup = new createjs.Container();
        _oGroup.visible = false;
        
        _oGroup.addChild(_oFade, _oMsgTextBack, _oMsgText);
        oParentContainer.addChild(_oGroup);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oGroup);
    };
    
    this.show = function(bVal){
        _oGroup.visible = bVal;
    };
    
    this._init(oParentContainer);
    
};
