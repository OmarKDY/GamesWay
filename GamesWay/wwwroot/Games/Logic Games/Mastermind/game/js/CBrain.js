function CBrain (){
    
    var _oBrainAnimation;
    var _oCloud;
    var _oText;
    var _oCloudContainer;
    var _aTextWin;
    var _aTextLose;
    var _mousedown;
    
    this.init = function(){
        _oCloudContainer = new createjs.Container();
        _oCloudContainer.x = CANVAS_WIDTH/2;
        _oCloudContainer.y = CANVAS_HEIGHT/2;
         var oData = {
            images: [s_oSpriteLibrary.getSprite("brainIdle"), s_oSpriteLibrary.getSprite("brainLose"), s_oSpriteLibrary.getSprite("brainWin")],
            frames: {width: 112, height: 90, regX: 56, regY: 45},
            animations: {idle: [0,44],
                                lose: [45,89,"idle"],
                                win: [90,134]}
                        };
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBrainAnimation = createSprite(oSpriteSheet,"idle",56,45,112,90);
        _oBrainAnimation.x = CANVAS_WIDTH/2-260;
        _oBrainAnimation.y = CANVAS_HEIGHT/2+300;
        s_oStage.addChild(_oBrainAnimation);
        
        var oSprite = s_oSpriteLibrary.getSprite("cloud");
        _oCloud = createBitmap(oSprite);
        _oCloud.regX = 228;
        _oCloud.regY = 61;
        _oCloudContainer.addChild(_oCloud);
        _mousedown = _oCloud.on("mousedown",this.unloadCloud,this);
         s_oStage.addChild(_oCloudContainer);
         
         _oCloudContainer.alpha = 0;
         
        _oCloudContainer.y += 270;
        _oCloudContainer.x += 70;
        
        _aTextWin = new Array();
        _aTextWin[0] = TEXT_WIN_1;
        _aTextWin[1] = TEXT_WIN_2;
        _aTextWin[2] = TEXT_WIN_3;
        
        _aTextLose = new Array();
        _aTextLose[0] = TEXT_LOSE_1;
        _aTextLose[1] = TEXT_LOSE_2;
        _aTextLose[2] = TEXT_LOSE_3;
        _aTextLose[3] = TEXT_LOSE_4;
        _aTextLose[4] = TEXT_LOSE_5;
        
        
    };
    
   this.initText = function(){
       
   };
    
    this.showAngryBrain = function(){
       _oBrainAnimation.gotoAndPlay("lose");
       new createjs.Tween.get(_oBrainAnimation).to({scaleX: 1.2, scaleY: 1.2},300,createjs.Ease.cubicOut).wait(300).to({scaleX: 1, scaleY: 1},300, createjs.Ease.cubicIn);
       new createjs.Tween.get(_oCloud).to({alpha: 1},300,createjs.Ease.cubicOut).wait(1500).to({alpha: 1},300, createjs.Ease.cubicIn);
    };
    
    this.showHappyBrain = function(){
       _oBrainAnimation.gotoAndPlay("win");
       new createjs.Tween.get(_oBrainAnimation).to({scaleX: 1.2, scaleY: 1.2},300,createjs.Ease.cubicOut).wait(300).to({scaleX: 1, scaleY: 1},300, createjs.Ease.cubicIn); 
       new createjs.Tween.get(_oCloud).to({alpha: 1},300,createjs.Ease.cubicOut).wait(1500).to({alpha: 0},300, createjs.Ease.cubicIn);
    };
    
    this.assembleTextMiss = function(iBlackBalls,iGrayBalls){
        var szText;
        if (iBlackBalls>0||iGrayBalls>0){
            if (iBlackBalls>0){
                szText = TEXT_MISS_0+iBlackBalls+TEXT_MISS_1+TEXT_MISS_AND+iGrayBalls+TEXT_MISS_2;
            }else{
                szText = TEXT_MISS_0+iGrayBalls+TEXT_MISS_2;
            }
        }else{
            szText = _aTextLose[Math.floor(Math.random()*_aTextLose.length)];
        }
        _oText = new CTLText(_oCloudContainer, 
                    -180, -50, 360, 105, 
                    22, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );
                    

        new createjs.Tween.get(_oCloudContainer).to({alpha: 1},300);
    };
    
    this.showTextWin = function(){
        var szText = _aTextWin[Math.floor(Math.random()*_aTextWin.length)];
        _oText = new CTLText(_oCloudContainer, 
                    -180, -50, 360, 105, 
                    25, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );

        
        new createjs.Tween.get(_oCloudContainer).to({alpha: 1},300).wait(1500).call(function () 
        {
            new createjs.Tween.get(_oCloudContainer).to({alpha: 0}, 300);
        });
    };
    
    this.showTextLose = function(){
        var szText = _aTextLose[Math.floor(Math.random()*_aTextLose.length)];
        _oText =  new CTLText(_oCloudContainer, 
                    -180, -50, 360, 105, 
                    25, "center", "#000", PRIMARY_FONT, 1,
                    0, 0,
                    szText,
                    true, true, true,
                    false );
                    
      
        new createjs.Tween.get(_oCloudContainer).to({alpha: 1},300).wait(1500).call(function () 
        {
            new createjs.Tween.get(_oCloudContainer).to({alpha: 0}, 300);
        });
    };
    
   this.unloadCloud = function(){
      new createjs.Tween.get(_oCloudContainer).to({alpha: 0}, 300).call(function(){
                                                                        if(_oText !== undefined){
                                                                            _oText.refreshText(" ");
                                                                        }
                                                                    }); 
   };
    
    this.unload = function(){
       s_oStage.removeChild(_oCloudContainer); 
    };
    
    this.init();
}