function CField(iX,iY,oParentContainer){
    var _bReadyForArrival;
    var _bCallbackArrival;
    var _bStartSponsors;
    var _iTimeElaps;
    var _iCurSponsorStart;
    var _aLeftSponsors;
    var _aRightSponsors;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oContainer;
    var _oArrival;
    var _oSprite;
    var _oParentContainer;
    var _oThis = this;
    
    this._init = function(iX,iY){
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        _oParentContainer.addChild(_oContainer);
        
        var iHeightSprite;
  
        var aSprites = new Array();
        for(var i=0;i<87;i++){
            var oSpriteField = s_oSpriteLibrary.getSprite('field_loop_'+i);
            aSprites.push(oSpriteField);
            
            iHeightSprite = oSpriteField.height;
        }
        
        var oData = {
            images: aSprites,
            framerate:20,
            // width, height & registration point of each sprite
            frames: {width: 1600, height: 631},
            animations: {start: 0, anim: [0,29,"anim"],arrival:[30,86,"end"],end:86}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oSprite = createSprite(oSpriteSheet,"start",0,0,1600,631);
        _oSprite.on("animationend",this._onAnimEnd,this);
        _oSprite.on("change",this._onAnimChange,this);
        _oContainer.addChild(_oSprite);

        
        var aSpriteArrival = new Array();
        for(var k=0;k<42;k++){
            var oSpriteField = s_oSpriteLibrary.getSprite('arrive_'+k);
            
            aSpriteArrival.push(oSpriteField);
        }


        _aLeftSponsors = new Array();
        _aRightSponsors = new Array();
        for(var k=0;k<2;k++){
            var oSponsorLeft = new CSponsor(510,256,true,_oContainer);
            _aLeftSponsors.push(oSponsorLeft);
            
            var oSponsorRight = new CSponsor(1070,256,false,_oContainer);
            _aRightSponsors.push(oSponsorRight);
        }
        
        
        
        var oData = {
            images: aSpriteArrival,
            framerate:15,
            // width, height & registration point of each sprite
            frames: {width: 1600, height: 539},
            animations: {start: 0, anim: [0,41,"end"],end:42}
        };

        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oArrival = createSprite(oSpriteSheet,"start",0,0,1600,539);
        _oArrival.visible = false;
        _oArrival.y = -iY-18;
        _oContainer.addChild(_oArrival);
    };
    
    this.reset = function(){
        _bCallbackArrival = false;
        for(var i=0;i<_aLeftSponsors.length;i++){
            _aLeftSponsors[i].reset();
            _aRightSponsors[i].reset();
        }
        
        _oArrival.visible = false;
        
        _bStartSponsors = false;
        _iTimeElaps = 0;
        _iCurSponsorStart = 0;
    };
    
    this.show = function(){
        _bReadyForArrival = false;
        _oSprite.gotoAndPlay("anim");
        
        
        
        _bStartSponsors = true;
    };
    
    this.hide = function(){
        _oSprite.gotoAndStop("start");
        _oContainer.visible = false;
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.readyForArrival = function(){
        _bReadyForArrival = true;
    };
    
    this._playArrival = function(){
        _oSprite.framerate = 15;
        _oSprite.gotoAndPlay("arrival");
        
    };
    
    this.stopAnim = function(){
        _oSprite.stop();
        this.stopSponsors();
    };
    
    this.prepareSponsorsForStop = function(){
        for(var j=0;j<_aLeftSponsors.length;j++){
            _aLeftSponsors[j].readyForRemoval();
            _aRightSponsors[j].readyForRemoval();
        }
    };
    
    this.stopSponsors = function(){
        for(var j=0;j<_aLeftSponsors.length;j++){
            _aLeftSponsors[j].stopTween();
            _aRightSponsors[j].stopTween();
        }
    };
    
    this._onAnimEnd = function(evt){
        if(evt.currentTarget.currentAnimation === "anim" && _bReadyForArrival){
            _bReadyForArrival = false;
            _oThis._playArrival();
        }
    };
    
    this._onAnimChange = function(evt){
        if(evt.currentTarget.currentAnimation === "arrival"){
            if(evt.currentTarget.currentFrame >= 75 && !_bCallbackArrival){
                _bCallbackArrival = true;
                if(_aCbCompleted[ON_READY_FOR_PLAYER_ARRIVAL]){
                    _aCbCompleted[ON_READY_FOR_PLAYER_ARRIVAL].call(_aCbOwner[ON_READY_FOR_PLAYER_ARRIVAL]);
                }
            }else if(evt.currentTarget.currentFrame >= 31 && _oArrival.visible === false){
                _oArrival.gotoAndPlay("anim");
                _oArrival.visible = true;
            }
        }
    };
    
    this.update = function(){
        if(_bStartSponsors){
            _iTimeElaps += s_iTimeElaps;
            if(_iTimeElaps >2000){
                _iTimeElaps = 0;
                _aLeftSponsors[_iCurSponsorStart].startAnim();
                _aRightSponsors[_iCurSponsorStart].startAnim();
                _iCurSponsorStart++;
                if(_iCurSponsorStart === _aLeftSponsors.length){
                    _bStartSponsors = false;
                }
            }
        }
        
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}