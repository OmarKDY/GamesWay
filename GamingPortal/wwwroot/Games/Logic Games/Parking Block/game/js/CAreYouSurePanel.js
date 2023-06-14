function CAreYouSurePanel(oConfirmCB, oNegateCB){
    
    var _oBg;
    var _oMsgText;
    var _oMsgTextOutline;
    var _oButConfirm;
    var _oButNegate;
    
    var _oFade;
    
    var _oContainer;
    var _oListener;
    var _oParent;
    
    
    this._init = function(oConfirmCB, oNegateCB){
        
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oListener = _oFade.on("click", function(){});
        _oContainer.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSprite);
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;
        _oBg.regX = oSprite.width/2;
        _oBg.regY = oSprite.height/2;
        _oContainer.addChild(_oBg);
             
        _oMsgTextOutline = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2 - 250, 700, 160, 
                    80, "center", "#0075b8", FONT, 1,
                    0, 0,
                    TEXT_ARE_YOU_SURE,
                    true, true, false,
                    false );
        _oMsgTextOutline.setOutline(8);            
       
        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-350, CANVAS_HEIGHT/2 - 250, 700, 160, 
                    80, "center", "#fff", FONT, 1,
                    0, 0,
                    TEXT_ARE_YOU_SURE,
                    true, true, false,
                    false );
        
        var oSprite = s_oSpriteLibrary.getSprite('but_yes');
        var pStartPosConfirm = {x: CANVAS_WIDTH/2 -200, y: 1100};
        _oButConfirm = new CGfxButton(pStartPosConfirm.x, pStartPosConfirm.y, oSprite, _oContainer);
        _oButConfirm.addEventListener(ON_MOUSE_UP, this._onConfirm, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_no');
        var pStartPosNegate = {x: CANVAS_WIDTH/2 +200, y: 1100};
        _oButNegate = new CGfxButton(pStartPosNegate.x, pStartPosNegate.y, oSprite, _oContainer);
        _oButNegate.addEventListener(ON_MOUSE_UP, this._onNegate, this);
        _oButNegate.pulseAnimation();
        
        this.hide();
        
    };
    
    this.unload = function(){   
        _oButConfirm.unload(); 
        _oButConfirm = null;
        
        _oButNegate.unload(); 
        _oButNegate = null;

        _oFade.off("click", _oListener);

        s_oStage.removeChild(_oContainer);
    };
    
    this.show = function(){
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this._onConfirm = function(){
        if(oConfirmCB){
            oConfirmCB();
        }
    };
    
    this._onNegate = function(){
        _oParent.hide();
        if(oNegateCB){
            oNegateCB();
        }
    };
    
    this.setMessage = function(szMessage){
        _oMsgTextOutline.refreshText(szMessage);
        _oMsgText.refreshText(szMessage);
    };
    
    this._init(oConfirmCB, oNegateCB);
    _oParent = this;
    
};


