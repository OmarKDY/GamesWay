function CSolutionPanel(iX,iY,oParentContainer){
    var _aSolutions;
    
    var _oSpriteBg;
    var _oContainer;
    var _oContainerWords;
    var _oParentContainer;
    
    this._init = function(iXPos,iYPos){
        _oContainer = new createjs.Container();
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
        _oParentContainer.addChild(_oContainer);
        
        _oSpriteBg = s_oSpriteLibrary.getSprite("solution_panel_bg");
        var oBg = createBitmap(_oSpriteBg);
        _oContainer.addChild(oBg);
        
        _oContainerWords = new createjs.Container();
        _oContainer.addChild(_oContainerWords);
    };
    
    this.reset = function(){
        for(var i=0;i<_aSolutions.length;i++){
            _aSolutions[i].unload();
        }
    };
    
    this.showWord = function(iIndex){
        _aSolutions[iIndex].show();
    };
    
    this.showAllWords = function(aListIndex){
        for(var i=0;i<_aSolutions.length;i++){
            if(_aSolutions[i].isGuessed() === false){
                _aSolutions[i].show();
            }
        }
        
        for(var j=0;j<aListIndex.length;j++){
            _aSolutions[aListIndex[j]].changeBg(1);
            _aSolutions[aListIndex[j]].changeColorText("#fff");
        }
    };
    
    this.setWords = function(aList,iIndexWord){
        var iLimitY = _oSpriteBg.height - 20;
        var iMaxLenWord = 1;
        
        var iX = 20;
        var iY = 30;
        var oSpriteCell = s_oSpriteLibrary.getSprite("cell_bg_small");
        _aSolutions = new Array();
        for(var i=0;i<aList.length;i++){
            if(iMaxLenWord < aList[i].length){
                iMaxLenWord = aList[i].length;
            }
            
            var oSolution = new CSolutionWord(iX,iY,aList[i],oSpriteCell,_oContainerWords);
            iY += oSpriteCell.height + 5;
            if(iY > iLimitY){
                iY = 30;
                iX += (oSpriteCell.width/3+2)*iMaxLenWord + 30;
            }
            
            _aSolutions.push(oSolution);
        }
        
        _oContainerWords.regX = _oContainerWords.getBounds().width/2;
        _oContainerWords.x = _oSpriteBg.width/2;

        if(BONUS_MULTIPLIER > 0){
            _aSolutions[iIndexWord].changeBg(2);
        }
        
    };
    
    _oParentContainer = oParentContainer;
    this._init(iX,iY);
}