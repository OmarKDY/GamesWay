;function CInstruction(oParentContainer, iX, iY, bVertical, szTxt){

    var _oParentContainer = oParentContainer;

    var _oContainer;
    var _bVertical;
    var _oBg;
    var _oTxtBox;
    var _szTxt;
    var _bCompleted;

    this._init = function(iX, iY, bVertical, szTxt){
        _bVertical = bVertical;
        _szTxt = szTxt;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        _bCompleted = _szTxt==""?true:false;
        
        var oSpriteBg = bVertical?s_oSpriteLibrary.getSprite('bg_instruction_vertical'):s_oSpriteLibrary.getSprite('bg_instruction');
        _oBg = createBitmap(oSpriteBg);
        _oContainer.addChild(_oBg);

        _oContainer.regX = bVertical?oSpriteBg.width/2:oSpriteBg.width;
        _oContainer.regY = bVertical?oSpriteBg.height:oSpriteBg.height/2;
        _oContainer.x= iX;
        _oContainer.y= iY;

        var iNumChars = 4;

        if(bVertical){
            iNumChars = _szTxt.split("\n",4).length;
        }

        _oTxtBox = new CTLText(_oContainer, 
            0, bVertical?((4-iNumChars)*72):10, _oContainer.getBounds().width, _oContainer.getBounds().height +(bVertical?0:-10),
            72, bVertical?"center":"right", COLOR_1 ,FONT, 1, 
            0, 0,
            _szTxt,
            true, !bVertical, false,
            false
        );
    }

    this.setCompleted = function(bCompleted){
        _bCompleted = bCompleted;
        if(_szTxt == ""){
            _bCompleted = true;
        }
        if(_bCompleted){
            if(_szTxt!=""){
                _oTxtBox.setColor(COLOR_2);
            }
        }
        else{
            _oTxtBox.setColor(COLOR_1);
        }
    }

    this.isCompleted = function(){
        return _bCompleted;
    }

    this._init(iX, iY, bVertical, szTxt);
}