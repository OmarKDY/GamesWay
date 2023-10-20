function CMain(oData) {
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oGame;
    var _oGameOver;
    var _oLanguage;

    this.initContainer = function () {
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage,true);
        s_bMobile = isMobile();
        if (s_bMobile === false) {
            s_oStage.enableMouseOver(20);
 
        }

        s_iPrevTime = new Date().getTime();

        createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = 30;

        if (navigator.userAgent.match(/Windows Phone/i)) {
            DISABLE_SOUND_MOBILE = true;
        }

        s_oSpriteLibrary = new CSpriteLibrary();

        

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };

    this.preloaderReady = function () {
        if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
            this._initSounds();
        }

        this._loadImages();
        _bUpdate = true;
    };


    this.soundLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

    };

    this._initSounds = function(){
        Howler.mute(!s_bAudioActive);

        s_aSoundsInfo = new Array();
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});
        s_aSoundsInfo.push({path: './sounds/',filename:'guessed',loop:false,volume:1, ingamename: 'guessed'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wrong',loop:false,volume:1, ingamename: 'wrong'});
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


    this._loadImages = function () {
        s_oSpriteLibrary.init(this._onImagesLoaded, this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("but_play", "./sprites/but_play.png");

        s_oSpriteLibrary.addSprite("bg_menu", "./sprites/bg_menu.png");
        s_oSpriteLibrary.addSprite("bg_game", "./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("bg_gameover", "./sprites/bg_gameover.png");
        s_oSpriteLibrary.addSprite("load_level", "./sprites/load_level.png");

        s_oSpriteLibrary.addSprite("but_exit", "./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon", "./sprites/audio_icon.png");

        s_oSpriteLibrary.addSprite("curtain_dx", "./sprites/curtain_dx.jpg");
        s_oSpriteLibrary.addSprite("curtain_sx", "./sprites/curtain_sx.jpg");
        s_oSpriteLibrary.addSprite("logo", "./sprites/logo.png");
        s_oSpriteLibrary.addSprite("logo_small", "./sprites/logo_small.png");

        s_oSpriteLibrary.addSprite("msg_box", "./sprites/msg_box.png");

        s_oSpriteLibrary.addSprite("letterbox", "./sprites/letterbox.png");
        s_oSpriteLibrary.addSprite("letter", "./sprites/letter.png");
        s_oSpriteLibrary.addSprite("money_panel", "./sprites/money_panel.png");
        s_oSpriteLibrary.addSprite("level_panel", "./sprites/level_panel.png");

        s_oSpriteLibrary.addSprite("success", "./sprites/success.png");
        s_oSpriteLibrary.addSprite("mistake", "./sprites/mistake.png");

        s_oSpriteLibrary.addSprite("but_next", "./sprites/but_next.png");

        s_oSpriteLibrary.addSprite("text_copyright", "./sprites/text_copyright.png");

        s_oSpriteLibrary.addSprite("but_flag_it", "./sprites/but_flag_it.png");
        s_oSpriteLibrary.addSprite("but_flag_en", "./sprites/but_flag_en.png");
        s_oSpriteLibrary.addSprite("but_flag_fr", "./sprites/but_flag_fr.png");
        s_oSpriteLibrary.addSprite("but_flag_es", "./sprites/but_flag_es.png");
        s_oSpriteLibrary.addSprite("but_flag_ger", "./sprites/but_flag_ger.png");
        s_oSpriteLibrary.addSprite("but_flag_por", "./sprites/but_flag_por.png");

        s_oSpriteLibrary.addSprite("but_add_a_letter", "./sprites/but_add_a_letter.png");
        s_oSpriteLibrary.addSprite("but_remove_letters", "./sprites/but_remove_letters.png");
        s_oSpriteLibrary.addSprite("but_credits", "./sprites/but_credits.png");
        s_oSpriteLibrary.addSprite("logo_ctl", "./sprites/logo_ctl.png");

        s_oSpriteLibrary.addSprite("imghome1", "./sprites/imghome1.png");
        s_oSpriteLibrary.addSprite("imghome2", "./sprites/imghome2.jpg");
        s_oSpriteLibrary.addSprite("imghome3", "./sprites/imghome3.jpg");
        s_oSpriteLibrary.addSprite("imghome4", "./sprites/imghome4.jpg");

        s_oSpriteLibrary.addSprite("imgcat1", "./sprites/imgcat1.jpg");
        s_oSpriteLibrary.addSprite("imgcat2", "./sprites/imgcat2.jpg");
        s_oSpriteLibrary.addSprite("imgcat3", "./sprites/imgcat3.jpg");
        s_oSpriteLibrary.addSprite("imgcat4", "./sprites/imgcat4.jpg");

        s_oSpriteLibrary.addSprite("imghappy1", "./sprites/imghappy1.jpg");
        s_oSpriteLibrary.addSprite("imghappy2", "./sprites/imghappy2.jpg");
        s_oSpriteLibrary.addSprite("imghappy3", "./sprites/imghappy3.jpg");
        s_oSpriteLibrary.addSprite("imghappy4", "./sprites/imghappy4.jpg");

        s_oSpriteLibrary.addSprite("imgdrink1", "./sprites/imgdrink1.jpg");
        s_oSpriteLibrary.addSprite("imgdrink2", "./sprites/imgdrink2.jpg");
        s_oSpriteLibrary.addSprite("imgdrink3", "./sprites/imgdrink3.jpg");
        s_oSpriteLibrary.addSprite("imgdrink4", "./sprites/imgdrink4.jpg");

        s_oSpriteLibrary.addSprite("imgminute1", "./sprites/imgminute1.jpg");
        s_oSpriteLibrary.addSprite("imgminute2", "./sprites/imgminute2.jpg");
        s_oSpriteLibrary.addSprite("imgminute3", "./sprites/imgminute3.jpg");
        s_oSpriteLibrary.addSprite("imgminute4", "./sprites/imgminute4.jpg");

        s_oSpriteLibrary.addSprite("imgsound1", "./sprites/imgsound1.jpg");
        s_oSpriteLibrary.addSprite("imgsound2", "./sprites/imgsound2.jpg");
        s_oSpriteLibrary.addSprite("imgsound3", "./sprites/imgsound3.jpg");
        s_oSpriteLibrary.addSprite("imgsound4", "./sprites/imgsound4.jpg");

        s_oSpriteLibrary.addSprite("imgcacao1", "./sprites/imgcacao1.jpg");
        s_oSpriteLibrary.addSprite("imgcacao2", "./sprites/imgcacao2.jpg");
        s_oSpriteLibrary.addSprite("imgcacao3", "./sprites/imgcacao3.jpg");
        s_oSpriteLibrary.addSprite("imgcacao4", "./sprites/imgcacao4.jpg");

        s_oSpriteLibrary.addSprite("imgfull1", "./sprites/imgfull1.jpg");
        s_oSpriteLibrary.addSprite("imgfull2", "./sprites/imgfull2.jpg");
        s_oSpriteLibrary.addSprite("imgfull3", "./sprites/imgfull3.jpg");
        s_oSpriteLibrary.addSprite("imgfull4", "./sprites/imgfull4.jpg");

        s_oSpriteLibrary.addSprite("imgcold1", "./sprites/imgcold1.jpg");
        s_oSpriteLibrary.addSprite("imgcold2", "./sprites/imgcold2.jpg");
        s_oSpriteLibrary.addSprite("imgcold3", "./sprites/imgcold3.jpg");
        s_oSpriteLibrary.addSprite("imgcold4", "./sprites/imgcold4.jpg");

        s_oSpriteLibrary.addSprite("imgviolet1", "./sprites/imgviolet1.jpg");
        s_oSpriteLibrary.addSprite("imgviolet2", "./sprites/imgviolet2.jpg");
        s_oSpriteLibrary.addSprite("imgviolet3", "./sprites/imgviolet3.jpg");
        s_oSpriteLibrary.addSprite("imgviolet4", "./sprites/imgviolet4.jpg");

        s_oSpriteLibrary.addSprite("imgchord1", "./sprites/imgchord1.jpg");
        s_oSpriteLibrary.addSprite("imgchord2", "./sprites/imgchord2.jpg");
        s_oSpriteLibrary.addSprite("imgchord3", "./sprites/imgchord3.jpg");
	s_oSpriteLibrary.addSprite("imgchord4", "./sprites/imgchord4.jpg");

        s_oSpriteLibrary.addSprite("imgcolors1", "./sprites/imgcolors1.jpg");
        s_oSpriteLibrary.addSprite("imgcolors2", "./sprites/imgcolors2.jpg");
        s_oSpriteLibrary.addSprite("imgcolors3", "./sprites/imgcolors3.jpg");
        s_oSpriteLibrary.addSprite("imgcolors4", "./sprites/imgcolors4.jpg");

        s_oSpriteLibrary.addSprite("imgrubber1", "./sprites/imgrubber1.jpg");
        s_oSpriteLibrary.addSprite("imgrubber2", "./sprites/imgrubber2.jpg");
        s_oSpriteLibrary.addSprite("imgrubber3", "./sprites/imgrubber3.jpg");
        s_oSpriteLibrary.addSprite("imgrubber4", "./sprites/imgrubber4.jpg");

        s_oSpriteLibrary.addSprite("imgdelete1", "./sprites/imgdelete1.jpg");
        s_oSpriteLibrary.addSprite("imgdelete2", "./sprites/imgdelete2.jpg");
        s_oSpriteLibrary.addSprite("imgdelete3", "./sprites/imgdelete3.jpg");
        s_oSpriteLibrary.addSprite("imgdelete4", "./sprites/imgdelete4.jpg");

        s_oSpriteLibrary.addSprite("imgclimb1", "./sprites/imgclimb1.jpg");
        s_oSpriteLibrary.addSprite("imgclimb2", "./sprites/imgclimb2.jpg");
        s_oSpriteLibrary.addSprite("imgclimb3", "./sprites/imgclimb3.jpg");
        s_oSpriteLibrary.addSprite("imgclimb4", "./sprites/imgclimb4.jpg");

        s_oSpriteLibrary.addSprite("imgorange1", "./sprites/imgorange1.jpg");
        s_oSpriteLibrary.addSprite("imgorange2", "./sprites/imgorange2.jpg");
        s_oSpriteLibrary.addSprite("imgorange3", "./sprites/imgorange3.jpg");
        s_oSpriteLibrary.addSprite("imgorange4", "./sprites/imgorange4.jpg");

        s_oSpriteLibrary.addSprite("imgbed1", "./sprites/imgbed1.jpg");
        s_oSpriteLibrary.addSprite("imgbed2", "./sprites/imgbed2.jpg");
        s_oSpriteLibrary.addSprite("imgbed3", "./sprites/imgbed3.jpg");
        s_oSpriteLibrary.addSprite("imgbed4", "./sprites/imgbed4.jpg");

        s_oSpriteLibrary.addSprite("imgisland1", "./sprites/imgisland1.jpg");
        s_oSpriteLibrary.addSprite("imgisland2", "./sprites/imgisland2.jpg");
        s_oSpriteLibrary.addSprite("imgisland3", "./sprites/imgisland3.jpg");
        s_oSpriteLibrary.addSprite("imgisland4", "./sprites/imgisland4.jpg");

        s_oSpriteLibrary.addSprite("imgwine1", "./sprites/imgwine1.jpg");
        s_oSpriteLibrary.addSprite("imgwine2", "./sprites/imgwine2.jpg");
        s_oSpriteLibrary.addSprite("imgwine3", "./sprites/imgwine3.jpg");
        s_oSpriteLibrary.addSprite("imgwine4", "./sprites/imgwine4.jpg");

        s_oSpriteLibrary.addSprite("imground1", "./sprites/imground1.jpg");
        s_oSpriteLibrary.addSprite("imground2", "./sprites/imground2.jpg");
        s_oSpriteLibrary.addSprite("imground3", "./sprites/imground3.jpg");
        s_oSpriteLibrary.addSprite("imground4", "./sprites/imground4.jpg");

        s_oSpriteLibrary.addSprite("imgiron1", "./sprites/imgiron1.jpg");
        s_oSpriteLibrary.addSprite("imgiron2", "./sprites/imgiron2.jpg");
        s_oSpriteLibrary.addSprite("imgiron3", "./sprites/imgiron3.jpg");
        s_oSpriteLibrary.addSprite("imgiron4", "./sprites/imgiron4.jpg");

        s_oSpriteLibrary.addSprite("but_menu", "./sprites/but_menu.png");

        s_oSpriteLibrary.addSprite("shadow", "./sprites/shadow_of_images.png");
        s_oSpriteLibrary.addSprite("but_fullscreen", "./sprites/but_fullscreen.png");

        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };

    this._onImagesLoaded = function () {
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource / RESOURCE_TO_LOAD * 100);
        _oPreloader.refreshLoader(iPerc);

    };

    this._onAllImagesLoaded = function () {
        
    };

    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        

        s_oSoundTrack = playSound("soundtrack", 1,true); 

        
        this.gotoMenu();
    };
    
    this.gotoMenu = function () {
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };

    this.gotoGame = function (_iLang) {
        _oGame = new CGame(_iLang, _oData);
        _iState = STATE_GAME;


        $(s_oMain).trigger("game_start");
    };

    this.gotoGameOver = function (iMoney) {
        _oGameOver = new CGameOver(iMoney);

    };
    
    this.gotoLanguage = function () {
        _oLanguage = new CLanguageMenu();
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
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    GAME_LANGUAGE = oData.game_language;
    s_bAudioActive = oData.audio_enable_on_startup;


    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundTrack = null;
var s_oCanvas;
var s_iLanguageSelected;

var s_aSounds;
var s_bFullscreen = false;
var s_aSoundsInfo;