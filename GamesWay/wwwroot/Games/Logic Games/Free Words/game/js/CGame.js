function CGame(oData){
    var _bUpdate = false;
    var _iScore;
    var _iTimeElaps;
    var _iWordGuessed;
    var _iIndexBonusWord;
    var _iAdCounter;
    var _aAvailableLetters;
    var _aWordsToGuess;
    var _aGuessedWords;
    var _aGuessedWordIndex;
   
    var _oWordList;
    var _oSolutionPanel;
    var _oInterface;
    
    var _oParent;

    this._init = function(){   
        _oWordList = new window["CLang"+s_iCurLanguage+"Wordlist"];

        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);
        
        _oSolutionPanel = new CSolutionPanel(BOARD_X,BOARD_Y,s_oStage);
        _oInterface = new CInterface();   

        this.reset();
    };
    
    this.unload = function(){
        _oInterface.unload();
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

        s_oGame = null;
    };
    
    this.reset = function(){
        _iIndexBonusWord = -1;
        _iScore = 0;
        _iWordGuessed = 0;
        _iAdCounter = 0;
        _iTimeElaps = TIME_LEVEL*1000;
        _aGuessedWordIndex = new Array();
        _aGuessedWords = new Array();
        
        this._extractWords();

        _oSolutionPanel.setWords(_aWordsToGuess,_iIndexBonusWord);
        _oInterface.setAvailableLetters(_aAvailableLetters);
        _oInterface.setScore(_iScore);
        
        setVolume("soundtrack",0.3);
        _bUpdate = true;
    };
    
    this.restart = function(){
        _oSolutionPanel.reset();
        _oInterface.reset();
        
        this.reset();  
    };
    
    this._extractWords = function(){
        var aConsonants = _oWordList.getConsonants();
        var aVowels = _oWordList.getVowel();
        
        do{
            _aAvailableLetters = new Array();
            _aWordsToGuess = new Array();
            
            for(var i=0;i<3;i++){
                var iRand = Math.floor(Math.random()*aConsonants.length);
                var szLetter = aConsonants[iRand];
                
                _aAvailableLetters.push(szLetter);
            }
            
            for(var i=0;i<3;i++){
                var iRand = Math.floor(Math.random()*aVowels.length);
                var szLetter = aVowels[iRand];
                
                _aAvailableLetters.push(szLetter);
            }
            _aWordsToGuess = this.findWords();    
            
        }while(_aWordsToGuess.length < MIN_NUM_WORDS || _aWordsToGuess.length > MAX_NUM_WORDS);
        
        //SORT LIST OF WORDS BY LENGTH
        _aWordsToGuess.sort(function(a, b) {
                        return a.length - b.length || // sort by length, if equal then
                               a.localeCompare(b);    // sort by dictionary order
                      });
        
        if(BONUS_MULTIPLIER > 0){
            //CHOOSE BONUS WORD
			var iRand = Math.floor(Math.random() *_aWordsToGuess.length);
            _iIndexBonusWord = iRand;
        }
    };

    this.findWords = function(){
        var aWordFound = new Array();
        var aList = _oWordList.getWordList();
        for(var i=0;i<aList.length;i++){
            var aLetters = this.copyArray(_aAvailableLetters);
            if(this.ifAllCharsInString(aList[i],aLetters)){
                aWordFound.push(aList[i]);
            }
        }
        
        return aWordFound;
    };
    
    this.ifAllCharsInString = function(szWord,aLetters){
        for(var k=0;k<szWord.length;k++){
            var szChar = szWord.charAt(k);
            var iIndex = aLetters.indexOf(szChar);

            if(iIndex === -1){
                return false;
            }
            aLetters.splice(iIndex,1);
        }
        
        return true;
    };
    
    this.copyArray = function(aArrayToCopy){
        //COPY AVAILABLE LETTERS
        var aCopyArray = new Array();
        for(var k=0;k<aArrayToCopy.length;k++){
            aCopyArray[k] = aArrayToCopy[k];
        }
        
        return aCopyArray;
    };
    
    this.verifyWord = function(szWord){
        var iIndex = _aWordsToGuess.indexOf(szWord);

        if(iIndex !== -1 && _aGuessedWords.indexOf(szWord) === -1){
            _oSolutionPanel.showWord(iIndex);
            _iWordGuessed++;
            _aGuessedWordIndex.push(iIndex);
            _aGuessedWords.push(szWord);
            
            var iScoreWord = POINT_PER_LETTER*szWord.length;

            if(iIndex === _iIndexBonusWord){
                //GET A BONUS SCORE
                _iScore += iScoreWord*BONUS_MULTIPLIER;
                playSound("bonus_word",1,false);
            }else{
                _iScore += iScoreWord;
                playSound("right",1,false);
            }
            _oInterface.wordGuessed(_iScore);
        }else{
            //NOT CORRECT WORD
            _oInterface.playWrongWordAnim();
            playSound("wrong",1,false);
        }
        
        if(_iWordGuessed !== _aWordsToGuess.length){
            _oInterface.restoreLetters();
        }else{
			_iTimeElaps = 0;
            _oInterface.stopTime();
			this._gameOver();
		}
    };
    
    this.setUpdate = function(bValue){
        _bUpdate = bValue;
        
        _oInterface.blockControls(!bValue);
    };
    
    this._gameOver = function(){
        _bUpdate = false;
        
        playSound("gameover",1,false);
        _oInterface.gameOver(_iScore);
        
        _oSolutionPanel.showAllWords(_aGuessedWordIndex);
    };
    
    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
    };

    this.update = function(){
        if(_bUpdate){
            _iTimeElaps -= s_iTimeElaps;
            
            if(_iTimeElaps < 0){
                _iTimeElaps = 0;
                _oInterface.stopTime();
                this._gameOver();
            }else{
                _oInterface.refreshTime(_iTimeElaps);
            }
            
        }
    };

    s_oGame=this;
    
    POINT_PER_LETTER = oData.point_per_char;
    BONUS_MULTIPLIER = oData.multiplier_bonus_word;
    TIME_LEVEL = oData.time_level;
    
    _oParent=this;
    this._init();
}

var s_oGame;
