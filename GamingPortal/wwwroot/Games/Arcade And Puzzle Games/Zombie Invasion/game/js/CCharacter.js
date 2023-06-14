function CCharacter(iType, iStartY, iEndY, iDepth, oParentContainer){
    var _iContDelay;
    var _szState;
    var _oContainerRun;
    var _oContainerDeath;
    var _oContainerHealth;
    var _oParent;
    var _oCorrection;
    var _oBarBg;
    var _oBarFill;
    var _oBarPos;
    var _oMask;
    var _oBlood;
    
    var _bUpdate;
    var _bIsRun=true;
    var _bGone=false;
    
    var temp;
    
    var _iDeathFrames;
    var _iRunFrames;
    var _iFrame=1;
    var _iLife;
    var _iScale;
    var _iBloodDepth;
    var _iRunWidth;
    var _iRunHeight;

    var _aDeath;
    var _aRun;
    
    var _oParentContainer;
    
    this._init = function(iType, iStartY, iEndY, iDepth, oParentContainer){   
        
        _oParentContainer = oParentContainer;
        
        _iDeathFrames=DEATH_FRAMES[iType];
        _iRunFrames=RUN_FRAMES[iType];
        
        _bUpdate=true;
    
        _szState="run";
    
        temp=1;
        _iContDelay = 0;
    
        _aDeath = new Array();
        _aRun = new Array();
        
        _oContainerRun = new createjs.Container();
        _oContainerDeath = new createjs.Container();
        _oContainerHealth = new createjs.Container();
        
        if(iType===4){
            var tag = "survivor_death";
        }else {
            var tag = "zombie"+iType+"_death";
        }
        
        for (var i=0; i<=_iDeathFrames; i++){
            _aDeath[i] = createBitmap(s_oSpriteLibrary.getSprite(tag+i));
            _aDeath[i].visible=false;
            _oContainerDeath.addChild(_aDeath[i]);
        }
        
        if(iType===4){
            var tag = "survivor_run";
        }else {
            var tag = "zombie"+iType+"_run";
        }
        for (var i=0; i<=_iRunFrames; i++){
            _aRun[i] = createBitmap(s_oSpriteLibrary.getSprite(tag+i));
            _aRun[i].visible=false;      
            
            _oContainerRun.addChild(_aRun[i]);
        }
        

        if(iType===4){
            tag = "survivor_run"+iType;
        }else {
            tag = "zombie"+iType+"_run"+iType;
        }

        var oImgRun = s_oSpriteLibrary.getSprite(tag);
        _oContainerRun.regX=(oImgRun.width)/2;
        _oContainerRun.regY=oImgRun.height;
        
        _iRunWidth = oImgRun.width;
        _iRunHeight = oImgRun.height;
        
        if(iType===4){
            tag = "survivor_death"+iType;
        }else {
            tag = "zombie"+iType+"_death"+iType;
        }       

        var img = s_oSpriteLibrary.getSprite(tag);
        _oContainerDeath.regX=(img.width)/2;
        _oContainerDeath.regY=img.height;
        _oContainerDeath.visible=false;
  
        oParentContainer.addChild(_oContainerRun);
        oParentContainer.addChild(_oContainerDeath);
        
        _oContainerRun.x = CANVAS_WIDTH + _oContainerRun.regX +iDepth;
        _oContainerRun.y = iStartY;        
        
        
        _oCorrection = CORRECTION[iType];
        _oBarPos = BAR_POS[iType];
        _iLife = LIFE[iType];
       
        var oBg = s_oSpriteLibrary.getSprite('enemy_bar_bg');
        _oBarBg = createBitmap(oBg);
        _oBarBg.x =  _oBarPos.x;
        _oBarBg.y =  _oBarPos.y;
        _oContainerHealth.addChild(_oBarBg);
       
        var oSprite = s_oSpriteLibrary.getSprite('enemy_bar_fill');
        _oBarFill = createBitmap(oSprite);
        _oBarFill.x = _oBarPos.x + 4;
        _oBarFill.y = _oBarPos.y + 4;
        _oContainerHealth.addChild(_oBarFill);       
           
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, oSprite.width,oSprite.height);
        _oMask.regX= oSprite.width;
        _oMask.regY= oSprite.height;
                
        _oMask.x = _oBarPos.x + oSprite.width + 4;
        _oMask.y = _oBarPos.y + oSprite.height + 4;
        _oContainerHealth.addChild(_oMask);

        _oBarFill.mask = _oMask;
        _oContainerHealth.alpha=0;
        _oContainerRun.addChild(_oContainerHealth);
        
        var oBlood = s_oSpriteLibrary.getSprite('blood_floor');
        _oBlood = createBitmap(oBlood);
        _oBlood.regX= oBlood.width/2;
        _oBlood.regY= oBlood.height/2;
        _oBlood.alpha=0;

        _iBloodDepth = s_oGame.getBgDepth() +1;
        

    };
    
    
    this.unload = function(){
        _oParentContainer.removeChild(_oContainerRun);
        _oParentContainer.removeChild(_oContainerDeath);
        
    };
    
    this.getRect = function(){
        var iStartX = (_oContainerRun.x - _iRunWidth/2*_oContainerRun.scaleX + _oCorrection.x*_oContainerRun.scaleX)//;
        var iStartY = (_oContainerRun.y - _iRunHeight*_oContainerRun.scaleY + _oCorrection.y*_oContainerRun.scaleY)//*_oContainerRun.scaleY;
        
        var iCorrectionW = _oCorrection.w*_oContainerRun.scaleX;
        var iCorrectionH = _oCorrection.h*_oContainerRun.scaleY;

        return new createjs.Rectangle(iStartX,iStartY, iCorrectionW, iCorrectionH);
    };
    
    
    this.hitZombie = function(){
        if(!s_bPlayActive){
            return;
        }
        _iLife--;
        _oContainerHealth.alpha=1;
        _iScale = (_iLife / LIFE[iType]) +0.001; 

        playSound("tap_zombie",1,false);

        createjs.Tween.get(_oMask).to({scaleY:_iScale}, 150, createjs.Ease.linear);
        createjs.Tween.get(_oContainerHealth, {override:true}).to({alpha:0}, 1000, createjs.Ease.linear);

        if(_iLife===0){
            _oParent.kill();
        }
        
    };
    
    this.scaleMe = function(iValue){
        _oContainerRun.scaleX=iValue;
        _oContainerRun.scaleY=iValue;
    };
    
    this._getScale = function(){
        return _oContainerRun.scaleX; //Y and X are symmetrical
    };
    
    this._animRun = function(){
            
            if(_iFrame===0){
                
                _aRun[_iRunFrames].visible=false;
                _aRun[0].visible=true;                
            } else {
                _aRun[_iFrame-1].visible=false;
                _aRun[_iFrame].visible=true;
                
            }       
            
            _iFrame++;
            if(_iFrame>_iRunFrames){
                _iFrame=0;
            }
    };
    
    this._bloodOnFloor = function (){
               _oBlood.x=_oContainerDeath.x- OFFSET_BLOOD[iType].x;
               _oBlood.y=_oContainerDeath.y- OFFSET_BLOOD[iType].y;
               _oBlood.scaleX=_oContainerDeath.scaleX;
               _oBlood.scaleY=_oContainerDeath.scaleY;
               _oBlood.rotation=Math.floor(Math.random()*360);
               
               s_oStage.addChild(_oBlood);
               s_oStage.setChildIndex(_oBlood,_iBloodDepth); //15 is the index of BackGround on stage
               createjs.Tween.get(_oBlood).to({alpha:1}, 200, createjs.Ease.linear);
                         
    };
    
    this._animDeath = function(){
            
            if(_iFrame===0){
                _aRun[0].visible=true;
                this._bloodOnFloor();
  
            } else {
                _aDeath[_iFrame-1].visible=false;
                _aDeath[_iFrame].visible=true;
                
            }       
            
            _iFrame++;
            if(_iFrame>_iDeathFrames){
                _bUpdate=false;

               createjs.Tween.get(_aDeath[_iFrame-1]).to({alpha:0}, 2500, createjs.Ease.linear).call(function(){_oParent._isDead()}); 
               createjs.Tween.get(_oBlood).to({alpha:0}, 15000, createjs.Ease.linear);
            }
                
    };
    
    this.kill = function(){
        if(_szState==="run"){
            if(iType===4){
                playSound("survivor_scream",1,false);
            }
            _szState="death";
            s_oGame.updateScore(iType);
            createjs.Tween.removeTweens(_oContainerRun);
            _oContainerDeath.x=_oContainerRun.x-OFFSET_ANIMATION[iType];
            _oContainerDeath.y=_oContainerRun.y;
            _oContainerDeath.scaleX=this._getScale();
            _oContainerDeath.scaleY=this._getScale();
            
            _iFrame=0;
            
            _oContainerDeath.addChild(_oContainerHealth);
            if(iType===1){
                _oContainerHealth.regX = _oBarPos.x; //Set offset only for zombie1, cause it have a negative offset of animation death
            }             
            _oContainerHealth.x = _oBarPos.x;
            createjs.Tween.get(_oContainerHealth).to({alpha:0}, 500, createjs.Ease.linear);
            
            _oContainerRun.visible=false;
            _oParentContainer.removeChild(_oContainerRun);
            _oContainerDeath.visible=true;
            _aDeath[0].visible=true;         
        }
    };
    
    this._isDead = function(){
        _bGone=true;
        this.unload();   
        
    };
    
    this._isGone = function(){
        _bGone=true;
        this.unload();
        s_oGame.subtractLife(iType);
        
    };
    
    this.checkGone = function(){
        return _bGone;
    };
    
    this._move = function(){
        createjs.Tween.get(_oContainerRun).to({x:-_oContainerRun.regX, y:iEndY}, SPEED[iType], createjs.Ease.linear).call(function(){_oParent._isGone()});
    };
    
    this.getPos = function(){
        return {x:_oContainerRun.x, y: _oContainerRun.y};
    };
    
    this.getContainerRun = function (){
        return _oContainerRun;
    };
    
    this.getContainerDeath = function (){
        return _oContainerDeath;
    };
    
    this.getState = function(){
        return _szState;
    };
    
    this.update = function(){
        if(_bUpdate){            
            
            switch(_szState){
                case "run":{
                        if(_iContDelay === ANIM_DELAY[iType]){
                            _iContDelay = 0;
                            this._animRun();
                        }else{
                            _iContDelay++;
                        }
                        

                }break;
                case "death":{
                        this._animDeath();
                }break;            
            }
        }
        
        if(_bIsRun){
            this._move();
            _bIsRun=false;
        }
    };
    
    
    _oParent=this;
    this._init(iType, iStartY, iEndY, iDepth, oParentContainer);
    
    
}