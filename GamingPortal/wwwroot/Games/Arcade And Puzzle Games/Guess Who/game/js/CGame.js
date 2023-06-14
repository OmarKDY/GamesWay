function CGame(oData){
    var _iScore;
    var _iPlayerCharacter;
    var _iCpuCharacter;
    var _iCurCpuQuestion;
    var _iSafeCounter;
    var _aPlayerQuestions;
    var _aCpuQuestions;
    var _aCpuCharacters;
    var _aPlayerCharacters;
    var _aCpuHistoryQuestion;
    
    var _oBg;
    var _oInterface;
    var _oEndPanel = null;
    
    this._init = function(){
        _iScore = 0;
        _iSafeCounter = 0;
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(_oBg);
        
        this._initCharacters();
        
        _oInterface = new CInterface();
        
        _aPlayerQuestions = new Array();
        _aCpuQuestions = new Array();
        for(var i=0;i<s_oGuessSettings.getNumQuestions();i++){
            _aPlayerQuestions[i] = {question:s_oGuessSettings.getQuestion(i),index:i};
            _aCpuQuestions[i] = {question:s_oGuessSettings.getQuestion(i),index:i};
        }
        
        _aCpuHistoryQuestion = new Array();
        $(s_oMain).trigger("start_level",1);
    };
    
    this.unload = function(){
        for(var i=0; i<_aCpuCharacters.length;i++){
            _aCpuCharacters[i].unload();
        }
        
        if(_oEndPanel){
            _oEndPanel.unload();
        }
        _oInterface.unload();
        
        s_oStage.removeAllChildren();  
    };
    
    this._initCharacters = function(){
        _aCpuCharacters = new Array();
        
        var oCharacter;
        var iX = 301;
        var iY = 12;
        for(var i=0;i<NUM_CHARACTER;i++){
            oCharacter = new CCharacter(iX,iY,i,s_oGuessSettings.getCharacterName(i));
            oCharacter.addEventListener(ON_MOUSE_UP, this._onCharacterRelease, this);
            
            _aCpuCharacters[i] = oCharacter;
            
            if( ( (i+1)%6) === 0){
                iX = 301;
                iY += 165;
            }else{
                iX += 127;
            } 
        }
        
        _aPlayerCharacters = new Array();
        
        var oSprite = s_oSpriteLibrary.getSprite('character_mini');
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: oSprite.width/4, regY: oSprite.height/2}, 
                        animations: {  enable: [0],disable: [1]}
                   };
        
        var oObjSpriteSheet = new createjs.SpriteSheet(oData);
        
        var iXPos = 1108;
        var iYPos = 640;
        for(var i=0;i<NUM_CHARACTER;i++){
            var oCharacter = createSprite(oObjSpriteSheet, "enable", oSprite.width/4,oSprite.height/2,oSprite.width/2, oSprite.height);
            oCharacter.x = iXPos;
            oCharacter.y = iYPos;
            s_oStage.addChild(oCharacter);
            
            _aPlayerCharacters[i] = oCharacter;
            
            if( ( (i+1)%6) === 0){
                iXPos = 1108;
                iYPos += 32;
            }else{
                iXPos += 32;
            }
            
        }
    };
    
    this.checkIfCharacterInArray = function(iIndexToFind,aList){

        for(var i=0;i<aList.length;i++){
            if(iIndexToFind === aList[i]){
                return true;
            }
        }
        
        return false;
    };
    
    this.findDeselectedCharacter = function(){
        var iCont = 0;
        for(var k=0;k<NUM_CHARACTER;k++){
            if(_aCpuCharacters[k].isUnselectable() === false){
                iCont++;
            }
        }
        
        return iCont;
    };
    
    this.playerAskQuestion = function(iCurQuestion,iQuestionIndex){
        var aCharacters = s_oGuessSettings.getCharacterLinked(iQuestionIndex);
        var bFound = this.checkIfCharacterInArray(_iCpuCharacter,aCharacters);
        
        var iNumSelectable = this.findDeselectedCharacter();
        
        var iNumCharacterDeselected = 0;
        if(bFound){
            for(var k=0;k<_aCpuCharacters.length;k++){
                if( this.checkIfCharacterInArray(k,aCharacters) === false && _aCpuCharacters[k].isUnselectable() === false ){
                   _aCpuCharacters[k].unselect();
                   iNumCharacterDeselected++;
                   
                }
            }
        }else{
            for(var k=0;k<aCharacters.length;k++){
                if(_aCpuCharacters[aCharacters[k]].isUnselectable() === false){
                    _aCpuCharacters[aCharacters[k]].unselect();
                    iNumCharacterDeselected++;
                }
            }
        }

        var iPerc = (iNumCharacterDeselected * 100)/iNumSelectable;
        
        if(iPerc > 60){
            _oInterface.showEncouragement(TEXT_ENCOURAGEMENT_3);
            _iScore += 100;
        }else if (iPerc > 40){
            _oInterface.showEncouragement(TEXT_ENCOURAGEMENT_2);
            _iScore += 40;
        }else if(iPerc > 26){
            _oInterface.showEncouragement(TEXT_ENCOURAGEMENT_1);
            _iScore += 10;
        }
        
        _oInterface.refreshScore(_iScore);

        //REMOVE THIS QUESTION FROM LIST
        _aPlayerQuestions.splice(iCurQuestion,1);
        
        if(this.checkIfPlayerWins()){
            this._win();
        }else{
            var oParent = this;
            setTimeout(function(){oParent.cpuAskQuestion()},TIME_CPU_QUESTION);
        }
        
    };

    this.cpuAskQuestion = function(){
        //CHOOSE A QUESTION FOR CPU
        var iRand;
        do{
            iRand = Math.floor((Math.random() * _aPlayerCharacters.length));
        }while(_aPlayerCharacters[iRand].currentAnimation === "disable");
        var aIndexes = s_oGuessSettings.getQuestionsRelatedToCharacter(iRand);

        //CLEAR INDEXES ARRAY
        var aNewIndexes = new Array();
        for(var i=0;i<aIndexes.length;i++){
            var bFound = false;
            for(var j=0;j<_aCpuHistoryQuestion.length;j++){
                if(aIndexes[i] === _aCpuHistoryQuestion[j]){
                    bFound = true;
                    break;
                }
            }
            
            if(bFound === false){
                aNewIndexes.push(aIndexes[i]);
            }
        }

        ///IF NOT RELATED QUESTION ARE FOUND, REPEAT THE OPERATION
        if(aNewIndexes.length === 0){
            if(_iSafeCounter < 50){
                s_oGame.cpuAskQuestion();
                _iSafeCounter++;
                return;
            } else {
                /// JUST ASK A RANDOM QUESTION;
                _iSafeCounter = 0;
                aNewIndexes = aIndexes;
            }
        };
        
        iRand = Math.floor((Math.random() * aNewIndexes.length));
        ///////////////////////////////////////////////
        _iCurCpuQuestion = _aCpuQuestions[aNewIndexes[iRand]].index;
        
        _oInterface.showCpuPanel(_aCpuQuestions[aNewIndexes[iRand]].question);
        
        _aCpuHistoryQuestion.push(_iCurCpuQuestion);
        //_aCpuQuestions.splice(aIndexes[iRand],1);
    };
    
    this.checkIfPlayerReplyIsCorrect = function(bReply){
        var aCharacters = s_oGuessSettings.getCharacterLinked(_iCurCpuQuestion);

        var bFound = this.checkIfCharacterInArray(_iPlayerCharacter,aCharacters);

        if(bFound !== bReply){
            //USER GAVE THE WRONG ANSWER
            _oInterface.showWrongReply();
        }else{
            if(bFound){
                for(var k=0;k<_aPlayerCharacters.length;k++){
                    if( this.checkIfCharacterInArray(k,aCharacters) === false ){
                        _aPlayerCharacters[k].gotoAndStop("disable");
                    }
                }
            }else{
                for(var k=0;k<aCharacters.length;k++){
                    _aPlayerCharacters[aCharacters[k]].gotoAndStop("disable");
                }
            }
            
            _oInterface.hideCpuPanel();
            
            if(this.checkIfCpuWins()){
                this._gameOver();
            }else{
                _oInterface.enableQuestionGUI();
            }
            
        }
        
    };
    
    this.disableCharacter = function(){
        for(var i=0;i<NUM_CHARACTER;i++){
            _aCpuCharacters[i].disable();
        }
    };
    
    this.enableCharacter = function(){
        for(var i=0;i<NUM_CHARACTER;i++){
            _aCpuCharacters[i].enable();
        }
    };
    
    this.checkIfPlayerWins = function(){
        var iNum = 0;
        for(var i=0;i<NUM_CHARACTER;i++){
            if(_aCpuCharacters[i].isUnselectable() === false){
                iNum++;
            }
        }
        
        if(iNum === 1){
            return true;
        }else{
            return false;
        }
    };
    
    this.checkIfCpuWins = function(){
      var iNum = 0;
      for(var i=0;i<NUM_CHARACTER;i++){
          if(_aPlayerCharacters[i].currentAnimation !== "disable"){
              iNum++;
          }
      }
      
      if(iNum === 1){
            return true;
        }else{
            return false;
        }
    };
    
    this._gameOver = function(){  
        playSound("gameover",1,false);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(TEXT_LOSE,TEXT_YOUR_CHARACTER,_iPlayerCharacter,_iScore);
        $(s_oMain).trigger("end_level",1);
    };
    
    this._win = function(){
        playSound("win",1,false);
        
        _iScore += 500;
        _oInterface.refreshScore(_iScore);
        
        _oEndPanel = new CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(TEXT_WIN,TEXT_CPU_CHARACTER,_iCpuCharacter,_iScore);
    };
    
    this.chooseCharactersToGuess = function(iIndex){
        _iPlayerCharacter = iIndex;
        
        //CHOOSE CPU CHARACTER
        _iCpuCharacter = Math.floor((Math.random() * (NUM_CHARACTER-1)));
        _oInterface.setCharacters(_iPlayerCharacter);
        
        this.disableCharacter();
    };
    
    this._onCharacterRelease = function(iIndex){
        this.chooseCharactersToGuess(iIndex);
        
        _oInterface.showMsgBox(TEXT_PLAYER_TURN);
        
        _oInterface.enableQuestionGUI();
    };

    this.onExit = function(){
        this.unload();
        $(s_oMain).trigger("end_session");
        
        s_oMain.gotoMenu();
    };
    
    this.getPlayerQuestions = function(iIndex){
        return _aPlayerQuestions[iIndex];
    };
    
    this.getNumPlayerQuestions = function(){
        return _aPlayerQuestions.length;
    };


    s_oGame=this;
    
    TIME_CPU_QUESTION = oData.time_cpu_question;
    
    this._init();
}

var s_oGame;