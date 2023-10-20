var ON_PAN_START = 0;
var ON_PAN_MOVE  = 1;
var ON_PAN_END   = 2;

var PAN_VELOCITY_RATIO = 30;

function CPanController (){

    var _oParent;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams;
    
    var _fPanVelocityRatio;
    
    this._init = function(){
    
        s_oHammer.get('pan').set({threshold: 2, direction: Hammer.DIRECTION_ALL});
        
        s_oHammer.on("panstart", this._onPanStart);
        
        _fPanVelocityRatio = PAN_VELOCITY_RATIO + (s_bLandscape?5:0)/** s_fInverseScaling*/;
        
        s_bPanGesture = false;
        
        _aCbCompleted = [];
        _aCbOwner = [];
        _aParams = [];
    };
    
    this._onPanStart = function(e){
        s_bPanGesture = true;
        _oParent.triggerEvent(ON_PAN_START, e);
        s_oHammer.on("panend", _oParent._onPanEnd);
        s_oHammer.on("panmove", _oParent._onPanMove);
    };
    
    this._onPanMove = function(e){
        _aParams[ON_PAN_MOVE] = {
                                    x: e.velocityX * _fPanVelocityRatio, 
                                    y: e.velocityY * _fPanVelocityRatio 
                                };
       _oParent.triggerEvent(ON_PAN_MOVE, e);
    };
    
    this._onPanEnd = function(e){
        setTimeout(function(){
            s_bPanGesture = false;
        },s_iTimeElaps);
        _oParent.triggerEvent(ON_PAN_END, e);
        
        s_oHammer.off("panend",  _oParent._onPanEnd);
        s_oHammer.off("panmove", _oParent._onPanMove);
    };
    
    this.panGesture = function(){
        return s_bPanGesture;
    };
    
    this.unload = function(){
        s_oHammer.off("panstart", this._onPanStart);
    };
    
    this.triggerEvent = function(iEvent, evt){
        if(_aCbCompleted[iEvent]){
            _aCbCompleted[iEvent].call(_aCbOwner[iEvent], _aParams[iEvent], evt);
        }      
    };
    
    this.addEventListener = function (iEvent, cbCompleted, cbOwner, aParams){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams[iEvent] = aParams;
    };
    
    _oParent = this;
    this._init();
};

var s_bPanGesture;