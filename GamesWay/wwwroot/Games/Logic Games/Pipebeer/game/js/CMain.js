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
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);
        createjs.Touch.enable(s_oStage, true);
        s_oStage.preventSelection = false;

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
        s_aSoundsInfo.push({path: './sounds/',filename:'character_laugh',loop:false,volume:1, ingamename: 'character_laugh'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_win',loop:false,volume:1, ingamename: 'game_win'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'gulp',loop:false,volume:1, ingamename: 'gulp'});
        s_aSoundsInfo.push({path: './sounds/',filename:'cry',loop:false,volume:1, ingamename: 'cry'});
        s_aSoundsInfo.push({path: './sounds/',filename:'explosion',loop:false,volume:1, ingamename: 'explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'place_pipe',loop:false,volume:1, ingamename: 'place_pipe'});
        s_aSoundsInfo.push({path: './sounds/',filename:'bonus',loop:false,volume:1, ingamename: 'bonus'});
        s_aSoundsInfo.push({path: './sounds/',filename:'water_open',loop:false,volume:1, ingamename: 'water_open'});
        s_aSoundsInfo.push({path: './sounds/',filename:'water_movement',loop:false,volume:1, ingamename: 'water_movement'});

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

        for (var i = 1; i < 10; i++) {
            s_oSpriteLibrary.addSprite("mascotte_0" + i, "./sprites/character_animations/character_000" + i + ".png");
        };
        
        for (var i = 10; i < 100; i++) {
            s_oSpriteLibrary.addSprite("mascotte_" + i, "./sprites/character_animations/character_00" + i + ".png");
        };
        
        for (var i = 100; i < 124; i++) {
            s_oSpriteLibrary.addSprite("mascotte_" + i, "./sprites/character_animations/character_0" + i + ".png");
        };

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
        s_oSpriteLibrary.addSprite("bg_level_select", "./sprites/bg_level_select.jpg");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("bg_help", "./sprites/bg_help.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_home", "./sprites/but_home.png");
        s_oSpriteLibrary.addSprite("but_restart", "./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("level_sprite", "./sprites/level_sprite.png");
        s_oSpriteLibrary.addSprite("time", "./sprites/time.png");
        s_oSpriteLibrary.addSprite("next_pipe", "./sprites/next_pipe.png");
        s_oSpriteLibrary.addSprite("explosion", "./sprites/explosion.png");
        s_oSpriteLibrary.addSprite("pipe0", "./sprites/pipe0.png");
        s_oSpriteLibrary.addSprite("pipe1a", "./sprites/pipe1a.png");
        s_oSpriteLibrary.addSprite("pipe1b", "./sprites/pipe1b.png");
        s_oSpriteLibrary.addSprite("pipe2a", "./sprites/pipe2a.png");
        s_oSpriteLibrary.addSprite("pipe2b", "./sprites/pipe2b.png");
        s_oSpriteLibrary.addSprite("pipe3a1", "./sprites/pipe3a1.png");
        s_oSpriteLibrary.addSprite("pipe3a2", "./sprites/pipe3a2.png");
        s_oSpriteLibrary.addSprite("pipe3b1", "./sprites/pipe3b1.png");
        s_oSpriteLibrary.addSprite("pipe3b2", "./sprites/pipe3b2.png");
        s_oSpriteLibrary.addSprite("pipe3c1", "./sprites/pipe3c1.png");
        s_oSpriteLibrary.addSprite("pipe3c2", "./sprites/pipe3c2.png");
        s_oSpriteLibrary.addSprite("pipe3d1", "./sprites/pipe3d1.png");
        s_oSpriteLibrary.addSprite("pipe3d2", "./sprites/pipe3d2.png");
        s_oSpriteLibrary.addSprite("pipe4", "./sprites/pipe4.png");
        s_oSpriteLibrary.addSprite("pipe11", "./sprites/pipe11.png");
        s_oSpriteLibrary.addSprite("lamp", "./sprites/lamp.png");
        s_oSpriteLibrary.addSprite("arrow", "./sprites/arrow.png");
        s_oSpriteLibrary.addSprite("next_panel", "./sprites/next_panel.png");
        s_oSpriteLibrary.addSprite("splash", "./sprites/splash.png");
        s_oSpriteLibrary.addSprite("goal_icon", "./sprites/goal_icon.png");

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
        $(s_oMain).trigger("game_start");
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
    ENABLE_FULLSCREEN = oData.fullscreen;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    USED_PIPE_UNDER_GOAL = oData.used_pipe_under_goal;
    USED_PIPE_ABOVE_GOAL = oData.used_pipe_above_goal;
    UNUSED_PIPE_MALUS = oData.unused_pipe_malus;
    CHANGED_PIPE_MALUS = oData.changed_pipe_malus;

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

var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack;
var s_bStorageAvailable = true;
var s_iLevel;
var s_iLastLevel;
var s_bFirstTime;
var s_iTotalScore;
var s_iLongestCircuit;
var s_aSounds;
var s_aSoundsInfo;