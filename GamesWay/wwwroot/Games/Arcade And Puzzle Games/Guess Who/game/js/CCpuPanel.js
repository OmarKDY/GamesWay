function CCpuPanel(){
    var _oTitleText;
    var _oMsgText;
    var _oButYes;
    var _oButNo;
    var _oWrongAnswer;
    var _oContainer;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        _oContainer.alpha = 0;
        s_oStage.addChild(_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oContainer.addChild(oBg);
        
        _oWrongAnswer = createBitmap(s_oSpriteLibrary.getSprite('wrong_answer'));
        _oWrongAnswer.x = 438;
        _oWrongAnswer.y = 410;
        _oWrongAnswer.alpha = 0;
        _oContainer.addChild(_oWrongAnswer);

       
        var iWidth = 500;
        var iHeight = 70;
        _oTitleText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2 -iWidth/2, 280 - iHeight/2, iWidth, iHeight, 
                    60, "center", "#FF6699", FONT_GAME, 1,
                    2, 2,
                    TEXT_CPU_PANEL_TITLE,
                    true, true, true,
                    false );

        var iWidth = 500;
        var iHeight = 140;
        _oMsgText = new CTLText(_oContainer, 
                    CANVAS_WIDTH/2-iWidth/2, 390 - iHeight/2, iWidth, iHeight, 
                    50, "center", "#fff", FONT_GAME, 1,
                    2, 2,
                    "",
                    true, true, true,
                    false );
        
       
        _oButYes = new CGfxSpriteButton(CANVAS_WIDTH/2 + 210,CANVAS_HEIGHT/2 + 124,s_oSpriteLibrary.getSprite('but_ok'),false);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onYesRelease, this);
        _oContainer.addChild(_oButYes.getSprite());
        
        _oButNo = new CGfxSpriteButton(CANVAS_WIDTH/2 + 130,CANVAS_HEIGHT/2 + 124,s_oSpriteLibrary.getSprite('but_no'),false);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onNoRelease, this);
        _oContainer.addChild(_oButNo.getSprite());
    };
    
    this.show = function(szText){
        var iHalfStringLen = Math.floor(szText.length/2);
        
        var iNextChar = iHalfStringLen;
        if(szText.charAt(iNextChar) !== " "){
            var iNextChar = iHalfStringLen + 1;
            while(szText.charAt(iNextChar) !== " "){
                iNextChar++;
            }
        }
        
        szText = szText.substring(0, iNextChar) + "\n" + szText.substr(iNextChar);
        
        _oMsgText.refreshText( szText );
        _oContainer.visible = true;

        createjs.Tween.get(_oContainer).to({alpha:1}, 400);  
    };
    
    this.hide = function(){
        _oContainer.visible = false;
        _oContainer.alpha = 0;
    };
    
    this.showWrongReply = function(){
        playSound("alert",1,false);
        
        var oParent = this;
        createjs.Tween.get(_oWrongAnswer).to({alpha:1}, 200).call(function(){ setTimeout(function(){oParent.hideWrongReply();},1000 ) }); 
    };
    
    this.hideWrongReply = function(){
        createjs.Tween.get(_oWrongAnswer).to({alpha:0}, 200);
    };
    
    this._onYesRelease = function(){
        s_oGame.checkIfPlayerReplyIsCorrect(true);
    };
    
    this._onNoRelease = function(){
        s_oGame.checkIfPlayerReplyIsCorrect(false);
    };
    
    this._init();
}