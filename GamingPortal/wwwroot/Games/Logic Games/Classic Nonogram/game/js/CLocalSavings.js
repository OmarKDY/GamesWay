
function clearLocalStorage(){
    s_iTotalScore = 0;
    if(s_bStorageAvailable){
        var iCont = 0;
        while(iCont < localStorage.length){
            var szKey = localStorage.key(iCont);
            if(szKey.indexOf(GAME_NAME) !== -1){
                localStorage.removeItem(szKey);
            }else{
                iCont++;
            }
        }
    }
};

//clearLocalStorage();
//FIRST GAME-----------------------------------
function setLocalStorageFirstGame(bFirstGame){
    if(!s_bStorageAvailable){
        return;
    }
    saveItem(GAME_NAME+"_first_game", bFirstGame);
};

function isFirstGame(){
    if(!s_bStorageAvailable){
        return;
    }
    var bFirstGame = getItem(GAME_NAME+"_first_game");
    if(bFirstGame === null){
        return true;
    }else{
        return false;
    }
};
//LEVEL SCORE-----------------------------------
function setLocalStorageScore(iCurScore,iDiff,iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    saveItem(GAME_NAME+"_score_diff_"+iDiff+"_level_"+iLevel, iCurScore);
};

function getLevelScore(iDiff,iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }
    
    var iScore = getItem(GAME_NAME+"_score_diff_"+iDiff+"_level_"+iLevel);
    if(iScore){
        return iScore;
    }else{
        return 0;
    }
}

//TOTAL SCORE-----------------------------------
function getScoreTillLevel(iDiff,iLevel){
    if(!s_bStorageAvailable){
        return 0;
    }

    var iScore = 0;
    
    for(var i=0;i<=iLevel;i++){
        iScore += parseInt(getItem(GAME_NAME+"_score_diff_"+iDiff+"_level_"+i));
    }

    return iScore;
};

//LAST LEVEL-----------------------------------
function setLocalStorageLevel(iDiff,iLevel){
    if(!s_bStorageAvailable){
        return;
    }
    var iSavedLevel = getItem(GAME_NAME+"_diff_"+iDiff+"_level");
    if(iSavedLevel === null || iSavedLevel < iLevel){
        s_iLastLevel = iLevel;
        saveItem(GAME_NAME+"_diff_"+iDiff+"_level", s_iLastLevel);
    }
};

function getSavedLevel(iDiff){
    if(!s_bStorageAvailable){
        return 0;
    }

    var iSavedLevel = getItem(GAME_NAME+"_diff_"+iDiff+"_level");
    if(iSavedLevel === null){
        return -1;
    }else{
        return iSavedLevel;
    }
};