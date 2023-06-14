function CText(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize,iCenterX){
    
    var _bBlock;
    
    var _iScale;
    var _oButton;
    var _oText;
    var _oTextBack;
    
    this._init =function(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize){
        
        _bBlock = false;
        
        _iScale = 1;
        
        var oButtonBg = createBitmap( oSprite);

        var iStepShadow = Math.ceil(iFontSize/20);
        _oTextBack = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, "#000000");
        _oTextBack.textAlign = "center";
        _oTextBack.textBaseline = "alphabetic";
        var oBounds = _oTextBack.getBounds();  
        _oTextBack.x = oSprite.width/2 + iStepShadow;
        _oTextBack.y = Math.floor(((oSprite.height)/2) +(oBounds.height/3) + iStepShadow)+iCenterX ;
        _oTextBack.alpha=0.5;
        
        _oText = new createjs.Text(szText,"bold "+iFontSize+"px "+szFont, szColor);
        _oText.textAlign = "center";
        _oText.textBaseline = "alphabetic";
        var oBounds = _oText.getBounds();    
        _oText.x = oSprite.width/2;
        _oText.y = Math.floor(((oSprite.height)/2) +(oBounds.height/3))+iCenterX;

        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos;
        _oButton.regX = oSprite.width/2;
        _oButton.regY = oSprite.height/2;
        _oButton.addChild(oButtonBg,_oTextBack,_oText);
    
        s_oStage.addChild(_oButton);

        this._initListener();
    };
    
    this._initListener = function(){
       oParent = this;     
    };
    
    this.setText = function(szText){
        _oText.text = szText;
        _oTextBack.text = szText;
    };
    
    this.changeChildIndex = function(index){
        if(oSprite!==null){
            s_oStage.setChildIndex(_oButton,index);
        }
        else{
            s_oStage.setChildIndex(_oText,index);
        }
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this.unload = function(){
       s_oStage.removeChild(_oButton);
    };
    
    this._init(iXPos,iYPos,oSprite,szText,szFont,szColor,iFontSize);
    return this;
}

    