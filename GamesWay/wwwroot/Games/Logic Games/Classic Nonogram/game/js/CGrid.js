function CGrid(oParentContainer, oLevel, bTutorial, bAutoFillRow, bAutoFillCol){
    var _bTutorial;
    var _bAutoFillRow;
    var _bAutoFillCol;

    var _iScaleGrid;

    var _oBgGrid;
    var _oContainer;
    var _oCellsContainer;
    var _oParentContainer = oParentContainer;

    var _oLevel;
    var _aCells;
    var _aRowInstructions = new Array();
    var _aColInstructions = new Array();
    var _oMask;

    var _fMovementRatioZoom;
    var _pPanOffset;
    var _pMaxPanOffset;

    var _oThis = this;

    this._init = function(oLevel, bTutorial, bAutoFillRow, bAutoFillCol){
        _bTutorial = bTutorial?true:false;
        _bAutoFillRow = bAutoFillRow == false?false:true;
        _bAutoFillCol = bAutoFillCol == false?false:true;

        _oLevel = oLevel;
        _fMovementRatioZoom = 1;
        _pPanOffset    = {x: 0, y: 0};
        _pMaxPanOffset = {x: 0, y: 0};
        
        _oBgGrid = new createjs.Shape();
        _oParentContainer.addChild(_oBgGrid);

        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        
        _iScaleGrid = _oContainer.scale;

        this._addCells();
        this._addInstructions();

        _oContainer.regX = _oContainer.getBounds().width/2- INSTRUCTION_WIDTH -(CELL_WIDTH+11)/2;
        _oContainer.regY = _oContainer.getBounds().height/2-CELL_HEIGHT/2 - (_bTutorial?0:INSTRUCTION_HEIGHT_VERTICAL);

        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;

        if(s_bMobile){
            _oMask = new createjs.Shape();
            _oMask.graphics.beginFill("rgba(0,0,0,0)").drawRect(CANVAS_WIDTH/2 - (_oContainer.getBounds().width*CUR_GRID_SCALE)/2,CANVAS_HEIGHT/2 - (_oContainer.getBounds().height*CUR_GRID_SCALE)/2,(_oContainer.getBounds().width+11)*CUR_GRID_SCALE,_oContainer.getBounds().height*CUR_GRID_SCALE);
            s_oStage.addChild(_oMask);
            _oContainer.mask = _oMask;
        }
        
        _oBgGrid.graphics.beginFill("#7ac6ff").drawRoundRect(CANVAS_WIDTH/2 -20 - (_oContainer.getBounds().width*CUR_GRID_SCALE)/2,CANVAS_HEIGHT/2 -20 - (_oContainer.getBounds().height*CUR_GRID_SCALE)/2,40+(_oContainer.getBounds().width+11)*CUR_GRID_SCALE,40+_oContainer.getBounds().height*CUR_GRID_SCALE,30);

        this.show();
        this.refreshGridScale();
    };

    this.unload = function(){
        _aCells.forEach(element => {
            element.forEach(element => {
                element.unload();
            });
        });

        if(s_bMobile){
            s_oStage.removeChild(_oMask);
        }

        _oParentContainer.removeChild(_oContainer);
    };

    this._addCells = function(){
        _oCellsContainer = new createjs.Container();
        _oContainer.addChild(_oCellsContainer);
        
        _aCells = new Array();

        var iX = 11;
        var iY = 0;
        var bSolution = false;

        for(var i=0;i<_oLevel.iRows;i++){
            _aCells[i] = new Array();

            for(var j=0;j<_oLevel.iCols;j++){
                
                //Check if [i][j] is a solution
                bSolution = false;

                if(_oLevel.aSolutions[i].includes(j)){
                    bSolution = true;
                }

                //-----------------------------

                _aCells[i][j] = new CCell(iX,iY,i,j,_oCellsContainer, bSolution);
                _aCells[i][j].addEventListener(ON_MOUSE_UP, bSolution?this._onFill:this._onLock, this);

                iX += CELL_WIDTH+11;
            }

            iX = 11;
            iY += CELL_HEIGHT;
        }
    };

    this._addInstructions = function(){
        var iX;
        var iY;
        var szText;

        for(var r = 0; r<_oLevel.iRows; r++){
            iX = _aCells[r][0].getX() - CELL_WIDTH/2-11;
            iY =  _aCells[r][0].getY();

            szText = this._getInstructionText(true,r);
            
            _aRowInstructions[r] = new CInstruction(_oContainer, iX, iY, false, szText);
        }
        if(!_bTutorial){
            for(var c = 0; c<_oLevel.iCols; c++){
                iY = _aCells[0][c].getY() - CELL_HEIGHT/2;
                iX =  _aCells[0][c].getX();

                szText = this._getInstructionText(false,c);

                _aColInstructions[c] = new CInstruction(_oContainer, iX, iY, true, szText);
            }
        }
    };

    this._getInstructionText = function(bIsRow,iRow_Col){
        var szRes = "";

        if(bIsRow){
            for(var i=0; i<_oLevel.aRowInstructions[iRow_Col].length; i++){
                szRes += _oLevel.aRowInstructions[iRow_Col][i] + " ";
            }
            if(szRes == ""){
                this.fillRow(iRow_Col);
            }
        }
        else{
            szRes = "";
            for(var j=0; j<_oLevel.aColInstructions[iRow_Col].length; j++){
                szRes += _oLevel.aColInstructions[iRow_Col][j] + "\n";
            }
            szRes = szRes.slice(0,szRes.length-1);
            if(!_bTutorial){
                if(szRes == ""){
                    this.fillCol(iRow_Col);
                }
            }
        }
        
        return szRes;
    };

    this._onFill = function(iRow, iCol){
        if(_bTutorial == true){
            s_oTutorial.onCellGridClick();
        }

        if(this.checkCompletedRow(iRow)){
            this.setRowCompleted(iRow,true);
            playSound("instruction_complete",false);
            if(!_bTutorial && _bAutoFillRow){
                this.fillRow(iRow);
            }
        }

        if(this.checkCompletedCol(iCol)){
            this.setColCompleted(iCol,true);
            playSound("instruction_complete",false);
            if(!_bTutorial && _bAutoFillCol){
                this.fillCol(iCol);
            }
        }

        this.checkGridCompleted();
    }

    this._onLock = function(iRow, iCol){
        if(_bTutorial == true){
            s_oTutorial.onCellGridClick();
        }
        
        this.checkGridCompleted();
    }

    this.fillRow = function(iRow){
        for(var i=0; i<_oLevel.iCols; i++){
            _aCells[iRow][i].fill();
        }
    }
    this.fillCol = function(iCol){
        for(var i=0; i<_oLevel.iRows; i++){
            _aCells[i][iCol].fill();
        }
    }

    this.checkGridCompleted = function(){
        
        for(var i=0; i<_aRowInstructions.length; i++){
            if(!_aRowInstructions[i].isCompleted()){
                
                return;
            }
            if(!_bTutorial){
                if(!_aColInstructions[i].isCompleted()){
                    return;
                }
            }
        }
        
        if(s_oGame != null){
            s_oGame.gridCompleted();
        }else{
            s_oTutorial.gridCompleted();
        }
    }

    this.checkCompletedRow = function(iRow){
        var cont=0;
        var aResIntruction = new Array();

        for(var i=0; i<_oLevel.iCols; i++){
            if(_aCells[iRow][i].getCurrentState() == CELL_STATE_FILLED){
                cont++;
            }
            else if(cont > 0){
                
                aResIntruction.push(cont);
                cont = 0;
            }
        }

        if(cont > 0){
            aResIntruction.push(cont);
        }

        if(arraysMatch(aResIntruction, _oLevel.aRowInstructions[iRow])){
            return true;
        }

        return false;
    };

    this.checkCompletedCol = function(iCol){
        var cont=0;
        var aResIntruction = new Array();
        
        for(var i=0; i<_oLevel.iRows; i++){
            if(_aCells[i][iCol].getCurrentState() == CELL_STATE_FILLED){
                cont++;
            }
            else if(cont > 0){
                
                aResIntruction.push(cont);
                cont = 0;
            }
        }
        
        if(cont > 0){
            aResIntruction.push(cont);
        }

        if(arraysMatch(aResIntruction, _oLevel.aColInstructions[iCol])){
            return true;
        }

        return false;
    };

    this.reset = function(){
        
        _fMovementRatioZoom = 1;
        _pPanOffset    = {x: 0, y: 0};
        _pMaxPanOffset = {x: 0, y: 0};
        _oContainer.scale = CUR_GRID_SCALE;
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        
        _aRowInstructions.forEach(element => {
            element.setCompleted(false);
        });
        _aColInstructions.forEach(element => {
            element.setCompleted(false);
        });
        for(var i=0; i<_oLevel.iRows; i++){
            for(var j=0; j<_oLevel.iCols; j++){
                _aCells[i][j].setState(CELL_STATE_EMPTY);
                _aCells[i][j].activate();
            }
        }
        for(var i=0; i<_oLevel.iRows; i++){
            if(_aRowInstructions[i].isCompleted()){
                this.fillRow(i);
            }
            if(_aColInstructions[i].isCompleted()){
                this.fillCol(i);
            }
        }

        this.show();
    }

    this.show = function(){
        _oContainer.alpha = 0;
        _oContainer.visible = true;
        createjs.Tween.get(_oContainer)
        .wait(200)
        .to({alpha:1}, 1000);

        _oBgGrid.alpha = 0;
        _oBgGrid.visible = true;
        createjs.Tween.get(_oBgGrid)
        .wait(200)
        .to({alpha:1}, 1000);
    }

    this.hide = function(bUnload){
        createjs.Tween.get(_oBgGrid)
        .to({alpha:0.5}, 400)
        .call(function(){
            _oBgGrid.visible = false;   
        });

        createjs.Tween.get(_oContainer)
        .to({alpha:0.5}, 400)
        .call(function(){
            _oContainer.visible = false;
            if(bUnload){
                _oThis.unload();
            }
        });
    }

    this.refreshGridScale = function(){
        _oContainer.scaleX = _oContainer.scaleY = CUR_GRID_SCALE;
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        this._calculateMaxPanOffset();
        if(s_bMobile){
            _oMask.graphics.clear();
            _oMask.graphics.beginFill("rgba(0,0,0,0)").drawRect(CANVAS_WIDTH/2 - (_oContainer.getBounds().width*CUR_GRID_SCALE)/2 -2.5,CANVAS_HEIGHT/2 - (_oContainer.getBounds().height*CUR_GRID_SCALE)/2 -2.5,(_oContainer.getBounds().width+11)*CUR_GRID_SCALE +5,_oContainer.getBounds().height*CUR_GRID_SCALE +5);
        }

        _oBgGrid.graphics.clear();
        _oBgGrid.graphics.beginFill("#7ac6ff").drawRoundRect(CANVAS_WIDTH/2 -20 - (_oContainer.getBounds().width*CUR_GRID_SCALE)/2,CANVAS_HEIGHT/2 -20 - (_oContainer.getBounds().height*CUR_GRID_SCALE)/2,40+(_oContainer.getBounds().width+11)*CUR_GRID_SCALE,40+_oContainer.getBounds().height*CUR_GRID_SCALE,30);
    };

    this.pinchGrid = function(oInfo){
        _iScaleGrid = _oContainer.scale+oInfo.scale;

        if(_iScaleGrid < CUR_GRID_SCALE){
            _iScaleGrid = CUR_GRID_SCALE;
        }

        if(_iScaleGrid >2){
            _iScaleGrid = 2;
        }

        _oContainer.scale = _iScaleGrid;

        _fMovementRatioZoom = 1 + _oContainer.scale;

        this._calculateMaxPanOffset();
        _pPanOffset = this._checkLimitGridPos(_pPanOffset);
        _oContainer.x = CANVAS_WIDTH/2 + _pPanOffset.x;
        _oContainer.y = CANVAS_HEIGHT/2 + _pPanOffset.y;
    };
    
    this._calculateMaxPanOffset = function(){
        var oGridBounds = _oContainer.getBounds();
        var iGridHeight = oGridBounds.height;
        var iGridWidth = oGridBounds.width;

        _pMaxPanOffset.y = ((iGridHeight * _oContainer.scale) - (iGridHeight*CUR_GRID_SCALE))/2;
        _pMaxPanOffset.x = ((iGridWidth * _oContainer.scale) - (iGridWidth*CUR_GRID_SCALE))/2;
    };
    
    this._checkLimitGridPos = function(pPanOffset){
        if(pPanOffset.x > _pMaxPanOffset.x){
            pPanOffset.x = _pMaxPanOffset.x;
        }else if(pPanOffset.x < -_pMaxPanOffset.x){
            pPanOffset.x = -_pMaxPanOffset.x;
        }
    
        if(pPanOffset.y > _pMaxPanOffset.y){
            pPanOffset.y = _pMaxPanOffset.y;
        }else if(pPanOffset.y < -_pMaxPanOffset.y){
            pPanOffset.y = -_pMaxPanOffset.y;
        }
        return pPanOffset;
    };

    this.move = function(oPanVelocity){
        _pPanOffset.x += oPanVelocity.x * _fMovementRatioZoom;
        _pPanOffset.y += oPanVelocity.y * _fMovementRatioZoom;

        _pPanOffset = this._checkLimitGridPos(_pPanOffset);

        _oContainer.x = CANVAS_WIDTH/2 + _pPanOffset.x;
        _oContainer.y = CANVAS_HEIGHT/2 + _pPanOffset.y;
    };

    this.setRowCompleted = function(iRow, bCompleted){
        _aRowInstructions[iRow].setCompleted(bCompleted);
    };

    this.setColCompleted = function(iCol, bCompleted){
        _aColInstructions[iCol].setCompleted(bCompleted);
    };


    this.setChildIndex = function(iChildIndex){
        _oParentContainer.setChildIndex(_oContainer,iChildIndex);
        _oParentContainer.setChildIndex(_oBgGrid,iChildIndex);
    };

    this.getChildIndex = function(){
        _oParentContainer.getChildIndex(_oContainer);
    };

    this._init(oLevel, bTutorial, bAutoFillRow, bAutoFillCol);
}
