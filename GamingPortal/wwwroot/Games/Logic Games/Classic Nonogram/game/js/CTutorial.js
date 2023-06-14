function CTutorial(){

    var _iCurStep;

    var _oGrid;
    var _oSwitch;
    var _oButNext;
    var _oButExit;
    var _oHelpBox;
    var _oTutorialEndPanel;

    var _oFade;
    var _oListener;

    var _pStartPosSwitch;
    var _pStartPosExit;
    var _pStartPosHelpBox;
    var _pStartPosNext;
    var _pStartPosHand;

    this._init = function(){
        _iCurStep = 0;

        setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);

        _oGrid = new CGrid(s_oStage, TUTORIAL_LEVEL[0], true);

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("rgba(0,0,0,0.5)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oListener = _oFade.on("click", function(){});
        s_oStage.addChild(_oFade);

        _pStartPosSwitch = {x:CANVAS_WIDTH/2,y:CANVAS_HEIGHT-20};
        _oSwitch = new CSwitch(s_oStage, _pStartPosSwitch.x, _pStartPosSwitch.y);
        _oSwitch.onLockToggle();
        _oSwitch.setLockToggleActive(false);
        _oSwitch.addEventListener(ON_MOUSE_UP, this._onSwitch, this);
        _oSwitch.setVisible(false);

        _pStartPosHelpBox = {x:CANVAS_WIDTH/2,y:(s_bLandscape?20:170)};
        _oHelpBox = new CHelpBox(s_oStage, _pStartPosHelpBox.x, _pStartPosHelpBox.y);
        _oHelpBox.addEventListener(ON_MOUSE_DOWN, this._onNext, this);

        var oSprite = s_oSpriteLibrary.getSprite('but_next');
	    _pStartPosNext = {x:CANVAS_WIDTH/2 + _oHelpBox.getWidth()*CUR_INTERFACE_SCALE/2, y:(s_bLandscape?20:170) + _oHelpBox.getHeight() - 4};
        _oButNext = createBitmap(oSprite);
        _oButNext.x = _pStartPosNext.x;
        _oButNext.y = _pStartPosNext.y;
        _oButNext.regX = oSprite.width;
        _oButNext.regY = oSprite.height;
        s_oStage.addChild(_oButNext);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
	    _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) -10,y:(oSprite.height/2) +10};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);

        var oSprite = s_oSpriteLibrary.getSprite('hand_touch');
        _oHand = new CHand(s_oStage);
        _oHand.setVisible(false);

        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _oTutorialEndPanel = new CTutorialEndPanel();

        _oAreYouSurePanel = new CAreYouSurePanel(s_oStage);

        this.refreshButtonPos();
    };

    this.unload = function(){
        _oHelpBox.unload();
        _oSwitch.unload();
        _oButExit.unload();
        _oTutorialEndPanel.unload();
        _oAreYouSurePanel.unload();
        _oHand.unload();
        _oGrid.unload();

        _oFade.off("click", _oListener);

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

        s_oTutorial = null;
    };

    this._playStep = function(iStep){
        switch(iStep){
            case 1:
                _oHelpBox.setText(TEXT_TUTORIAL[1]);

                _oHelpBox.setRegY(_oHelpBox.getHeight());
                _pStartPosHelpBox = {x:_pStartPosHelpBox.x, y:CANVAS_HEIGHT-40-_oSwitch.getHeight()*CUR_INTERFACE_SCALE};
                _oHelpBox.setY(_pStartPosHelpBox.y);
                _oHelpBox.deactivate();
                this.refreshButtonPos();

                _oSwitch.setVisible(true);
                _oButNext.visible = false;
            break;
            case 2:
                _pStartPosHand = {x:CANVAS_WIDTH/2,y:CANVAS_HEIGHT/2};
                _oHand.setVisible(true);
                _oHand.setScale(CUR_GRID_SCALE);
                _oHand.setX(_pStartPosHand.x);
                _oHand.setY(_pStartPosHand.y);

                _oHelpBox.setText(TEXT_TUTORIAL[2]);

                _oHelpBox.setRegY(0);
                _pStartPosHelpBox = {x:CANVAS_WIDTH/2,y:(s_bLandscape?20:170)};
                _oHelpBox.setY(_pStartPosHelpBox.y);
                this.refreshButtonPos();

                _oFade.visible = false;

            break;
            case 3:
                _oHelpBox.setText(TEXT_TUTORIAL[3]);

                _oGrid.hide(true);
                _oGrid = new CGrid(s_oStage, TUTORIAL_LEVEL[1],true);

                _oHand.setScale(CUR_GRID_SCALE);
                _oHand.setX(_pStartPosHand.x);
                _oHand.setY(_pStartPosHand.y);
                createjs.Tween.get()
                .wait(400)
                .call(function(){
                    _oHand.setVisible(true);
                })
                
                _oHand.setChildIndex(s_oStage.numChildren-1);
                _oAreYouSurePanel.setChildIndex(s_oStage.numChildren-1);
            break;
            case 4:
                _oFade.visible = true;
                _oGrid.setChildIndex(s_oStage.getChildIndex(_oFade)-1);

                _oHelpBox.setText(TEXT_TUTORIAL[4]);

                _oHelpBox.setRegY(_oHelpBox.getHeight());
                _oHelpBox.setY(_pStartPosHelpBox.y);
                this.refreshButtonPos();

                _oSwitch.setLockToggleActive(true);
                _oSwitch.setFillToggleActive(false);
                
                _oHelpBox.deactivate();
                _oButNext.visible = false;
            break;
            case 5:
                _pStartPosHand = {x:CANVAS_WIDTH/2+CELL_WIDTH*CUR_GRID_SCALE,y:CANVAS_HEIGHT/2};
                _oHand.setVisible(true);
                _oHand.setX(_pStartPosHand.x);
                _oHand.setY(_pStartPosHand.y);

                _oHelpBox.setText(TEXT_TUTORIAL[5]);

                _oHelpBox.setRegY(0);
                _pStartPosHelpBox = {x:CANVAS_WIDTH/2,y:(s_bLandscape?20:170)};
                _oHelpBox.setY(_pStartPosHelpBox.y);
                this.refreshButtonPos();

                _oFade.visible = false;
            break;
            case 6:
                _oHelpBox.setText(TEXT_TUTORIAL[6]);
                _oSwitch.setLockToggleActive(false);
                _oSwitch.setFillToggleActive(true);
                _oSwitch.onFillToggle();
                _oGrid.hide(true);
                _oGrid = new CGrid(s_oStage, TUTORIAL_LEVEL[2],false, true, false);
                _oAreYouSurePanel.setChildIndex(s_oStage.numChildren-1);
                _oGrid.setRowCompleted(0,true);
                _oGrid.setRowCompleted(1,true);
                _oGrid.fillRow(0);
                _oGrid.fillRow(1);
                _oGrid.setColCompleted(1,true);
                _oGrid.setColCompleted(2,true);
            break;
            case 7:
                _oHelpBox.setVisible(false);
                _oSwitch.setVisible(false);
                _oGrid.hide();
                _oTutorialEndPanel.show();
            break;
        }

        this.refreshButtonPos();
    };

    this.gridCompleted = function(){
        this._nextStep();
    };
    
    this.onCellGridClick = function(){
        _oHand.setVisible(false);
    };

    this._nextStep = function(){
        _iCurStep++;
        this._playStep(_iCurStep);
    };
    
    this._onSwitch = function(){
        if(_iCurStep == 6){
            return;
        }
        _oSwitch.setActive(false);
        this._nextStep();
    };

    this._onNext = function(){
        this._nextStep();
    };

    this._onExit = function(){
        _oAreYouSurePanel.show(TEXT_ARE_YOU_SURE);
        _oAreYouSurePanel.addEventListener(ON_BUT_YES_DOWN,s_oTutorial.onExitConfirmed,s_oTutorial);
    };

    this.onExitConfirmed = function(){
        this.unload();
        
        if(s_bFirstGame){
            s_bFirstGame = false;
            setLocalStorageFirstGame(false);
        }

        s_oMain.gotoLevelMenu();
    };

    this.refreshButtonPos = function(){
        this.refreshGridScale();
        _oHand.setScale(CUR_GRID_SCALE);
        if(_iCurStep == 5){
            _oHand.setX(CANVAS_WIDTH/2+CELL_WIDTH*CUR_GRID_SCALE);
        }

        _oButExit.setX(_pStartPosExit.x - s_iOffsetX);
        _oButExit.setY(_pStartPosExit.y + s_iOffsetY);

        _pStartPosHelpBox = {x:CANVAS_WIDTH/2,y:(s_bLandscape?20:170)};
        if(_iCurStep != 1 && _iCurStep != 4){
            if(s_bLandscape){
                _oHelpBox.setY(_pStartPosHelpBox.y + s_iOffsetY);
            }else{
                _oHelpBox.setY(_pStartPosHelpBox.y);
            }   
        }else{
            _oHelpBox.setY(CANVAS_HEIGHT-40-_oSwitch.getHeight()*CUR_INTERFACE_SCALE - s_iOffsetY);
        }
        _oHelpBox.refreshScale();

        _oButNext.x = (CANVAS_WIDTH/2 + _oHelpBox.getWidth()*CUR_INTERFACE_SCALE/2);
        _oButNext.y = ((s_bLandscape?20:170) + _oHelpBox.getHeight() * CUR_INTERFACE_SCALE + s_iOffsetY - 4);
        _oButNext.scale = CUR_INTERFACE_SCALE;

        _oSwitch.setX(_pStartPosSwitch.x);
        _oSwitch.setY(_pStartPosSwitch.y - s_iOffsetY);
        _oSwitch.refreshScale();

    };

    this.refreshGridScale = function(){
        var iMaxGridSizeHeight = (CANVAS_HEIGHT - (s_iOffsetY*2));
        CUR_GRID_SCALE = CUR_INTERFACE_SCALE = iMaxGridSizeHeight/MAX_TABLE_HEIGHT;
        
        if(CUR_GRID_SCALE <= 1){
            CUR_GRID_SCALE = parseFloat(CUR_GRID_SCALE.toFixed(2));
        }
        
        _oGrid.refreshGridScale();
    };

    s_oTutorial = this;

    this._init();
}

var s_oTutorial = null;