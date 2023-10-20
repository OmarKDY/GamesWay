function CLevelsBox(iXPos,iYPos,oParentContainer,iNumButtons,oSpritePanel, iDiff){

    var _oContainer;
    var _iX;
    var _iY;

    var _oPanel;
    var _oParentContainer = oParentContainer;
    var _oBackBut;

    var _iNumButtons = iNumButtons;
    var _aButtons = [];
    var _bVisible = false;
    var _iDiff;

    this._init = function(iXPos,iYPos,oSpritePanel, iDiff){
        _iX = iXPos;
        _iY = iYPos;

        if(iDiff==undefined){
            _iDiff=-1;
        }
        else{
            _iDiff=iDiff;
        }

        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);

        _oPanel = createBitmap(oSpritePanel);        
        _oContainer.addChild(_oPanel);

        _oContainer.regX = oSpritePanel.width/2;
        _oContainer.regY = oSpritePanel.height/2;
        _oContainer.x = _iX;
        _oContainer.y = _iY;  

        var szTxt;
        if(_iDiff==-1){
            szTxt = TEXT_LEVELS_BOX_TITLE_DIFFICULTY;
        }
        else{
            szTxt = TEXT_LEVELS_BOX_TITLE_LEVEL;
        }

        var iWidth = 500;
        var iHeight = 80;
        var iX = oSpritePanel.width/2 - iWidth/2;
        var iY = 40;
        var oText =  new CTLText(_oContainer, 
            iX, iY, iWidth, iHeight, 
            70, "center", COLOR_0, FONT, 1,
            0, 0,
            szTxt,
            true, true, false,
            false 
        );

        if(_iDiff > -1){
            var oSprite = s_oSpriteLibrary.getSprite('but_back');
            _oBackBut = new CGfxButton(oSprite.width/2,oSprite.height/2,oSprite, _oContainer);
            _oBackBut.addEventListener(ON_MOUSE_UP, s_oLevelMenu.onBackBut, s_oLevelMenu);
        }

        this._addButtons();
        this._updateLevelButtons(0);

    };

    this.unload = function(){
        if(_iDiff > -1){
            _oBackBut.unload();
        }

        _aButtons.forEach(element => {
            element.unload();
        });
        createjs.Tween.get(_oContainer).to({scale:0}, 150).call(function(){
            _oParentContainer.removeChild(_oContainer);
        });
        
    };

    this._addButtons = function(){

        var iXPos = this.getWidth()/2-300;
        var iYPos = 220;

        for(var iRow=0;iRow < 3; iRow++){
            for(var iCol=0;iCol <4; iCol++){
                this._addLevelButton(iXPos,iYPos);
                iXPos += 200;
            }

            iXPos = this.getWidth()/2-300;
            iYPos += 200;
        }
    };

    this._addLevelButton = function(iXPos,iYPos){
        var iFontSize = _iDiff == -1?45:65;
        var oSprite = s_oSpriteLibrary.getSprite(_iDiff == -1?'but_difficulties':'but_level');
        var pStartPosLevel = {x: iXPos, y: iYPos};     
        var oLevelBut = new CLevelButton(pStartPosLevel.x,pStartPosLevel.y,oSprite,"",FONT,COLOR_0,iFontSize,_oContainer);
        oLevelBut.addEventListener(ON_MOUSE_UP, this._onLevelBut, this);
        _aButtons.push(oLevelBut);
    };

    this.show = function(iNumPage,aDifficulty, bLeftBut){
        
        if(aDifficulty === undefined){
            this._updateLevelButtons(iNumPage);
        }
        else{
            this._updateLevelButtons(iNumPage, aDifficulty);
        }

        if(bLeftBut == undefined){
            return;
        }

        var iContainerWidth = this.getWidth();
        this.setVisible(true);
        _oContainer.y = _iY;
        if(bLeftBut){
            _oContainer.x = 0-iContainerWidth;
        }
        else{
            _oContainer.x = CANVAS_WIDTH+iContainerWidth;
        }
        createjs.Tween.get(_oContainer)
        .to({x: CANVAS_WIDTH/2},300, createjs.Ease.backOut);
    };

    this.hide = function(bGoLeft){

        var iContainerWidth = this.getWidth();

        if(bGoLeft){
            var iXPos = 0-iContainerWidth;
        }
        else{
            var iXPos = CANVAS_WIDTH+iContainerWidth;
        }
        var oParent = this;
        createjs.Tween.get(_oContainer)
        .to({x: iXPos},300,createjs.Ease.backOut)
        .call(
            function(){
                oParent.setVisible(false);
            });
    };

    this._onLevelBut = function(iType){
        s_oLevelMenu.onLevelBoxBut(iType);
    };

    this._updateLevelButtons = function(iPage, aDifficulty){
        var i = iPage*12;
        
        _aButtons.forEach(element => {

            if(aDifficulty === undefined){
                element.changeText(i+1);
            }
            else{   
                element.changeText(aDifficulty[i]+"x"+aDifficulty[i]);
            }

            if(i < _iNumButtons){
                element.setVisible(true);
                
                if(i<=parseInt(getSavedLevel(_iDiff))+1 && aDifficulty == undefined){
                    element.enable();
                    element.setScore(getLevelScore(_iDiff,i));
                }
                else if(aDifficulty != undefined){
                    element.enable();
                    element.setScore("");
                }
                else{
                    element.disable();
                    element.setScore("");
                }
            }
            else{
                element.setVisible(false);
                element.disable();
            }
            i++;
        });
    }

    this.setVisible = function(bVisible){
        _bVisible = bVisible;
        _oContainer.visible = _bVisible;
    };

    
    this.playPulseAnimation = function(){
        var iScale = _oContainer.scale;
        _oContainer.scale = 0;
        setTimeout(function(){createjs.Tween.get(_oContainer).to({scale:iScale*1.10}, 150, createjs.Ease.quadOut)
        .to({scale:iScale}, 150, createjs.Ease.quadIn)}, 150);
    };

    this.setPosition = function(iX,iY){
        _iX = iX;
        _oContainer.x = _iX;

        _iY = iY;
        _oContainer.y = iY;
    };

    this.getWidth = function(){
        return _oContainer.regX*2;
    };

    this.getHeight = function(){
        return _oContainer.regY*2;
    };

    this._init(iXPos,iYPos,oSpritePanel, iDiff);
}