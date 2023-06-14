function CGame(){
    var _iCurTurn;
    var _iState;
    
    var _oEndPanel;
    var _oInterface;
    var _oBoard;
    var _oHelpPanel;
    
    
    this._init = function(){

        var oBg = createBitmap(s_oSpriteLibrary.getSprite("bg_game"));
        s_oStage.addChild(oBg);
        
        _oBoard = new CBoard(s_oStage);
        _oInterface = new CInterface();
        
        this.reset();
        
       _oHelpPanel = new CHelpPanel();
       _oHelpPanel.show();
       
       
       _oEndPanel = new CEndPanel();
       _oEndPanel.addEventListener(ON_RESTART,this.restart,this);
       _oEndPanel.addEventListener(ON_BACK_MENU,this.onExit,this);

       if(s_iMode === MODE_CPU){
           s_oAi = new CAiController();
        }
       
       this.startGame();
    };
    
    this.unload = function(){
        _oInterface.unload();
       
        s_oStage.removeAllChildren();
        
        s_oGame = null;
    };
    
    this.reset = function(){  
        _iState = GAME_STATE_PLACING;
        _iCurTurn = WHITE_PLAYER;
        _oInterface.changeTurn(_iCurTurn);
    };
    
    this.restart = function(){
       this.reset();
       _oBoard.restart();
       _oInterface.refreshTextHelp(TEXT_STATE0);
       
       this.startGame();
    };
    
    this.startGame = function(){
        _oBoard.startGame();
    };
    
    this.refreshButtonPos = function(){
        _oInterface.refreshButtonPos();
    };
    
    this.refreshTextHelp = function(szText){
        _oInterface.refreshTextHelp(szText);
    };
    
    this.changeState = function(iState){
        _iState = iState;
        switch(iState){
            case GAME_STATE_MOVEMENT:{
                    _oBoard.prepareForMovState(_iCurTurn);
                    _oInterface.refreshTextHelp(TEXT_STATE2);
                    break;
            }
        }
    };

    this.changeTurn = function(bEndPlacing){
        _iCurTurn++;
        if(_iCurTurn > BLACK_PLAYER){
            _iCurTurn = 0;
        }
        
        _oInterface.changeTurn(_iCurTurn);
        
        if(bEndPlacing){
            this.changeState(GAME_STATE_MOVEMENT);
        }
    };
    
    this.gameOver = function(iWinner,aWhites,aBlacks){
        var iScore = 0;
        if(iWinner === WHITE_PLAYER){
            iScore = aWhites.length* PIECE_POINTS;
        }else{
            iScore = aBlacks.length*PIECE_POINTS;
        }
                
        _oEndPanel.show(iScore,iWinner);
        
        $(s_oMain).trigger("share_event", iScore);
        $(s_oMain).trigger("save_score", iScore);
    };
    
    this.onExitFromHelp = function(){
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
	$(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("end_session");
    };
    
    this.getTurn = function(){
        return _iCurTurn;
    };
    
    this.getOpponentTurn = function(){
        return _iCurTurn===0?1:0;
    };
    
    this.getState = function(){
        return _iState;
    };
    
    this.update = function(){

        
    };
    
    s_oGame = this;

        
    this._init();
}

var s_oGame = null;