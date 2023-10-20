function CHelpPanel(){
    var _iTimeElaps;
    var _aKeys;
    var _oListener;
    
    var _oFade;
    var _oKey0;
    var _oKey1;
    var _oSprite;
    var _oButStart;
    var _oContainer;
    
    var _oThis = this;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oStage.addChild(_oContainer);
        
        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.7)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        _oListener = _oFade.on("click",function(){});
        _oContainer.addChild(_oFade);
        
        var oSprite = s_oSpriteLibrary.getSprite("msg_box_wide");
        var oBg = createBitmap(oSprite);
        oBg.regX = oSprite.width/2;
        oBg.regY = oSprite.height/2;
        oBg.x = CANVAS_WIDTH/2;
        oBg.y = CANVAS_HEIGHT/2; 
        _oContainer.addChild(oBg);
        

        var aSprites = new Array();
        for(var i=0;i<45;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("tutorial_"+i))
        }
        
        var iWidth = aSprites[0].width;
        var iHeight = aSprites[0].height;
        
        var oData = {
            images: aSprites,
            framerate:15,
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight, regX: iWidth / 2},
            animations: {start: 0, anim: [0,aSprites.length-1]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSprite = createSprite(oSpriteSheet,"start",iWidth / 2,0,iWidth,iHeight);
        _oSprite.x = CANVAS_WIDTH/2;
        _oSprite.y = 130;
        _oContainer.addChild(_oSprite);
        
        

        _aKeys = new Array();

        var oSpriteKey0;
        var oSpriteKey1;

        if(s_bMobile){
            oSpriteKey0 = s_oSpriteLibrary.getSprite("but_left");
            oSpriteKey1 = s_oSpriteLibrary.getSprite("but_right");
        }else{
            oSpriteKey0 = s_oSpriteLibrary.getSprite("key_0");
            oSpriteKey1 = s_oSpriteLibrary.getSprite("key_1");
        }

        _oKey0 = createBitmap(oSpriteKey0);
        _oKey0.regX = oSpriteKey0.width/2;
        _oKey0.regY = oSpriteKey0.height/2;
        _oKey0.x = CANVAS_WIDTH/2 - 240;
        _oKey0.y = CANVAS_HEIGHT/2 + 40;
        _oContainer.addChild(_oKey0);

        _aKeys.push(_oKey0);

        _oKey1 = createBitmap(oSpriteKey1);
        _oKey1.regX = oSpriteKey1.width/2;
        _oKey1.regY = oSpriteKey1.height/2;
        _oKey1.x = CANVAS_WIDTH/2 + 240;
        _oKey1.y = CANVAS_HEIGHT/2 + 40;
        _oContainer.addChild(_oKey1);
        _aKeys.push(_oKey1);
        
        
        
        _oButStart = new CGfxButton(CANVAS_WIDTH/2,CANVAS_HEIGHT/2+180,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButStart.addEventListener(ON_MOUSE_UP,this._onStart,this);
    };
    
    this.unload = function(){
        _oFade.off("click",_oListener);
    };
    
    this.show = function(){
        _iTimeElaps = 0;
        
        _oKey1.scaleX = _oKey1.scaleY = 0.9;
        
        _oSprite.gotoAndPlay("anim");
        
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer).to({alpha:1},500);
    };
    
    this.hide = function(){
        createjs.Tween.get(_oContainer).to({alpha:0} , 500,createjs.Ease.cubicOut).call(function(){
                                                                                    _oContainer.visible = false;
                                                                                });
    };
    
    this._attachPlayer = function(iX,iY,aSprites,szAnim){
        var aSprites = new Array();
        for(var i=0;i<18;i++){
            aSprites.push(s_oSpriteLibrary.getSprite("player_running_"+i))
        }
        
        var iWidth = aSprites[0].width;
        var iHeight = aSprites[0].height;
        
        var oData = {
            images: aSprites,
            // width, height & registration point of each sprite
            frames: {width: iWidth, height: iHeight, regX: iWidth / 2, regY: iHeight},
            animations: {start: 0, anim: [0,aSprites.length-1,szAnim]}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        var oSprite = createSprite(oSpriteSheet,"start",iWidth / 2,iHeight,iWidth,iHeight);
        oSprite.scaleX = oSprite.scaleY = 0.7;
        oSprite.x = iX;
        oSprite.y = iY;
        _oContainer.addChild(oSprite);
        
        return oSprite;
    };

    
    this._toggleKeyAnims = function(){
        if(_oKey1.scaleX === 0.9){
            _oKey1.scaleX = _oKey1.scaleY = 1;
            _oKey0.scaleX = _oKey0.scaleY = 0.9;
        }else{
            _oKey0.scaleX = _oKey0.scaleY = 1;
            _oKey1.scaleX = _oKey1.scaleY = 0.9;
        }
    };

    
    this._onStart = function(){
        _oButStart.disable();
        
        _oThis.hide();
        s_oGame.onExitFromHelp();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this.update = function(){
        _iTimeElaps += s_iTimeElaps;
        if(_iTimeElaps > 1500){
            _iTimeElaps = 0;
            this._toggleKeyAnims();
        }
            
    };
    
    this._init();
}