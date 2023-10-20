function CMsgBox(){
    
    var _oConfirmCB;
    
    var _oBg;
    var _oGroup;
    
    var _oMsgTextStroke;
    var _oMsgText;
    var _oButConfirm;
    var _oButExit;
    var _oParent;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.on("mousedown", function(){});
        s_oStage.addChild(_oGroup);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSprite);
        _oGroup.addChild(_oBg);

        var iSize = 30;    
        var iWidth = oSprite.width-200;
        var iHeight = 120;
        var iX = CANVAS_WIDTH/2;
        var iY = (CANVAS_HEIGHT/2-40);
        _oMsgTextStroke = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#730358", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, true,
                    false );
        _oMsgTextStroke.setOutline(4);            
       
        _oMsgText = new CTLText(_oGroup, 
                    iX-iWidth/2, iY-iHeight/2, iWidth, iHeight, 
                    iSize, "center", "#fff", FONT, 1.1,
                    2, 2,
                    " ",
                    true, true, true,
                    false ); 

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oButExit = new CGfxButton(CANVAS_WIDTH/2 + 210, 340, oSprite, _oGroup);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_next');
        _oButConfirm = new CGfxButton(CANVAS_WIDTH/2, 570, oSprite, _oGroup);
        _oButConfirm.addEventListener(ON_MOUSE_UP, this._onConfirm, this);

        
    };

    this.unload = function(){
        _oGroup.removeAllEventListeners();
        
        s_oStage.removeChild(_oGroup);
    };

    this.setMessage = function(szMessage){
        _oMsgTextStroke.refreshText( szMessage );
        _oMsgText.refreshText( szMessage );
    };

    this.disableConfirm = function(){
        _oButConfirm.setVisible(false);
    };

    this.setConfirm = function(oCallBack){
        _oConfirmCB = oCallBack;
    };

    this._onConfirm = function(){
        if(_oConfirmCB){
            _oConfirmCB();
        }   
    };
    
    this._onExit = function(){
        _oParent.unload();
    };
    
    this._init();
    
    _oParent = this;
    return this;
}



