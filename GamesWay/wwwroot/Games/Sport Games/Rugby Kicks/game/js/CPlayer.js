function CPlayer(oParentContainer) {
    
    var _bPlayShot;
    var _bLaunched;
    
    var _iCurFrame;
    
    var _aPlayerFrame;
    
    var _oPlayer;
    
    this._init = function(oParentContainer){
        _bPlayShot = false;
        _bLaunched = false;
    
        _iCurFrame = 0;
    
        _oPlayer = new createjs.Container();
        _oPlayer.y = CANVAS_HEIGHT;
        oParentContainer.addChild(_oPlayer);
        
        _aPlayerFrame = new Array();
        for(var i= 0; i<=37; i++){
            var oSprite = s_oSpriteLibrary.getSprite('p'+s_iTeamSelected+"_"+i);
            _aPlayerFrame[i] = createBitmap(oSprite);
            _aPlayerFrame[i].regY = oSprite.height;
            _aPlayerFrame[i].visible = false;
            _oPlayer.addChild(_aPlayerFrame[i]);
        }
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oPlayer);
    };
    
    this.fade = function(){
        new createjs.Tween.get(_oPlayer).wait(200).to({alpha:0}, 800);
    };
    
    this.startPlay = function(){
        _oPlayer.alpha = 1;
        _bPlayShot = true;
        _bLaunched = false;
    };
    
    this._playShot = function(){
        if(_iCurFrame !== 0){
            _aPlayerFrame[_iCurFrame-1].visible = false;
        }
        _aPlayerFrame[_iCurFrame].visible = true;
        _iCurFrame++;
        
        if(_iCurFrame >= 12 && !_bLaunched){
            _bLaunched = true;
            playSound("kick",1,false);    
            s_oGame.launchBall();
            this.fade();
        }
        
        if(_iCurFrame > 37){
            _aPlayerFrame[_iCurFrame-1].visible = false;
            _iCurFrame = 0;
            _bPlayShot = false;
        }
    };
    
    this.update = function(){
        if(_bPlayShot){
            this._playShot();
        }
    };
    
    this._init(oParentContainer); 
    
    
    
}