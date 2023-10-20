function CPanelTutorial (){
    
    var _oContainer;
    var _oPanel;
    var _oButNext;
    var _oButBack;
    var _oButSkip;
    var _iCurrentPage;
    var _oContainerPage;
    
    this.init = function () {
        var oSprite;
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(-(CANVAS_WIDTH/2),-(CANVAS_HEIGHT/2),CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        shape.on("mousedown",this.onOver,this);
        _oContainerPage = new createjs.Container();
        _iCurrentPage = 0;
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(shape);
        _oContainer.alpha = 0;
        _oPanel = new createBitmap(s_oSpriteLibrary.getSprite("msg_box"));
        _oPanel.regX = 560/2;
        _oPanel.regY = 364/2;
        _oPanel.alpha = 0.8;
        _oContainer.addChild(_oPanel);
        s_oStage.addChild(_oContainer);
        oSprite = s_oSpriteLibrary.getSprite("arrow");
        _oButNext = new CGfxButton(_oContainer.getBounds().width/2-50,0,oSprite,_oContainer);
        _oButNext.addEventListener(ON_MOUSE_DOWN,this.onButNext,this);
        _oButNext.getButtonImage().rotation = 90;
        _oButBack = new CGfxButton(-(_oContainer.getBounds().width/2-50),0,oSprite,_oContainer);
        _oButBack.addEventListener(ON_MOUSE_DOWN,this.onButBack,this);
        _oButBack.getButtonImage().rotation = -90;
        _oButSkip = new CGfxButton(_oContainer.getBounds().width/2-53,_oContainer.getBounds().height/2-53,s_oSpriteLibrary.getSprite("but_skip"),_oContainer);
        _oButSkip.addEventListener(ON_MOUSE_DOWN,this.onButSkip,this);
        this.loadPage(_iCurrentPage);
        new createjs.Tween.get(_oContainer).to({alpha: 1},500);
        
    };
    
    this.loadPage = function (iPage){
        var oText;
        switch (iPage){
            
            
            case 0: 
                _oButBack.setVisible(false);
                oText = new CTLText(_oContainerPage, 
                    -200, -120, 400, 200, 
                    32, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TUTORIAL_1,
                    true, true, true,
                    false);
                    
                _oContainer.addChild(_oContainerPage);
                break;
                
                
            case 1:
                _oButBack.setVisible(true);
                oText = new CTLText(_oContainerPage, 
                    -200, -120, 400, 200, 
                    32, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TUTORIAL_2,
                    true, true, true,
                    false);
                    
                
                _oButNext.setVisible(true);
                break;
                
                
            case 2:
                oText = new CTLText(_oContainerPage, 
                    -200, -120, 400, 200, 
                    32, "center", "#fff", PRIMARY_FONT, 1,
                    0, 0,
                    TEXT_TUTORIAL_3,
                    true, true, true,
                    false);
                    
               
                _oButNext.setVisible(false);
                break;  
        }
    };
    
    this.onButNext = function(){
        _iCurrentPage++;
        _oContainerPage.removeAllChildren();
        this.loadPage(_iCurrentPage);
    };
    
    this.onButBack = function(){
       _iCurrentPage--;
       _oContainerPage.removeAllChildren();
       this.loadPage(_iCurrentPage);
    };
    
    this.onButSkip = function(){
        new createjs.Tween.get(_oContainer).to({alpha: 0},500).call(function(){
            s_oStage.removeChild(_oContainer);
            if (s_bFirstPlay){
                s_oGame.startGame();
                                 }});
    };
    
    this.onOver = function(){
        
    };
    
    this.init();
}