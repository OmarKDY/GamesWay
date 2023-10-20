function CGoalArea(iStage, oParentContainer){
    
    var _iStage;
    var _iCurAnim;
    
    var _aAnimSprite;
    
    var _oParent;
    var _oGoalArea;
    var _oTotalArea;
    
    var _oRedSprite;
    var _oYellowSprite;
    var _oGreenSprite;
    
    var _oRedSpriteLit;
    var _oYellowSpriteLit;
    var _oGreenSpriteLit;
    
    var _oPost;
    var _oStakeContainer;
    
    this._init = function(iStage, oParentContainer){
        
        _iStage = iStage;
        _iCurAnim = 0;
        
        _oGoalArea = new createjs.Container();
        oParentContainer.addChild(_oGoalArea);
        
        _oStakeContainer = new createjs.Container();
        oParentContainer.addChild(_oStakeContainer);
        
        
        this.setGoalArea(_iStage);
        this.setAreaSprite(_iStage);
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oGoalArea);
        oParentContainer.removeChild(_oStakeContainer);
    };
    
    this.setGoalArea = function(iNewStage){
        _iStage = iNewStage;
        
        _oGoalArea.removeAllChildren();
        _oStakeContainer.removeAllChildren();
        oParentContainer.removeChild(_oPost);
        
        _oGoalArea.x = GOAL_AREA[_iStage].x;
        _oGoalArea.y = GOAL_AREA[_iStage].y;
        
        _oTotalArea = new createjs.Shape();
        _oTotalArea.graphics.beginFill("rgba(0,255,255,0.5)").drawRect(-GOAL_AREA[_iStage].width/2,-GOAL_AREA[_iStage].height/2, GOAL_AREA[_iStage].width, GOAL_AREA[_iStage].height);

    };
    
    this.setAreaSprite = function(){
        
        var szTag = _iStage+1;
        var oSprite = s_oSpriteLibrary.getSprite('green_area_'+szTag);
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2 + TARGET_AREA_SPRITE_OFFSET[_iStage].green.x, regY: oSprite.height/2 + TARGET_AREA_SPRITE_OFFSET[_iStage].green.y}, 
                        animations: {off:[0],on:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oGreenSprite = new createjs.Sprite(oSpriteSheet);
        _oGoalArea.addChild(_oGreenSprite);
        _oGreenSpriteLit = new createjs.Sprite(oSpriteSheet);
        _oGreenSpriteLit.gotoAndStop("on");
        _oGreenSpriteLit.alpha = 0;
        _oGoalArea.addChild(_oGreenSpriteLit);
        

        var oSprite = s_oSpriteLibrary.getSprite('yellow_area_'+szTag);
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2 + TARGET_AREA_SPRITE_OFFSET[_iStage].yellow.x, regY: oSprite.height/2+  TARGET_AREA_SPRITE_OFFSET[_iStage].yellow.y}, 
                        animations: {off:[0],on:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oYellowSprite = new createjs.Sprite(oSpriteSheet);
        _oGoalArea.addChild(_oYellowSprite);
        _oYellowSpriteLit = new createjs.Sprite(oSpriteSheet);
        _oYellowSpriteLit.gotoAndStop("on");
        _oYellowSpriteLit.alpha = 0;
        _oGoalArea.addChild(_oYellowSpriteLit);
        
        
        var oSprite = s_oSpriteLibrary.getSprite('red_area_'+szTag);
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {off:[0],on:[1]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oRedSprite = new createjs.Sprite(oSpriteSheet);
        _oGoalArea.addChild(_oRedSprite);
        _oRedSpriteLit = new createjs.Sprite(oSpriteSheet);
        _oRedSpriteLit.gotoAndStop("on");
        _oRedSpriteLit.alpha = 0;
        _oGoalArea.addChild(_oRedSpriteLit);
        
        this._stakeArea();
        
        this.animateArea();

    };
    
    this._stakeArea = function(){
        var iWidth = 50;

        var oStake = new createjs.Shape();
        oStake.graphics.setStrokeStyle(iWidth);        
        oStake.graphics.beginStroke("rgba(255,255,255,0.01)"); 
        
        oStake.graphics.moveTo(STAKE_POS[_iStage][0].x, STAKE_POS[_iStage][0].y);
        for(var i=1; i<STAKE_POS[_iStage].length; i++){
            oStake.graphics.lineTo(STAKE_POS[_iStage][i].x, STAKE_POS[_iStage][i].y);
        }
        _oStakeContainer.addChild(oStake);

        var szTag = _iStage +1;
        var oSprite = s_oSpriteLibrary.getSprite('post_'+szTag);
        _oPost = createBitmap(oSprite);
        _oPost.regX = oSprite.width/2;
        _oPost.regY = oSprite.height/2;
        _oPost.x = POST_POS[_iStage].x - GOAL_AREA[_iStage].x;
        _oPost.y = POST_POS[_iStage].y - GOAL_AREA[_iStage].y;
        _oGoalArea.addChild(_oPost);
    };
    
    this.getAreaHit = function(iXRelative, iYRelative){

        var iX = GOAL_AREA[_iStage].x + iXRelative*GOAL_AREA[_iStage].width/2;
        var iY = GOAL_AREA[_iStage].y + iYRelative*GOAL_AREA[_iStage].height/2;
        
        var bStakeHit = _oStakeContainer.hitTest(iX, iY);
        if(bStakeHit){
            return {x: iX, y: iY, areahit: NULL_TARGET_POLE, stakehit: true};
        }


        var iXHitTest = iXRelative*GOAL_AREA[_iStage].width/2;
        var iYHitTest = iYRelative*GOAL_AREA[_iStage].height/2;
        
        var iAreaHit;
        if(_oGreenSprite.hitTest(iXHitTest,iYHitTest)){
            iAreaHit = GREEN_TARGET;
        } else if(_oYellowSprite.hitTest(iXHitTest,iYHitTest)){
            iAreaHit = YELLOW_TARGET;
        } else if(_oRedSprite.hitTest(iXHitTest,iYHitTest)){
            iAreaHit = RED_TARGET;
        } else {
            if(iXRelative<0){
                iAreaHit = NULL_TARGET_LEFT;
            } else {
                iAreaHit = NULL_TARGET_RIGHT;
            }
        }

        return {x: iX, y: iY, areahit: iAreaHit, stakehit: false};
    };
 
 
    this.showArea = function(iArea){
        switch(iArea){
            case GREEN_TARGET:{
                    new createjs.Tween.get(_oGreenSpriteLit).to({alpha:0.8}, 100).to({alpha:0}, 100).to({alpha:1}, 50);
                    break;
            }
            case YELLOW_TARGET:{
                    new createjs.Tween.get(_oYellowSpriteLit).to({alpha:0.8}, 100).to({alpha:0}, 100).to({alpha:1}, 50);
                    break;
            }
            case RED_TARGET:{
                    new createjs.Tween.get(_oRedSpriteLit).to({alpha:0.8}, 100).to({alpha:0}, 100).to({alpha:1}, 50);
                    break;
            }
        }
    };
    
    this.getGlobalPos = function(){
        return oParentContainer.localToGlobal(_oGoalArea.x, _oGoalArea.y);
    };
    
    this.animateArea = function(){
        _aAnimSprite = new Array();
        
        _aAnimSprite[0] = _oRedSpriteLit;
        _aAnimSprite[1] = _oYellowSpriteLit;
        _aAnimSprite[2] = _oGreenSpriteLit;
       
        this._anim3(1500);
    };
    
    this._anim = function(iTimeStep){ 
        new createjs.Tween.get(_oRedSpriteLit).to({alpha:1}, iTimeStep).call(function(){
            new createjs.Tween.get(_oYellowSpriteLit).to({alpha:1}, iTimeStep);
            new createjs.Tween.get(_oRedSpriteLit).to({alpha:0}, iTimeStep).call(function(){
                new createjs.Tween.get(_oGreenSpriteLit).to({alpha:1}, iTimeStep);
                new createjs.Tween.get(_oYellowSpriteLit).to({alpha:0}, iTimeStep).call(function(){
                    new createjs.Tween.get(_oGreenSpriteLit).to({alpha:0}, iTimeStep);
                    _oParent._anim(iTimeStep);
                });
            });
        });
    };
    
    this._anim2 = function(iTimeStep){
        new createjs.Tween.get(_oRedSpriteLit).to({alpha:1}, iTimeStep).to({alpha:0}, iTimeStep);
        new createjs.Tween.get(_oYellowSpriteLit).wait(iTimeStep/2).to({alpha:1}, iTimeStep).to({alpha:0}, iTimeStep);
        new createjs.Tween.get(_oGreenSpriteLit).wait(iTimeStep).to({alpha:1}, iTimeStep).to({alpha:0}, iTimeStep).call(function(){
            _oParent._anim2(iTimeStep);
        });
    };
    
    this._anim3 = function(iTimeStep){
        new createjs.Tween.get(_oRedSpriteLit).to({alpha:1}, iTimeStep, createjs.Ease.cubicOut).to({alpha:0}, iTimeStep, createjs.Ease.cubicIn);
        new createjs.Tween.get(_oYellowSpriteLit).wait(iTimeStep/2).to({alpha:1}, iTimeStep, createjs.Ease.cubicOut).to({alpha:0}, iTimeStep, createjs.Ease.cubicIn);
        new createjs.Tween.get(_oGreenSpriteLit).wait(iTimeStep).to({alpha:1}, iTimeStep, createjs.Ease.cubicOut).to({alpha:0}, iTimeStep, createjs.Ease.cubicIn).call(function(){
            _oParent._anim2(iTimeStep);
        });
    };
    
    this.stopAnim = function(){
        var iTime = 800;
        new createjs.Tween.get(_oRedSpriteLit, {override: true}).to({alpha:0}, iTime);
        new createjs.Tween.get(_oYellowSpriteLit, {override: true}).to({alpha:0}, iTime);
        new createjs.Tween.get(_oGreenSpriteLit, {override: true}).to({alpha:0}, iTime);
    };  
    
    this.getContainer = function(){
        return _oGoalArea;
    };
    
    _oParent = this;
    this._init(iStage, oParentContainer);
    
}


