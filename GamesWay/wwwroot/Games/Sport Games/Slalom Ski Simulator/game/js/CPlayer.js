function CPlayer(iX,iY,oParentContainer){
    var _bUpdate = false;
    
    var _bLeft = false;
    var _bRight = false;
    var _iCurAnim;
    var _iTotAnimFrame;
    var _iCurFrameIndex;
    var _iStartX;
    var _iStartY;
    var _iCurAcceleration;
    var _iCurMaxSpeed;
    var _iXMove;
    var _iWidthSprite;
    var _iHeightSprite;
    var _aAnim;
    var _aAnimNumFrames;
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oContainer;
    var _oParentContainer;
    
    this._init = function(iX,iY){
        _iStartX = iX;
        _iStartY = iY;
        _iXMove = 0;
        _iCurAcceleration = HERO_ACCELERATION;
        _iCurMaxSpeed = MAX_HERO_SPEED;
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.x = iX;
        _oContainer.y = iY;
        
        _oParentContainer.addChild(_oContainer);
        
        _aAnimNumFrames = new Array();
        _aAnimNumFrames[PLAYER_ANIM_RUN] = 19;
        _aAnimNumFrames[PLAYER_ANIM_FALL] = 30;
        _aAnimNumFrames[PLAYER_ANIM_ARRIVAL] = 70;
        _aAnimNumFrames[PLAYER_ANIM_LEFT] = 8;
        _aAnimNumFrames[PLAYER_ANIM_RIGHT] = 8;
        _aAnimNumFrames[PLAYER_ANIM_LEFT_OUT] = 7;
        _aAnimNumFrames[PLAYER_ANIM_RIGHT_OUT] = 7;
        
        _aAnim = new Array();
        _aAnim[PLAYER_ANIM_RUN] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_RUN];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_running_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_RUN].push(oBmp);
        }
        
        
        _aAnim[PLAYER_ANIM_FALL] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_FALL];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_falling_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_FALL].push(oBmp);
        }
        
        
        _aAnim[PLAYER_ANIM_ARRIVAL] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_ARRIVAL];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_arrival_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_ARRIVAL].push(oBmp);
        }
        
        _aAnim[PLAYER_ANIM_LEFT] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_LEFT];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_left_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_LEFT].push(oBmp);
        }
        
        _aAnim[PLAYER_ANIM_RIGHT] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_RIGHT];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_right_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_RIGHT].push(oBmp);
        }
        
        _aAnim[PLAYER_ANIM_LEFT_OUT] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_LEFT_OUT];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_left_out_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_LEFT_OUT].push(oBmp);
        }
        
        _aAnim[PLAYER_ANIM_RIGHT_OUT] = new Array();
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_RIGHT_OUT];i++){
            var oSprite = s_oSpriteLibrary.getSprite(s_szPlayerType+'_right_out_'+i);
            var oBmp = createBitmap(oSprite);
            oBmp.visible = false;
            oBmp.regX = oSprite.width/2;
            oBmp.regY = oSprite.height;
            _oContainer.addChild(oBmp);
            
            _aAnim[PLAYER_ANIM_RIGHT_OUT].push(oBmp);
        }
        
        _iCurAnim = PLAYER_ANIM_RUN;
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.show = function(){
        _iTotAnimFrame = _aAnimNumFrames[_iCurAnim];

        _aAnim[_iCurAnim][0].visible = true;
        _iCurFrameIndex = 0;
        _oContainer.visible = true;
        
        _iWidthSprite = _oContainer.getBounds().width-450;
        _iHeightSprite = _oContainer.getBounds().height-200;
        /*
        var oShapeRect = new createjs.Shape();
        oShapeRect.graphics.beginFill("blue").drawRect(-_iWidthSprite/2, -_iHeightSprite, _iWidthSprite,_iHeightSprite);
        oShapeRect.alpha = 0.5;
        _oContainer.addChild(oShapeRect);
        */
       
       playSfxSound("skiing",1,true);
        _bUpdate = true;
    };
    
    this.hide = function(){
        _bUpdate = false;
        _oContainer.visible = false;
    };
    
    this.reset = function(){
        _bUpdate = false;

        _bLeft = false;
        _bRight = false;
        _iXMove = 0;
        _iCurAcceleration = HERO_ACCELERATION;
        _iCurMaxSpeed = MAX_HERO_SPEED;
        
        _oContainer.alpha = 1;
        _oContainer.x = _iStartX;
        _oContainer.y = _iStartY;
        
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_RUN];i++){
            _aAnim[PLAYER_ANIM_RUN][i].visible = false;
        }

        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_FALL];i++){
            _aAnim[PLAYER_ANIM_FALL][i].visible = false;
        }
        
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_ARRIVAL];i++){
            _aAnim[PLAYER_ANIM_ARRIVAL][i].visible = false;
        }
        
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_LEFT];i++){
            _aAnim[PLAYER_ANIM_LEFT][i].visible = false;
        }
        
        for(var i=0;i<_aAnimNumFrames[PLAYER_ANIM_RIGHT];i++){
            _aAnim[PLAYER_ANIM_RIGHT][i].visible = false;
        }
        
        _iCurAnim = PLAYER_ANIM_RUN;
    };
    
    this.changeAnim = function(iAnim){
        if(iAnim === _iCurAnim){
            return;
        }
        
        _bUpdate = false;
        _aAnim[_iCurAnim][_iCurFrameIndex].visible = false;
        
        _iCurAnim = iAnim;
        _aAnim[_iCurAnim][0].visible = true;
        _iCurFrameIndex = 0;
        _iTotAnimFrame = _aAnimNumFrames[_iCurAnim];
        _bUpdate = true;
        
        if(iAnim === PLAYER_ANIM_LEFT || iAnim === PLAYER_ANIM_RIGHT){
            playSfxSound("skiing_direction",1,false);
        }else if(iAnim === PLAYER_ANIM_FALL){
            stopSfxSound("skiing");
            playSfxSound("falling",1,false);
        }else if(iAnim === PLAYER_ANIM_ARRIVAL){
            stopSfxSound("skiing");
            playSfxSound("arrival",1,false);
        }
    };
    
    this.playToFrame = function(iFrame){
        _aAnim[_iCurAnim][_iCurFrameIndex].visible = false;
        _iCurFrameIndex = iFrame;
        _aAnim[_iCurAnim][_iCurFrameIndex].visible= true;
    };
    
    this.nextFrame = function(){
        _aAnim[_iCurAnim][_iCurFrameIndex].visible = false;
        _iCurFrameIndex++;

        _aAnim[_iCurAnim][_iCurFrameIndex].visible= true;
    };
    
    this.moveLeft = function(bLeft){
        if(  _oContainer.x === MIN_PLAYER_X ){ 
            _bLeft = false;
            _iXMove = 0;
            return;
        }
        

        if(bLeft){
            this.changeAnim(PLAYER_ANIM_LEFT);
        }else{
            this.changeAnim(PLAYER_ANIM_LEFT_OUT);
        }
        
        _bLeft = bLeft;
        
    };

    this.moveRight = function(bRight){
        if(_oContainer.x  === MAX_PLAYER_X){       
            _bRight = false;
            _iXMove = 0;
            return;
        }
        
        if(bRight){
            this.changeAnim(PLAYER_ANIM_RIGHT);
        }else{
            this.changeAnim(PLAYER_ANIM_RIGHT_OUT);
        }
        
        _bRight = bRight;
        
    };
    
    this.resetMovGates = function(){
        _bLeft = false;
        _bRight = false;
    };
    
    this.setAcceleration = function(iAcceleration,iMax){
        _iCurAcceleration = iAcceleration;
        _iCurMaxSpeed = iMax;
    };
    
    this.stopAnim = function(){
        _bUpdate = false;
    }
    this.setY = function(iY){
        _oContainer.y = iY;
    };
    
    this.getRect = function(){
        var iNewX = -_iWidthSprite/2;
        switch(_iCurAnim){
            case PLAYER_ANIM_LEFT:{
                    iNewX += 14*_iCurFrameIndex;
                    break;
            }
            case PLAYER_ANIM_LEFT_OUT:{
                    iNewX += 14* (6-_iCurFrameIndex);
                    break;
            }
            case PLAYER_ANIM_RIGHT:{
                    iNewX += -14*_iCurFrameIndex;
                    break;
            }
            case PLAYER_ANIM_RIGHT_OUT:{
                    iNewX += -14* (6-_iCurFrameIndex);
                    break;
            }
        }
        /*
        var oShapeRect = new createjs.Shape();
        oShapeRect.graphics.beginFill("blue").drawRect(iNewX, -_iHeightSprite, _iWidthSprite,_iHeightSprite);
        oShapeRect.alpha = 0.5;
        _oContainer.addChild(oShapeRect);*/
                        
        return new createjs.Rectangle(_oContainer.x+iNewX,_oContainer.y -_iHeightSprite,_iWidthSprite,_iHeightSprite);
    };
    
    this.getCurAnim = function(){
        return _iCurAnim;
    };
    
    this.getX = function(){
        return _oContainer.x;
    };
    
    this.getContainer = function(){
        return _oContainer;
    };
    
    this._updateMove = function(){
        if(_iCurAnim === PLAYER_ANIM_FALL || _iCurAnim === PLAYER_ANIM_ARRIVAL){
            return;
        }

        if(_bLeft){
            _iXMove -= _iCurAcceleration;
        }
        if(_bRight){
            _iXMove += _iCurAcceleration;
        }

        _oContainer.x += _iXMove;

        _iXMove *= HERO_FRICTION;
        if (_iXMove > _iCurMaxSpeed) {
                _iXMove = _iCurMaxSpeed;
        }
        
        if (_iXMove < -_iCurMaxSpeed) {
                _iXMove = -_iCurMaxSpeed;
        }

        if ( Math.abs(_iXMove) < 0.1 ) {
                _iXMove = 0;
        }
		
	if( ((_oContainer.x  + _iXMove) >= MAX_PLAYER_X)){  
            _oContainer.x = MAX_PLAYER_X;
            if(_iCurAnim === PLAYER_ANIM_RIGHT){
                this.changeAnim(PLAYER_ANIM_RIGHT_OUT);
            }
            
        }else if((_oContainer.x -  _iXMove) <= MIN_PLAYER_X) {
            _oContainer.x = MIN_PLAYER_X;
            if(_iCurAnim === PLAYER_ANIM_LEFT){
                this.changeAnim(PLAYER_ANIM_LEFT_OUT);
            }
        }
        
        //CHANGE SKEW X AND PLAYER Y
        var iOffsetY = 50;//Math.abs((_oContainer.x - (CANVAS_WIDTH/2))/10);
        if ( _oContainer.x > (CANVAS_WIDTH/2)){
            // player right
            iOffsetY *= this.easeInQuart( (_oContainer.x-(CANVAS_WIDTH/2)),0,1, (MAX_PLAYER_X-(CANVAS_WIDTH/2)));
        }else{
            // player left
            iOffsetY *= (1-this.easeOutQuart( (_oContainer.x-MIN_PLAYER_X),0,1, ((CANVAS_WIDTH/2)-MIN_PLAYER_X)));
        }
        _oContainer.y = _iStartY-iOffsetY;
        
        var iSkew = -(_oContainer.x - (CANVAS_WIDTH/2))/50;
        _oContainer.setTransform(_oContainer.x,_oContainer.y,1,1,0,iSkew);
        
    };
    this.easeInQuart = function (t, b, c, d) {
        return c * (t /= d) * t * t * t + b;
    };    
    this.easeOutQuart = function (t, b, c, d) {
        return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    };
    this.easeInCubic = function (t, b, c, d) {
        return c * (t /= d) * t * t + b;
    };
    this.easeOutCubic = function (t, b, c, d) {
        return c * ((t = t / d - 1) * t * t + 1) + b;
    };      
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
        this._updateMove();
        
        if (_iCurFrameIndex === _iTotAnimFrame-1) {
            switch(_iCurAnim){
                case PLAYER_ANIM_RUN:{
                    this.playToFrame(0);
                    break;
                }
                case PLAYER_ANIM_FALL:{
                    this.hide();
                    if(_aCbCompleted[ON_PLAYER_FALL]){
                         _aCbCompleted[ON_PLAYER_FALL].call(_aCbOwner[ON_PLAYER_FALL],TEXT_GAME_OVER);
                    }
                    break;
                }
                case PLAYER_ANIM_ARRIVAL:{
                    _bUpdate = false;
                    if(_aCbCompleted[ON_PLAYER_ARRIVAL]){
                         _aCbCompleted[ON_PLAYER_ARRIVAL].call(_aCbOwner[ON_PLAYER_ARRIVAL]);
                    }
                    break;
                }
                case PLAYER_ANIM_LEFT_OUT:
                case PLAYER_ANIM_RIGHT_OUT:{
                        this.changeAnim(PLAYER_ANIM_RUN);
                }

            }     
        }else{
            this.nextFrame();
        }   
        
        var iFps = FPS;
        if(Math.abs(_iXMove) >15){
            iFps -= 6;
        }else if(Math.abs(_iXMove) >10){
            iFps -= 4;
        }else if(Math.abs(_iXMove) >5){
            iFps -= 2;
        }
        
        createjs.Ticker.framerate = iFps;
        
        return Math.abs(_iXMove);
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}