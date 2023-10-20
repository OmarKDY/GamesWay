function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;
    var _oLevelChoose;

    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
	s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage, true);

        canvas.opacity = 0.5;

        s_bMobile = isMobile();
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
            $('body').on('contextmenu', '#canvas', function (e) {
                return false;
            });
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();

        _bUpdate = true;
    };

    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

        if (_iCurResource === RESOURCE_TO_LOAD) {
            //this._onRemovePreloader();
        }
    };

    this._initSounds = function () {
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_win',loop:false,volume:1, ingamename: 'game_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'barrel',loop:false,volume:1, ingamename: 'barrel'});
        s_aSoundsInfo.push({path: './sounds/',filename:'block_explosion',loop:false,volume:1, ingamename: 'block_explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wood_explosion',loop:false,volume:1, ingamename: 'wood_explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'bouncing_cheese',loop:false,volume:1, ingamename: 'bouncing_cheese'});
        s_aSoundsInfo.push({path: './sounds/',filename:'player_angry',loop:false,volume:1, ingamename: 'player_angry'});
        s_aSoundsInfo.push({path: './sounds/',filename:'player_eating',loop:false,volume:1, ingamename: 'player_eating'});
        s_aSoundsInfo.push({path: './sounds/',filename:'player_sleeping',loop:false,volume:1, ingamename: 'player_sleeping'});
        s_aSoundsInfo.push({path: './sounds/',filename:'player_wakeup',loop:false,volume:1, ingamename: 'player_wakeup'});
        s_aSoundsInfo.push({path: './sounds/',filename:'strawberry',loop:false,volume:1, ingamename: 'strawberry'});

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

    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);
        
        for (var i = 0; i < 247; i++) {
            s_oSpriteLibrary.addSprite("player_"+i, "./sprites/player_anim/player_anim_" + i + ".png");
        };

        s_oSpriteLibrary.addSprite("bg", "./sprites/bg.jpg");
        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("but_settings", "./sprites/but_settings.png");
        s_oSpriteLibrary.addSprite("but_help", "./sprites/but_help.png");
        s_oSpriteLibrary.addSprite("but_info", "./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("but_continue", "./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("but_yes", "./sprites/but_yes.png");
        s_oSpriteLibrary.addSprite("but_no", "./sprites/but_no.png");
        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box_big", "./sprites/msg_box_big.png");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("level_sprite", "./sprites/level_sprite.png");  
        s_oSpriteLibrary.addSprite("star", "./sprites/star.png");
        s_oSpriteLibrary.addSprite("starbox", "./sprites/starbox.png");
        s_oSpriteLibrary.addSprite("arrow_select_level_right", "./sprites/arrow_select_level_right.png");
        s_oSpriteLibrary.addSprite("arrow_select_level_left", "./sprites/arrow_select_level_left.png");
        s_oSpriteLibrary.addSprite("stone_ball", "./sprites/stone_ball.png");
        s_oSpriteLibrary.addSprite("wood_1", "./sprites/wood_1.png");
        s_oSpriteLibrary.addSprite("wood_2", "./sprites/wood_2.png");
        s_oSpriteLibrary.addSprite("wood_2_broken", "./sprites/wood_2_broken.png");
        s_oSpriteLibrary.addSprite("ball", "./sprites/ball.png");
        s_oSpriteLibrary.addSprite("block_1", "./sprites/block_1.png");
        s_oSpriteLibrary.addSprite("block_2", "./sprites/block_2.png");
        s_oSpriteLibrary.addSprite("coin_score", "./sprites/coin_score.png");
        s_oSpriteLibrary.addSprite("coin", "./sprites/coin.png");
        s_oSpriteLibrary.addSprite("help_hand", "./sprites/help_hand.png");
        s_oSpriteLibrary.addSprite("logo_menu", "./sprites/logo_menu.png");        
        s_oSpriteLibrary.addSprite("hole", "./sprites/hole.png");
        s_oSpriteLibrary.addSprite("progress_bar", "./sprites/progress_bar.png");
        s_oSpriteLibrary.addSprite("but_restart_small", "./sprites/but_restart_small.png");
        
        for (var i = 0; i < 4; i++) {
            s_oSpriteLibrary.addSprite("prop_"+i, "./sprites/prop_" + i + ".png");
        };
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);
        if (_iCurResource === RESOURCE_TO_LOAD) {
            //this._onRemovePreloader();
        }
    };

    this._onAllImagesLoaded = function () {

    };

    this.onAllPreloaderImagesLoaded = function () {
        this._loadImages();
    };

    this.preloaderReady = function () {
        this._loadImages();
        
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        _bUpdate = true;
    };

    this._onRemovePreloader = function(){
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }

        _oPreloader.unload();

        s_oSoundTrack = playSound("soundtrack", 1, true);            

        this.gotoMenu();
    };

    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoLevelChoose = function () {
        _oLevelChoose = new CLevelChoose();
        _iState = STATE_LEVEL;
    };
    
    this.gotoGame = function (iLevel) {
        _oGame = new CGame(iLevel);
        _iState = STATE_GAME;
        $("#canvas").trigger("game_start");
    };

    this.gotoHelp = function () {
        _oHelp = new CHelpPanel();
        _iState = STATE_HELP;
    };

    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
        if(s_bAudioActive){
            Howler.mute(true);
        }
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
        
        if(s_bAudioActive){
            Howler.mute(false);
        }
    };

    this._update = function (event) {
        if (_bUpdate === false) {
            return;
        }
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;

        if (s_iCntTime >= 1000) {
            s_iCurFps = s_iCntFps;
            s_iCntTime -= 1000;
            s_iCntFps = 0;
        }

        if (_iState === STATE_GAME) {
            _oGame.update();
        }

        s_oStage.update(event);
    };

    s_oMain = this;

    _oData = oData;
    LEVEL_POINTS = oData.level_points;
    ALL_LEVELS_UNLOCKED = oData.all_levels_unlocked;
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;

    s_bAudioActive = oData.audio_enable_on_startup;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = false;
var s_iCntTime = 0;
var s_bFullscreen = false;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_oPhysicsController;
var s_oAdsLevel = 1;

var s_oCanvas;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_bStorageAvailable = true;
var s_iLevel;
var s_aScores;
var s_aStars;
var s_iLastLevel;
var s_bFirstTime;
var s_iTotalScore;
var s_iAnimationIndex = 0;

var s_aSounds;
var s_aSoundsInfo;