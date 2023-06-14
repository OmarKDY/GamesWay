function CMain(oData){
    var _bUpdate;
    var _bGameUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oPreloader;
    var _oMenu;
    var _oLevelMenu;
    var _oSelectCarMenu;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);    
        s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage, true);
        
        s_bMobile = isMobile();
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.framerate = FPS;

        createjs.Ticker.on("tick",this._update);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
            DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();
        
        s_oLevelSettings = new CLevelSettings(); 
        
        //ADD PRELOADER
        _oPreloader = new CPreloader();

    };

    
    this.setLocalStorageLevel = function(iLevel){
        var iSavedLevel = getItem(GAME_NAME+"_level");
        if(iSavedLevel === null || iSavedLevel < iLevel){
            s_iLastLevel = iLevel;
            saveItem(GAME_NAME+"_level", s_iLastLevel);
        }
    };
    
    this.setLocalStorageScore = function(iCurScore,iLevel){
        saveItem(GAME_NAME+"_score_level_"+iLevel, iCurScore);
    };
    
	this.clearLocalStorage = function(){
        s_iLastLevel = 1;
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
	
    
    this.getScoreTillLevel = function(iLevel){
        if(!s_bStorageAvailable){
            return 0;
        }
        
        var iScore = 0;
        for(var i=0;i<iLevel-1;i++){
            iScore += parseInt(getItem(GAME_NAME+"_score_level_"+(i+1) ));
        }
        
        return iScore;
    };
    
    this.getScoreLevel = function(iLevel){
        return getItem(GAME_NAME+"_score_level_"+(iLevel+1) );
    };
    
    this.getSavedLevel = function(){
        if(!s_bStorageAvailable){
            return 1;
        }
        
        var iSavedLevel = getItem(GAME_NAME+"_level");
        if(iSavedLevel === null){
            return 1;
        }else{
            return iSavedLevel;
        }
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        
        _bGameUpdate = true;
        _bUpdate = true;
        
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);

        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'level_win',loop:false,volume:1, ingamename: 'level_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'crowd_idle',loop:false,volume:1, ingamename: 'crowd_idle'});
        s_aSoundsInfo.push({path: './sounds/',filename:'skiing_direction',loop:false,volume:1, ingamename: 'skiing_direction'});
        s_aSoundsInfo.push({path: './sounds/',filename:'falling',loop:false,volume:1, ingamename: 'falling'});
        s_aSoundsInfo.push({path: './sounds/',filename:'countdown',loop:false,volume:1, ingamename: 'countdown'});
        s_aSoundsInfo.push({path: './sounds/',filename:'go',loop:false,volume:1, ingamename: 'go'});
        s_aSoundsInfo.push({path: './sounds/',filename:'arrival',loop:false,volume:1, ingamename: 'arrival'});
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        
        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
        
    };  
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
        
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
        
        
    };



    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );
        
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_next","./sprites/but_next.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("msg_box_wide","./sprites/msg_box_wide.png");
        s_oSpriteLibrary.addSprite("msg_box_small","./sprites/msg_box_small.png");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("logo_ctl","./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_credits","./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("but_yes","./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no","./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png"); 
        s_oSpriteLibrary.addSprite("but_settings","./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_pause","./sprites/but_pause.png");
        s_oSpriteLibrary.addSprite("key_0","./sprites/key_0.png");
        s_oSpriteLibrary.addSprite("key_1","./sprites/key_1.png");
        s_oSpriteLibrary.addSprite("but_left","./sprites/but_left.png");
        s_oSpriteLibrary.addSprite("but_right","./sprites/but_right.png");
        s_oSpriteLibrary.addSprite("but_level","./sprites/but_level.png");
        s_oSpriteLibrary.addSprite("logo_menu","./sprites/logo_menu.png");
        s_oSpriteLibrary.addSprite("item_0","./sprites/item_0.png");
        s_oSpriteLibrary.addSprite("item_1","./sprites/item_1.png");
        s_oSpriteLibrary.addSprite("item_2","./sprites/item_2.png");
        s_oSpriteLibrary.addSprite("score_panel","./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("sponsor","./sprites/sponsor.png");
        s_oSpriteLibrary.addSprite("countdown_0","./sprites/countdown_0.png");
        s_oSpriteLibrary.addSprite("countdown_1","./sprites/countdown_1.png");
        s_oSpriteLibrary.addSprite("countdown_2","./sprites/countdown_2.png");
        s_oSpriteLibrary.addSprite("countdown_3","./sprites/countdown_3.png");
        s_oSpriteLibrary.addSprite("icon_score","./sprites/icon_score.png");
        s_oSpriteLibrary.addSprite("but_clear_save","./sprites/but_clear_save.png");
        
        for(var i=0;i<87;i++){
            s_oSpriteLibrary.addSprite("field_loop_"+i,"./sprites/field_loop/field_loop_"+i+".png");
        }
        
        for(var t=0;t<42;t++){
            s_oSpriteLibrary.addSprite("arrive_"+t,"./sprites/arrive/arrive_"+t+".png");
        }
        
        for(var i=0;i<30;i++){
            s_oSpriteLibrary.addSprite("player_falling_"+i,"./sprites/player/falling/player_falling_"+i+".png");
        }
        
        for(var i=0;i<70;i++){
            s_oSpriteLibrary.addSprite("player_arrival_"+i,"./sprites/player/arrival/player_arrival_"+i+".png");
        }
        
        for(var i=0;i<19;i++){
            s_oSpriteLibrary.addSprite("player_running_"+i,"./sprites/player/running/player_running_"+i+".png");
        }
        
        for(var i=0;i<8;i++){
            s_oSpriteLibrary.addSprite("player_left_"+i,"./sprites/player/turn_left/player_left_"+i+".png");
            s_oSpriteLibrary.addSprite("player_right_"+i,"./sprites/player/turn_right/player_right_"+i+".png");
        }
        
        for(var i=0;i<7;i++){
            s_oSpriteLibrary.addSprite("player_left_out_"+i,"./sprites/player/turn_left_out/player_left_out_"+i+".png");
            s_oSpriteLibrary.addSprite("player_right_out_"+i,"./sprites/player/turn_right_out/player_right_out_"+i+".png");
        }
        
        for(var i=0;i<45;i++){
            s_oSpriteLibrary.addSprite("tutorial_"+i,"./sprites/help/tutorial_"+i+".jpg");
        }
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);
    };
    
    this._onAllImagesLoaded = function(){
        
    };

    this._allResourcesLoaded = function(){
        _oPreloader.unload(); 
       
        try{
            saveItem("ls_available","ok");
            s_iLastLevel = this.getSavedLevel();
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        s_oSoundTrack = playSound("soundtrack", 1, true);

        s_oMain.gotoMenu();
    };

    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoLevelMenu = function(){
        _oLevelMenu = new CLevelMenu();
        _iState = STATE_MENU_LEVEL;
    };
    
    this.gotoSelectCar = function(){
        _oSelectCarMenu = new CMenuSelectCar();
        _iState = STATE_MENU_SELECT_CAR;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame();   
							
        _iState = STATE_GAME;
    };
    
    this.levelSelected = function(iLevel){
        s_iLevelSelected = iLevel;
        _oLevelMenu.unload();
        if(iLevel >= s_iLastLevel){
            s_iLastLevel = iLevel;
        }
        

        s_oMain.gotoGame(); 
    };
    
    this.stopUpdateNoBlockAndTick = function(){
        _bGameUpdate = false;
    };
    
    this.startUpdateNoBlockAndTick = function(){
        _bGameUpdate = true;
    };
    
    this.stopUpdateNoBlock = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
    };

    this.startUpdateNoBlock = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false; 
    };
    
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            Howler.mute(true);
        }
        
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(s_bAudioActive){
                Howler.mute(false);
            }
        }
        
    };
    
    this.isUpdating = function(){
        return _bUpdate;
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME && _bGameUpdate){
            _oGame.update();
        }
        
        if(s_oStage !== undefined){
            s_oStage.update(event);
        }
    };
    
    s_oMain = this;

    HERO_ACCELERATION = oData.hero_acceleration;
    HERO_FRICTION = oData.hero_friction;
    MAX_HERO_SPEED = oData.max_hero_speed;
    
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    
    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oSoundTrack = null;
var s_oDrawLayer;
var s_oStage;
var s_oMain = null;
var s_oSpriteLibrary;
var s_oLevelSettings;

var s_iLastLevel;
var s_iLevelSelected = 1;
var s_bFullscreen = false;
var s_bStorageAvailable = true;
var s_aSoundsInfo;