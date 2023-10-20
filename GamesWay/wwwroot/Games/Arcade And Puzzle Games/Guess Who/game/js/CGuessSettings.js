function CGuessSettings(){
    
    var _aQuestions;
    var _aCharacterLinkedtoQuestion;
    var _aCharacterNames;
    
    this._init = function(){
        this._initQuestions();
        this._initLinks();
        this._initNames();
    };
    
    this._initQuestions = function(){
        _aQuestions = new Array();
        _aQuestions[0] = TEXT_QUESTION_1;
        _aQuestions[1] = TEXT_QUESTION_2;
        _aQuestions[2] = TEXT_QUESTION_3;
        _aQuestions[3] = TEXT_QUESTION_4;
        _aQuestions[4] = TEXT_QUESTION_5;
        _aQuestions[5] = TEXT_QUESTION_6;
        _aQuestions[6] = TEXT_QUESTION_7;
        _aQuestions[7] = TEXT_QUESTION_8;
        _aQuestions[8] = TEXT_QUESTION_9;
        _aQuestions[9] = TEXT_QUESTION_10;
        _aQuestions[10] = TEXT_QUESTION_11;
        _aQuestions[11] = TEXT_QUESTION_12;
        _aQuestions[12] = TEXT_QUESTION_13;
        _aQuestions[13] = TEXT_QUESTION_14;
        _aQuestions[14] = TEXT_QUESTION_15;
    };
    
    this._initLinks = function(){
        _aCharacterLinkedtoQuestion = new Array();
        
        _aCharacterLinkedtoQuestion[0] = new Array(1,2,3,4,5,7,10,11,12,13,18,19,20,21,22,23);
        _aCharacterLinkedtoQuestion[1] = new Array(0,7,9,10,12,13,15,17,20);
        _aCharacterLinkedtoQuestion[2] = new Array(1,4,5,7,10,11,18,19);
        _aCharacterLinkedtoQuestion[3] = new Array(1,3,22);
        _aCharacterLinkedtoQuestion[4] = new Array(1,7,13,23);
        _aCharacterLinkedtoQuestion[5] = new Array(2,3,10,16,19,21);
        _aCharacterLinkedtoQuestion[6] = new Array(5,8,12);
        _aCharacterLinkedtoQuestion[7] = new Array(0,6,11,15);
        _aCharacterLinkedtoQuestion[8] = new Array(3,13,23);
        _aCharacterLinkedtoQuestion[9] = new Array(4,16);
        _aCharacterLinkedtoQuestion[10] = new Array(5,8,18);
        _aCharacterLinkedtoQuestion[11] = new Array(0,5,6,8,9,13,14,15,16,17,21);
        _aCharacterLinkedtoQuestion[12] = new Array(2,9,10,21,22);
        _aCharacterLinkedtoQuestion[13] = new Array(0,6,14,16);
        _aCharacterLinkedtoQuestion[14] = new Array(0,2,5,6,18,22);
    };
    
    this._initNames = function(){
        _aCharacterNames = new Array();
        
        _aCharacterNames[0] = "CHANTAL";
        _aCharacterNames[1] = "ERIC";
        _aCharacterNames[2] = "ALEX";
        _aCharacterNames[3] = "BOB";
        _aCharacterNames[4] = "PAUL";
        _aCharacterNames[5] = "FRANK";
        _aCharacterNames[6] = "ZOE";
        _aCharacterNames[7] = "JOE";
        _aCharacterNames[8] = "BUBA";
        _aCharacterNames[9] = "RITA";
        _aCharacterNames[10] = "RICK";
        _aCharacterNames[11] = "ANTOINE";
        _aCharacterNames[12] = "JOHN";
        _aCharacterNames[13] = "CHAP";
        _aCharacterNames[14] = "EVELYN";
        _aCharacterNames[15] = "LADY";
        _aCharacterNames[16] = "SAMANTHA";
        _aCharacterNames[17] = "JENNY";
        _aCharacterNames[18] = "JAVIER";
        _aCharacterNames[19] = "EVAN";
        _aCharacterNames[20] = "MATHIAS";
        _aCharacterNames[21] = "MICHAEL";
        _aCharacterNames[22] = "HANK";
        _aCharacterNames[23] = "VITO";
    };
    
    this.getQuestionsRelatedToCharacter = function(iCharacter){
        var aRet = new Array();
        for(var i=0;i<_aCharacterLinkedtoQuestion.length;i++){
            var aTmp = _aCharacterLinkedtoQuestion[i];
            for(var j=0;j<aTmp.length;j++){
                if(aTmp[j] === iCharacter){
                    aRet.push(i);
                    break;
                }
            }
        }
        
        return aRet;
    };
    
    this.getQuestion = function(iIndex){
        return _aQuestions[iIndex];
    };
    
    this.getCharacterLinked = function(iIndex){
        return _aCharacterLinkedtoQuestion[iIndex];
    };
    
    this.getCharacterName = function(iIndex){
        return _aCharacterNames[iIndex];
    };
    
    this.getNumQuestions = function(){
        return _aQuestions.length;
    };
    
    this.getQuestions = function(){
        return _aQuestions;
    };
    
    this._init();
}