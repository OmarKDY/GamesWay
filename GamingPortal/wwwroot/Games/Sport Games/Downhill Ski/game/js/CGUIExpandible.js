function CGUIExpandible(iX, iY, oSprite, oParentContainer){
    const OFFSET_Y = 85;
    
    var _bExpanded;
    
    var _aButtons;
    
    var _oParent;
    var _oMenuBut;
    var _oGUIContainer;
    var _oFrontContainer;
    var _oExpandedPos;
    
    var _pStartPos;
    
    this._init = function(iX, iY, oSprite, oParentContainer){
        
        _aButtons = new Array();
        
        _pStartPos = {x: iX, y: iY};
        _oGUIContainer = new createjs.Container();
        _oGUIContainer.x = iX;
        _oGUIContainer.y = iY;
        oParentContainer.addChild(_oGUIContainer);

        
        _oFrontContainer = new createjs.Container();
        _oGUIContainer.addChild(_oFrontContainer);
        
        _bExpanded = false;
        _oMenuBut = new CSideGfxButton(false,0,0,oSprite, _oFrontContainer);
        _oMenuBut.addEventListener(ON_MOUSE_UP, this._onMenu, this);
        
        var oStart = {x: 0, y: OFFSET_Y};
        _oExpandedPos = {start: oStart, offset: OFFSET_Y};
        
        _oMenuBut.tweenFinalX();
    };
    
    this.unload = function(){
        _oMenuBut.unload();
        oParentContainer.removeChild(_oGUIContainer);
    };
    
    this.refreshPos = function(){
        _oGUIContainer.x = iX - s_iOffsetX;
        _oGUIContainer.y = iY + s_iOffsetY;
        
        for(var i=0; i<_aButtons.length; i++){
            _aButtons[i].setFinalX(_oGUIContainer.x);
        };
    };
    
    this.addButton = function(oButton){
        _aButtons.push(oButton); 
    };
    
    this._onMenu = function(){
        _bExpanded = !_bExpanded;
        
        if(_bExpanded){
            _oParent._expand();
        }else{
            _oParent._collapse();
        }
    };
    
    this._expand = function(){
        for(var i=0; i<_aButtons.length; i++){
            _aButtons[i].tweenFinalX();
        };
    };
    
    this._collapse = function(){
        var iDelay = _aButtons.length*100;
        for(var i=0; i<_aButtons.length; i++){
            _aButtons[i].tweenStartX(iDelay);
            
            iDelay-= 100;
        };
    };
    
    this.isExpanded = function(){
        return _bExpanded;
    };
    
    _oParent = this;
    this._init(iX, iY, oSprite, oParentContainer);
}


