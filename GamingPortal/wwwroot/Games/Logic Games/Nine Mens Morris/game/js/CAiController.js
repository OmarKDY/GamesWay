function CAiController(){
    
    var _aEvaluator;
    
    this.evaluateInPlacingState = function(aPoints,iCurTurn,iNumPiecesOnBoard){
        if(iNumPiecesOnBoard === 0){
            var aRet = [];
            
            if(aPoints[0].getState() === -1){
                aRet.push(0);
            }
            
            if(aPoints[2].getState() === -1){
                aRet.push(2);
            }
            
            if(aPoints[21].getState() === -1){
                aRet.push(21);
            }
            
            if(aPoints[23].getState() === -1){
                aRet.push(23);
            }
            
            return aRet[Math.floor(Math.random()*aRet.length)];
        }else{
            this.initEvaluatorPoint();
        
            for(var i=0;i<aPoints.length;i++){
                if(aPoints[i].getState() === -1){
                    //EVALUATE THIS EMPTY POINT
                    var aPossibleMills = s_oBoardSettings.getPossibleMillsPerPoint(i);
                    for(var j=0;j<aPossibleMills.length;j++){
                        var iMill = aPossibleMills[j];

                        var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);

                        var aMillValues = new Array();
                        for(var k=0;k<aPointList.length;k++){
                            aMillValues[k] = aPoints[aPointList[k]].getState();
                        }

                        //CHECK ALL POSSIBLE CASES
                        _aEvaluator[i] += this._evaluateValuesInMill(aMillValues,iCurTurn);
                    }
                }
            }


            return this.findBestPointAfterEvaluation();
        }
    };
    
    this.evaluateInMovState = function(aPoints,iCurTurn,aAiPieces){
        this.initEvaluatorPoint();
        
        var aPossiblePieceToMove = new Array();
        for(var i=0;i<_aEvaluator.length;i++){
            aPossiblePieceToMove[i] = {piece:null,value:0};
        }

        //CHECK IF CPU CAN MOVE FROM AN EXISTING MILL 
        for(var i=0;i<aPoints.length;i++){
            if(aPoints[i].isInMill() && aPoints[i].getState() === iCurTurn){
                
                var iMill = aPoints[i].getMill();
            
                var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);
        
                for(var j=0;j<aPointList.length;j++){
                    //CHECK IF CAN MOVE ANY OF THE PIECE IN THE MILL
                    var aAdj = s_oBoardSettings.getAdjacentsPerPoint(aPointList[j]);
                
                    var iEndPoint = null;
                    for(var k=0;k<aAdj.length;k++){
                        if(aPoints[aAdj[k]].getState() === -1 && this._checkIfPointIsReachableBy(aPointList[j],null,aPoints,s_oGame.getOpponentTurn()) === false){
                            iEndPoint = aAdj[k];
                   
                            break;
                        }
                    }
                    
                    if(iEndPoint !== null){
                        return {piece:aPoints[aPointList[j]].getPiece(),end:iEndPoint};
                    }
                }
            }
        }
        
        if(aAiPieces.length === 3){
            var aMillWith1Piece = new Array();
            var aEmptyMills = new Array();
            //CHECK IF THERE IS A MILL WITH JUST 2 BLACKS
            var aMillList = s_oBoardSettings.getMillList();
            for(var i=0;i<aMillList.length;i++){
                var aPointList = aMillList[i];
                var iTurnPieces = 0;
                var iOpponentPieces = 0;
                for(var j=0;j<aPointList.length;j++){

                    if(aPoints[aPointList[j]].getState() === iCurTurn){
                        iTurnPieces++;
                    }else if(aPoints[aPointList[j]].getState() !== -1){
                        iOpponentPieces++;
                    }
                }


                if(iOpponentPieces === 0){
                    if(iTurnPieces === 2){
                        var oPiece;
                        
                        for(var k=0;k<aAiPieces.length;k++){
                            if(aPointList.indexOf(aAiPieces[k].getPointIndex() ) === -1){
                                oPiece = aPoints[aAiPieces[k].getPointIndex()].getPiece();
                                break;
                            }
                        }
                        var iEndPoint;
                        for(var k=0;k<aPointList.length;k++){
                            if(aPoints[aPointList[k]].getState() === -1){
                                iEndPoint = aPointList[k];
                                break;
                            }
                        }

                        return {piece:oPiece,end:iEndPoint};
                    }else if(iTurnPieces === 1){
                        aMillWith1Piece.push(i);
                    }else{
                        aEmptyMills.push(1);
                    }
                }
                
                
            }
            
            
            if(aMillWith1Piece.length>0){
             
                var aPointList = s_oBoardSettings.getMillListPerIndex(aMillWith1Piece[0]);
                for(var k=0;k<aAiPieces.length;k++){
             
                    if(aPointList.indexOf(aAiPieces[k].getPointIndex() ) === -1){
                        oPiece = aPoints[aAiPieces[k].getPointIndex()].getPiece();
                        break;
                    }
                }
                var iEndPoint;
                for(var k=0;k<aPointList.length;k++){
                    if(aPoints[aPointList[k]].getState() === -1){
                        iEndPoint = aPointList[k];
                        break;
                    }
                }
            
                return {piece:oPiece,end:iEndPoint};
            }else{
                
                var aPointList = s_oBoardSettings.getMillListPerIndex(aEmptyMills[0]);
                return {piece:aPoints[aAiPieces[Math.floor(Math.random()*aAiPieces.length)].getPointIndex()].getPiece(),
                        end:aPointList[Math.floor(Math.random()*aPointList.length)]};
            }
        }
        
        
        for(var i=0;i<aPoints.length;i++){
            var oPiece = aPoints[i].getPiece();
            //CHECK IF PIECE BELONGS TO THE CURRENT PLAYER
            if(oPiece !== null && oPiece.getType() === iCurTurn){
                    var aAdjacents = s_oBoardSettings.getAdjacentsPerPoint(i);
                    
                    //FIND FREE ADJACENT POINTS EVENTUALLY
                    for(var j=0;j<aAdjacents.length;j++){
                        if(aPoints[aAdjacents[j]].getState() === -1){
                            //GET ALL POSSIBLE MILLS OF A POINT
                            var aPossibleMills = s_oBoardSettings.getPossibleMillsPerPoint(aAdjacents[j]);
                            for(var k=0;k<aPossibleMills.length;k++){
                                var iMill = aPossibleMills[k];

                                var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);
                                //IGNORE MILLS THAT INVOLVED THE POINT
                                if(aPointList.indexOf(i) === -1){
                                    var aMillValues = new Array();
                                    for(var t=0;t<aPointList.length;t++){
                                        aMillValues[t] = aPoints[aPointList[t]].getState();
                                    }

                                    //CHECK ALL POSSIBLE CASES
                                    var iValue = this._evaluateValuesInMill(aMillValues,iCurTurn);
                                    
                                    if(aPossiblePieceToMove[aAdjacents[j]].value < iValue){
                                        aPossiblePieceToMove[aAdjacents[j]] = {piece:oPiece,value:iValue};
                                    }
                                    
                                    _aEvaluator[aAdjacents[j]] += iValue;
                                    //trace("iValue "+iValue)
                                    //trace("_aEvaluator["+aAdjacents[j]+"] "+_aEvaluator[aAdjacents[j]])
                                }
                            }
                        }

                        
                        
                    }

            }
        }
        
        //trace(_aEvaluator)
        var iEndPoint = this.findBestPointAfterEvaluation();
        //trace("iEndPoint "+iEndPoint)
        //trace("iStart"+(aPossiblePieceToMove[iEndPoint].piece).getPointIndex())
        
        //CHECK IF THIS MOVE IS REALLY THE BEST ONE:
        //1) CHECK IF, LEAVING THIS POSITION, OPPONENT HAS A CHANCE TO GET A TRIS
        //2) CHECK IF IS THE DESTINATION POINT IS REACHABLE FROM THE OPPONENT
        var oPiece = aPossiblePieceToMove[iEndPoint].piece;
        while(_aEvaluator[iEndPoint] < 6 && (this._evaluatePointInBoard(oPiece.getPointIndex(),aPoints) === true || 
                                this._checkIfPointIsReachableBy(oPiece.getPointIndex(),iEndPoint,aPoints,s_oGame.getOpponentTurn()) === true) ){
                            
            _aEvaluator[iEndPoint] = 0;
            
            if(this._checkIfEvaluatorIsEmpty() ){
                break;
            }
            
            iEndPoint = this.findBestPointAfterEvaluation();
            oPiece = aPossiblePieceToMove[iEndPoint].piece;
            //trace("iEndPoint "+iEndPoint)
        }
        

        //trace("iStartPoint "+oPiece.getPointIndex());
        return {piece:oPiece,end:iEndPoint};
    };

    
    this._evaluatePointInBoard = function(iPointIndex,aPoints){
        //EVALUATE THIS EMPTY POINT
        var aPossibleMills = s_oBoardSettings.getPossibleMillsPerPoint(iPointIndex);
        for(var j=0;j<aPossibleMills.length;j++){
            var iMill = aPossibleMills[j];

            var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);

            var iCont = 0;
            for(var k=0;k<aPointList.length;k++){
            
                if(aPoints[aPointList[k]].getState() === s_oGame.getOpponentTurn()){
                    iCont++;
                }
            }
           
            //CHECK ALL POSSIBLE CASES
            if(iCont>=2){
                //trace("_evaluatePointInBoard is TRUE")
                return true;
            }
            
        }
        //trace("_evaluatePointInBoard is FALSE")
        return false;
    };
    
    this.initEvaluatorPoint = function(){
        _aEvaluator = new Array();
        for(var i=0;i<NUM_BOARD_POINTS;i++){
            _aEvaluator[i] = 0;
        }        
       
    };
    
    this._evaluateValuesInMill = function(aMillValues,iCurTurn){
        var iTurnPieces = 0;
        var iOpponentPieces = 0;
        for(var t=0;t<aMillValues.length;t++){
            if(aMillValues[t] === iCurTurn){
                iTurnPieces++;
            }else if(aMillValues[t] !== -1){
                iOpponentPieces++;
            }
        }
        
        
        
        if( (iTurnPieces === 2 && iOpponentPieces === 1) || (iTurnPieces === 1 && iOpponentPieces === 2)){
            return 0;
        }else if(iTurnPieces >= 2){
            return 7;
        }else if(iOpponentPieces >= 2){
            return 6;
        }else if( iTurnPieces === 1 && iOpponentPieces === 1){
            return 1;
        }else if(iTurnPieces === 1){
            return 4;
        }else if(iOpponentPieces === 1){
            return 3;
        }else{
            return 2;
        }
    };
    /*
    this._evaluateValuesInMillIfFlyingState = function(aMillValues,iCurTurn,aPointList,iCurPiecePoint){
        var iTurnPieces = 0;
        var iOpponentPieces = 0;
        for(var t=0;t<aMillValues.length;t++){
            if(aMillValues[t] === iCurTurn && aPointList.indexOf(iCurPiecePoint) === -1){
                iTurnPieces++;
            }else if(aMillValues[t] !== -1){
                iOpponentPieces++;
            }
        }
        
        if( (iTurnPieces === 2 && iOpponentPieces === 1) || (iTurnPieces === 1 && iOpponentPieces === 2)){
            return 0;
        }else if(iTurnPieces >= 2){
            return 7;
        }else if(iOpponentPieces >= 2){
            return 0;
        }else if( iTurnPieces === 1 && iOpponentPieces === 1){
            return 0;
        }else if(iTurnPieces === 1){
            return 4;
        }else if(iOpponentPieces === 1){
            return 0;
        }else{
            return 1;
        }
    };*/
    
    this.chooseOpponentPieceToRemove = function(aPoints,aRemoveablePoints,iCurTurn){
        this.initEvaluatorPoint();
        
        for(var i=0;i<aRemoveablePoints.length;i++){
            var aPossibleMills = s_oBoardSettings.getPossibleMillsPerPoint(aRemoveablePoints[i]);
                for(var j=0;j<aPossibleMills.length;j++){
                    var iMill = aPossibleMills[j];
                    
                    var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);

                    var aMillValues = new Array();
                    for(var k=0;k<aPointList.length;k++){
                        aMillValues[k] = aPoints[aPointList[k]].getState();
                    }

                    //CHECK ALL POSSIBLE CASES
                    _aEvaluator[aRemoveablePoints[i]] += this._evaluateValuesInMill(aMillValues,iCurTurn);
                }
        }
        
        return this.findBestPointAfterEvaluation();
    };
    
    this.findBestPointAfterEvaluation = function(){
        //FIND BEST POINT EVALUATION
        var iMin = _aEvaluator[0];
        var iMinIndex = 0;
        
        var iMax = 0;
        var iMaxIndex = 0;
        for(var i=0;i<_aEvaluator.length;i++){
            if(_aEvaluator[i] < iMin){
                iMin = _aEvaluator[i];
                iMinIndex = i;
            }else if(_aEvaluator[i] > iMax){
                iMax = _aEvaluator[i];
                iMaxIndex = i;
            }
        }
        
    
        if(iMinIndex === iMaxIndex){
            return Math.floor(Math.random()*_aEvaluator.length);
        }else{
            return iMaxIndex;
        }
    };
    
    this._checkIfPointIsReachableBy = function(iStartPoint,iEndPoint,aPoints,iTurn){
        var aPossibleMills = s_oBoardSettings.getPossibleMillsPerPoint(iStartPoint);
        var aAdjacents = s_oBoardSettings.getAdjacentsPerPoint(iStartPoint);
        
        for(var i=0;i<aPossibleMills.length;i++){
            var iMill = aPossibleMills[i];
            
            var aPointList = s_oBoardSettings.getMillListPerIndex(iMill);

            //IGNORE MILLS THAT INVOLVED THE POINT
            if(iEndPoint !== null && aPointList.indexOf(iEndPoint) === -1){

                //CHECK IF CURRENT MILL HAS 2 OPPONENT PIECES
                var iCont = 0;
                for(var j=0;j<aPointList.length;j++){
                    if(aPoints[aPointList[j]].getState() === iTurn){
                        iCont++;
                    }
                }
                
                if(iCont === 2){
                    for(var k=0;k<aAdjacents.length;k++){
                       
                        if(aPoints[aAdjacents[k]].getState() === iTurn && aPointList.indexOf(aAdjacents[k]) === -1){
                            //trace("_checkIfPointIsReachableBy IS TRUE")
                            return true;
                        }
                    }
                }
                 
            }
        }
        
        //trace("_checkIfPointIsReachableBy IS FALSE")
        return false;
    };
    
    this._checkIfEvaluatorIsEmpty = function(){
        for(var k=0;k<_aEvaluator.length;k++){
            if(_aEvaluator[k] > 0){
                return false;
            }
        }
        
        return true;
    };
}


var s_oAi;