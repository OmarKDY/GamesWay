function CSwitch(oParentContainer, iX, iY){

    var _bFillActive;
    var _bLockActive;
    var _aCbCompleted;
    var _aCbOwner;

    var _oParentContainer = oParentContainer;
    var _oContainer;
    var _oBg;
    var _oLockToggle;
    var _oFillToggle;
    var _iHeight;

    this._init = function(iX, iY){
        s_bLock = false;

        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        var oSpriteBg = s_oSpriteLibrary.getSprite("bg_switch");
        _oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(_oBg);

        _iHeight = oSpriteBg.height;

        var oSprite = s_oSpriteLibrary.getSprite('but_lock');
        _oLockToggle = new CToggle(10+SWITCH_TOGGLE_WIDTH/2,SWITCH_TOGGLE_HEIGHT/2,oSprite,false,_oContainer);
        _oLockToggle.addEventListener(ON_MOUSE_UP, this.onLockToggle, this);
        

        var oSprite = s_oSpriteLibrary.getSprite('but_fill');
        _oFillToggle = new CToggle(10+SWITCH_TOGGLE_WIDTH+SWITCH_TOGGLE_WIDTH/2,SWITCH_TOGGLE_HEIGHT/2,oSprite,true,_oContainer);
        _oFillToggle.addEventListener(ON_MOUSE_UP, this.onFillToggle, this);

        _oContainer.regX = oSpriteBg.width/2;
        _oContainer.regY = oSpriteBg.height;
        _oContainer.x = iX;
        _oContainer.y = iY;

        this.setActive(true);
    }

    this.unload = function(){
        _oLockToggle.unload();
        _oFillToggle.unload();
    }

    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };

    this.onLockToggle = function(){
        if(!_bLockActive){
            return;
        };

        _oLockToggle.setActive(true);
        _oFillToggle.setActive(false);

        s_bLock = true;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    }

    this.onFillToggle = function(){
        if(!_bFillActive){
            return;
        };

        _oFillToggle.setActive(true);
        _oLockToggle.setActive(false);

        s_bLock = false;

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    }

    this.reset = function(){
        this.onFillToggle();
    }

    this.setY = function(iNewY){     
        _oContainer.y = iNewY;
    };

    this.setX = function(iNewX){
        _oContainer.x = iNewX;
    };

    this.setVisible = function(bVisible){
        _oContainer.visible = bVisible;
    };

    this.setActive = function(bActive){
        if(bActive){
            this.setFillToggleActive(true);
            this.setLockToggleActive(true);

            return;
        }
        this.setFillToggleActive(false);
        this.setLockToggleActive(false);

        return;
    };

    this.setLockToggleActive = function(bActive){
        if(bActive){
            _bLockActive = true;
            _oLockToggle.enable();

            return;
        }
        _bLockActive = false;
        _oLockToggle.disable();

        return;
    };

    this.setFillToggleActive = function(bActive){
        if(bActive){
            _bFillActive = true;
            _oFillToggle.enable();

            return;
        }
        _bFillActive = false;
        _oFillToggle.disable();

        return;
    };

    this.refreshScale = function(){
        _oContainer.scale = CUR_INTERFACE_SCALE;
    };

    this.getHeight = function(){
        return _iHeight;
    };

    this._init(iX, iY);
}

var s_bLock = false;