function CHitArea(iWidth, iHeight, iXPos, iYPos, iID, oParentContainer){
    var _bDisabled;
    
    var _iListenerIDMouseDown;
    var _iListenerIDPressUp;
    var _iListenerIDMouseOver;
    var _iID;
    
    var _aParams = [];
    var _aCbCompleted;
    var _aCbOwner;
    
    var _oHitArea;
    var _oParent;
    
    this._init = function(iWidth, iHeight, iXPos, iYPos, iID, oParentContainer){
        _bDisabled = false;
        _iID = iID;
        _aCbCompleted = new Array();
        _aCbOwner = new Array();

        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("#000000").drawRect(iXPos, iYPos, iWidth, iHeight);
        _oHitArea.alpha = 0.01;
        oParentContainer.addChild(_oHitArea);        
        
        this._initListener();
    };
    
    this.unload = function(){
        if(s_bMobile){
            _oHitArea.off("mousedown", _iListenerIDMouseDown);
            _oHitArea.off("pressup" , _iListenerIDPressUp);
        } else {
            _oHitArea.off("mousedown", _iListenerIDMouseDown);
            _oHitArea.off("mouseover", _iListenerIDMouseOver);
            _oHitArea.off("pressup" , _iListenerIDPressUp);
        }
        
       oParentContainer.removeChild(_oHitArea);
    };
    
    this.setClickable = function(bVal){
        _bDisabled = !bVal;
        if (_bDisabled) {
            _oHitArea.alpha = 0;
        } else {
            _oHitArea.alpha = 0.01;
        }
    };
    
    this._initListener = function(){
        if(s_bMobile){
            _iListenerIDMouseDown = _oHitArea.on("mousedown", this.onDown);
            _iListenerIDPressUp   = _oHitArea.on("pressup" , this.onRelease);
        } else {
            _iListenerIDMouseDown = _oHitArea.on("mousedown", this.onDown);
            _iListenerIDMouseOver = _oHitArea.on("mouseover", this.onOver);
            _iListenerIDPressUp   = _oHitArea.on("pressup" , this.onRelease);
        }     
    };
    
    this.addEventListener = function(iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent] = cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
	
    this.onRelease = function(){
        if(_bDisabled){
            return;
        }

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
        }
    };
    
    this.onDown = function(){
        if(_bDisabled){
            return;
        }
        
        if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
        }
    };
    
    this.onOver = function(evt){
        if(!s_bMobile){
            if(_bDisabled){
                return;
            }
            evt.target.cursor = "pointer";
        }  
    };
    
    this.getX = function(){
        return _oHitArea.x;
    };
    
    this.getY = function(){
        return _oHitArea.y;
    };
    
    _oParent = this;
    
    this._init(iWidth, iHeight,iXPos,iYPos,iID,oParentContainer);
    
    return this;
}