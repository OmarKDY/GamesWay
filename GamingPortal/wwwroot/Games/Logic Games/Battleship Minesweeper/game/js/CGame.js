function CGame(oInfo){
    var _bUpdate = false;
    var _bFlagActive;
    var _bFirstCellClicked = true;
    var _iNumMines;
    var _iScore;
    var _iTimeElaps;
    var _aLogicGrid;
    var _aButtonGrid;
    var _oBg;
    var _oHelpPanel;
    var _oInterface;
    var _oEndPanel;
    
    this._init = function(){
        _bFlagActive = false;
        _iNumMines = NUM_MINES;
        _iTimeElaps = TIME_LEVEL;
        _iScore = 0;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
		
        this._setGridSize();
        this.createGrid();
        this.assignGridCounter();
        this.createGridButton();
        
        _oInterface = new CInterface();
        _oHelpPanel = new CHelpPanel(s_oSpriteLibrary.getSprite('bg_help'));
        
        $(s_oMain).trigger("start_level",1);
    };
    
    this.unload = function(){
        
        _oInterface.unload();
        
        if(_oEndPanel){
            _oEndPanel.unload();
        }
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                _aLogicGrid[i][j].unload();
            }
        }
        s_oStage.removeAllChildren();
    };
	
    this._setGridSize = function(){
            var iPercScaleWidth = 1;
            var iPercScaleHeight = 1;
            var iCellWidth = Math.floor((CANVAS_WIDTH - EDGEBOARD_X - 46)/BOARD_COLS);
            if(iCellWidth>60){
                    iCellWidth = 60;
                    GRID_SCALE = 1;
            }else{
                    iPercScaleWidth = iCellWidth/CELL_WIDTH;
            }		

            var iCellHeight = Math.floor( (CANVAS_HEIGHT-BOARD_OFFSET_Y)/BOARD_ROWS);
            if(iCellHeight>60){
                    iCellHeight = 60;
                    GRID_SCALE = 1;
            }else{
                    iPercScaleHeight = iCellHeight / CELL_HEIGHT;
            }	

            if(iPercScaleWidth < iPercScaleHeight){
                    GRID_SCALE = iPercScaleWidth;
            }else if(iPercScaleWidth > iPercScaleHeight){
                    GRID_SCALE = iPercScaleHeight;
            }else{
                    GRID_SCALE = iPercScaleHeight;
            }

            BOARD_OFFSET_X = Math.floor( (CANVAS_WIDTH - ( (CELL_WIDTH*GRID_SCALE)*BOARD_COLS))/2 );
    }
    
    this.createGridButton = function(){
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite('button_grid')], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: 0, regY: 0}, 
                        animations: {state_0:[0,1],state_1:[1,2]}
                    };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        var iXPos = BOARD_OFFSET_X;
        var iYPos = BOARD_OFFSET_Y;
        _aButtonGrid = new Array();
        for(var i=0;i<BOARD_ROWS;i++){
            _aButtonGrid[i] = new Array();
            for(var j=0;j<BOARD_COLS;j++){
                _aButtonGrid[i][j] = new CButtonGrid(i,j,iXPos,iYPos,oSpriteSheet);
                 iXPos += CELL_WIDTH*GRID_SCALE;
            }
            
            iXPos = BOARD_OFFSET_X;
            iYPos += CELL_HEIGHT*GRID_SCALE;
        }
    };
    
    this.createGrid = function(){
        var oData = {   
                        images: [s_oSpriteLibrary.getSprite('cell_bg')], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_WIDTH, height: CELL_HEIGHT, regX: 0, regY: 0}, 
                        animations: {state_0:[0,1],state_1:[1,2],state_2:[2,3],state_3:[3,4],state_4:[4,5],state_5:[5,6],state_6:[6,7],
                                        state_7:[7,8],state_8:[8,9],mine:[9,10]}
                    };
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
        var aGridPos = new Array();
        _aLogicGrid = new Array();
        //PHASE 1: CREATE THE GRID
        var iXPos = BOARD_OFFSET_X;
        var iYPos = BOARD_OFFSET_Y;
        for(var i=0;i<BOARD_ROWS;i++){
            _aLogicGrid[i] = new Array();
            for(var j=0;j<BOARD_COLS;j++){
                var oCell = new CCellGrid(iXPos,iYPos,oSpriteSheet);
                _aLogicGrid[i][j] = oCell;
                iXPos += CELL_WIDTH*GRID_SCALE;
                
                aGridPos.push({row:i,col:j}); 
            }
            iXPos = BOARD_OFFSET_X;
            iYPos += CELL_HEIGHT*GRID_SCALE;
        }
        
        this.putMines(aGridPos);
    };
    
    this.putMines = function(aGridPos){
        //PHASE 2: PUT MINES RANDOMLY
        var aMinesPos = new Array();
        for(var i=0;i<NUM_MINES;i++){
            var iRand = Math.floor(Math.random()*aGridPos.length);
            aMinesPos.push(aGridPos[iRand]);
            aGridPos.splice(iRand,1);
        }
        
        for(var j=0;j<aMinesPos.length;j++){
            _aLogicGrid[aMinesPos[j].row][aMinesPos[j].col].putMine();
        } 
    };
    
    this.resetGrid = function(){
        var aGridPos = new Array();
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                _aLogicGrid[i][j].reset();
                aGridPos.push({row:i,col:j}); 
            }
        }
        
        this.putMines(aGridPos);
        this.assignGridCounter();
    };
    
    this.assignGridCounter = function(){
        //PHASE 3: CHANGE INTEGER COUNTER IN GRID
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                if(_aLogicGrid[i][j].getState() !== "mine"){
                    var iValue = this.checkAdjacent(i,j);
                    _aLogicGrid[i][j].changeState(iValue);
                }
            }
        }
    };
    
    this.checkAdjacent = function(iRow,iCol){
        
        var iValue = 0;
        if( (iRow-1) >=0 && (iCol-1)>=0 && _aLogicGrid[iRow-1][iCol-1].getState() === "mine"){
            iValue++;
        }
        
        if( (iRow-1)>=0 && _aLogicGrid[iRow-1][iCol].getState() === "mine"){
            iValue++;
        }
        
        if( (iRow-1)>=0 && (iCol+1)<BOARD_COLS && _aLogicGrid[iRow-1][iCol+1].getState() === "mine"){
            iValue++;
        }
        
        if((iCol-1)>=0 && _aLogicGrid[iRow][iCol-1].getState() === "mine"){
            iValue++;
        }
        
        if((iCol+1)<BOARD_COLS && _aLogicGrid[iRow][iCol+1].getState() === "mine"){
            iValue++;
        }
        
        if((iRow+1) <BOARD_ROWS && (iCol-1)>=0 && _aLogicGrid[iRow+1][iCol-1].getState() === "mine"){
             iValue++;
        }
        
        if((iRow+1)<BOARD_ROWS && _aLogicGrid[iRow+1][iCol].getState() === "mine"){
             iValue++;
        }
        
        if((iRow+1) <BOARD_ROWS && (iCol+1)<BOARD_COLS && _aLogicGrid[iRow+1][iCol+1].getState() === "mine"){
            iValue++;
        }
        
        return iValue;
    };
	
	this.cellRightClick = function(iRow,iCol){
		_bFlagActive = true;
		this.cellClicked(iRow,iCol);
		_bFlagActive = false;
	};

    this.cellClicked = function(iRow,iCol){
        if(_bFlagActive && _aButtonGrid[iRow][iCol].getState() === "state_0"){
            //PUT FLAG 
            _aButtonGrid[iRow][iCol].setState(1);
            _iNumMines--;
            _oInterface.refreshMines(_iNumMines);
            return;
        }

        if(_aButtonGrid[iRow][iCol].getState() === "state_1"){
            _iNumMines++;
            _oInterface.refreshMines(_iNumMines);
            _aButtonGrid[iRow][iCol].setState(0);
            return;
        }
        
        var iValue = _aLogicGrid[iRow][iCol].getState();
            
        //IF THIS IS THE FIRST CELL CLICKED, FORCE THE GAME TO HAVE AN EMPTY CELL
        while(_bFirstCellClicked && iValue !== "state_0"){ 
            this.resetGrid();
            iValue = _aLogicGrid[iRow][iCol].getState();
        }
        
        _bFirstCellClicked = false;
        
        _aButtonGrid[iRow][iCol].remove();
        
        if(iValue === "mine"){
            playSound("game_over",1,false);
            
            this._gameOver();
        }else{
            if(iValue === "state_0"){
                this.showAdjacentCell(iRow,iCol);
            }
            if(this._checkWin()){   
                this._win();
            }
            
            if(typeof callGameAjax !== 'undefined' ){
                callGameAjax(_iScore);
            }
        }
    };
    
    this.showAdjacentCell = function(iRow,iCol){
        _aLogicGrid[iRow][iCol].setChecked();
        
        for(var i=(iRow-1);i<(iRow+2);i++){
            for(var j=(iCol-1);j<(iCol+2);j++){
                if( i>=0 && j>=0 && i<BOARD_ROWS && j<BOARD_COLS){
                    if(_aLogicGrid[i][j].isChecked() === false && _aLogicGrid[i][j].getState() !== "mine"){
                        _aButtonGrid[i][j].remove();

                        if(_aLogicGrid[i][j].getState() === "state_0"){
                            this.showAdjacentCell(i,j);
                        }
                    }
                    
                }
            }
        }
    };
    
    this.setFlagActive = function(bActive){
        _bFlagActive = bActive;
    };
    
    this._gameOver = function(){   
        _bUpdate = false;
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore,false);
    };
    
    this._win = function(){
        _iScore += Math.floor(_iTimeElaps/100);
	_oInterface.refreshScore(_iScore);
        _bUpdate = false;
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore,true);
    };
    
    this._checkWin = function(){
        _iScore = 0;
        var iNumTilesToRemove = (BOARD_ROWS*BOARD_ROWS) - NUM_MINES;
        for(var i=0;i<BOARD_ROWS;i++){
            for(var j=0;j<BOARD_COLS;j++){
                if(_aButtonGrid[i][j].isActive() === false){
                    iNumTilesToRemove--;
                    _iScore += SCORE_FOR_ELEM;
                }
            }
        }
        
	_oInterface.refreshScore(_iScore);
		
        if(iNumTilesToRemove === 0){
            return true;
        }else{
            return false;
        }
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
		
	$(s_oMain).trigger("end_session");
    };
    
    this._onExitHelp = function(){
        _bUpdate = true;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
        
	_iTimeElaps -= s_iTimeElaps;
        if(_iTimeElaps>0){
            _oInterface.refreshTime(_iTimeElaps);
        }else{
            _iTimeElaps = 0;
            this._gameOver();
        }
    };
    
	if(oInfo.cols>30){
		BOARD_COLS = 30; 
	}else if(oInfo.cols<10){
		BOARD_COLS = 10;
	}else{
		BOARD_COLS = oInfo.cols; 
	}
	
	if(oInfo.rows > 30){
		BOARD_ROWS = 30; 
	}else if(oInfo.rows<10){
		BOARD_ROWS = 10; 
	}else{
		BOARD_ROWS = oInfo.rows; 
	}
	
	if(oInfo.mines >= (BOARD_ROWS*BOARD_COLS)){
		NUM_MINES = Math.floor((BOARD_ROWS*BOARD_COLS)/2);
	}else{
		NUM_MINES = oInfo.mines;
	}

	TIME_LEVEL = oInfo.time;
	
	
    s_oGame=this;

    this._init();
}

var s_oGame;