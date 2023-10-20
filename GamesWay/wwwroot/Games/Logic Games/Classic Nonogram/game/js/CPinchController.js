var ON_PINCH_START  = 0;
var ON_PINCH_MOVE   = 1;
var ON_PINCH_END    = 2;

var PINCH_VELOCITY_RATIO = 1.6; 

function CPinchController(){
    
    var _oParent;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _aParams;
    
    var _fPrevMoveScale;
    var _pOffsetCenterPinch;
        
    this._init = function(){
        s_oHammer.get('pinch').set({ enable: true });
        s_oHammer.get('pinch').set({threshold: 0});
        
        s_oHammer.on("pinchstart", this._onPinchStart);
        
       _aCbCompleted = [];
       _aCbOwner = [];
       _aParams = [];
       
       s_bPinchGesture = false;
       
    };
    
    this._onPinchStart = function(e){
        s_bPinchGesture = true;
        _oParent.triggerEvent(ON_PINCH_START, e);
        
        _fPrevMoveScale = 1;
        _pOffsetCenterPinch = _oParent._calculateOffsetCenterPinch(e.pointers);
        
        s_oHammer.on("pinchend", _oParent._onPinchEnd);
        s_oHammer.on("pinchmove", _oParent._onPinchMove);
    };
    
    this._onPinchMove = function(e){
        var fNewScale = _fPrevMoveScale - e.scale;
        _fPrevMoveScale = e.scale;

        var oInfo = {
                        scale: -fNewScale * PINCH_VELOCITY_RATIO,
                        offset_center: _pOffsetCenterPinch
                    };
                    
        _aParams[ON_PINCH_MOVE] = oInfo;
        _oParent.triggerEvent(ON_PINCH_MOVE, e);
    };
    
    this._onPinchEnd = function(e){
        setTimeout(function(){
            s_bPinchGesture = false;
        },s_iTimeElaps);
           
        _oParent.triggerEvent(ON_PINCH_END, e);
        s_oHammer.off("pinchend", _oParent._onPinchEnd);
        s_oHammer.off("pinchmove", _oParent._onPinchMove);
    };
    
    this._calculateOffsetCenterPinch = function(aPointers){
        var iXCenter = 0;
        var iYCenter = 0;
        
        for(var i = 0; i < aPointers.length; i++){
            iXCenter += aPointers[i].clientX;
            iYCenter += aPointers[i].clientY;
        }
        
        iXCenter /= aPointers.length;
        iYCenter /= aPointers.length;
        
        var iHalfWidth  = s_oEffectiveCanvasDimension.width*0.5;
        var iHalfHeight = s_oEffectiveCanvasDimension.height*0.5;
        
        var oOffsetCenter = {
                                x: iXCenter - iHalfWidth,
                                y: iYCenter - iHalfHeight
                            };
        
        oOffsetCenter.x /= iHalfWidth;
        oOffsetCenter.y /= iHalfHeight;
        
        return oOffsetCenter;
    };
    
    this.pinchGesture = function(){
        return s_bPinchGesture;
    };
    
    this.unload = function(){
        s_oHammer.off("pinchstart", this._onPinchStart);
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
}

var s_bPinchGesture;