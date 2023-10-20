function CGame(_iLang, oData) {
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oSettings;
    var _iLevel;
    var _oSettings;
    var _oFade;
    var _iMoney;
    var _iEarned;
    var _oCurtainR;
    var _oCurtainL;
    var _iQuizCont;

    this._init = function () {
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oStage.addChild(oBg);

        if (N_MAX_WORDS_TO_GUESS > NUMBER_OF_WORDS) {
            N_MAX_WORDS_TO_GUESS = NUMBER_OF_WORDS;
        }

        _iLevel = 0;
        _iMoney = START_MONEY;
        _iQuizCont = 0;

        _oSettings = new CGameSettings(_iLang, _iLevel);
        _oSettings.loadQuest();
        _oSettings.showPicture();
        _oSettings.placeLetters();
        _oSettings.shuffleLetters();

        _oInterface = new CInterface(_iMoney);
        _oInterface.refreshNuMLevel(_iLevel);
        _oInterface.refreshMoney(_iMoney);

        $(s_oMain).trigger("start_level", {ilevel: _iLevel});

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        var oSpriteCurtainR = s_oSpriteLibrary.getSprite('curtain_dx');

        _oCurtainR = createBitmap(oSpriteCurtainR);
        _oCurtainR.x = CANVAS_WIDTH;
        _oCurtainR.visible = false;

        s_oStage.addChild(_oCurtainR);

        var oSpriteCurtainL = s_oSpriteLibrary.getSprite('curtain_sx');

        _oCurtainL = createBitmap(oSpriteCurtainL);
        _oCurtainL.x = 0;
        _oCurtainL.regX = oSpriteCurtainL.width;
        _oCurtainL.visible = false;

        s_oStage.addChild(_oCurtainL);

        _oCurtainL.addEventListener("click", function () {
        });
        _oCurtainR.addEventListener("click", function () {
        });

        s_oStage.addChild(_oFade);
        createjs.Tween.get(_oFade).to({alpha: 0}, 1000).call(function () {
            _oFade.visible = false;
        });
    };

    this.wordGuessed = function () {
        _iLevel++;
        if (_iLevel < N_MAX_WORDS_TO_GUESS) {
            s_oStage.setChildIndex(_oCurtainR, s_oStage.numChildren - 1);
            s_oStage.setChildIndex(_oCurtainL, s_oStage.numChildren - 1);
            _oCurtainR.visible = true;
            _oCurtainL.visible = true;
            createjs.Tween.get(_oCurtainL, {override: true}).to({x: CANVAS_WIDTH / 2}, 700, createjs.Ease.cubicOut);
            createjs.Tween.get(_oCurtainR, {override: true}).to({x: CANVAS_WIDTH / 2}, 700, createjs.Ease.cubicOut).call(function () {
                s_oGame.goToNextLevel(_iLevel, _iMoney);
            });
        }
        else {
            $(s_oMain).trigger("share_event", _iMoney);
            this.unload();
            s_oMain.gotoGameOver(_iMoney);
        }
    };

    this.goToNextLevel = function (iLevel, iMoney) {
        _oSettings.setLevel(iLevel);
        _oSettings.unloadQuest(_iLevel - 1);
        _oSettings.loadQuest();
        _oSettings.showPicture();
        _oSettings.placeLetters();
        _oSettings.shuffleLetters();
        _oInterface.refreshNuMLevel(iLevel);
        _oInterface.refreshMoney(iMoney);
        _oInterface.resetCounter();
        s_oStage.setChildIndex(_oCurtainR, s_oStage.numChildren - 1);
        s_oStage.setChildIndex(_oCurtainL, s_oStage.numChildren - 1);

        var oSpriteLogo = s_oSpriteLibrary.getSprite('logo');
        var oLogo = createBitmap(oSpriteLogo);
        oLogo.x = CANVAS_WIDTH / 2;
        oLogo.y = 0;
        oLogo.regX = oSpriteLogo.width / 2;
        oLogo.regY = oSpriteLogo.height / 2;
        s_oStage.addChild(oLogo);

        createjs.Tween.get(oLogo, {override: true}).to({y: CANVAS_HEIGHT / 2}, 1300, createjs.Ease.elasticOut).call(function () {
            _iQuizCont++;
            if (_iQuizCont === NUM_QUIZ_FOR_ADS) {
                _iQuizCont = 0;
                $(s_oMain).trigger("show_interlevel_ad");
            }
            createjs.Tween.get(_oCurtainL, {override: true}).wait(200).to({x: 0}, 700, createjs.Ease.cubicOut);
            createjs.Tween.get(_oCurtainR, {override: true}).wait(200).to({x: CANVAS_WIDTH}, 700, createjs.Ease.cubicOut).call(function () {
                _oCurtainL.visible = false;
                _oCurtainR.visible = false;
                $(s_oMain).trigger("start_level", {ilevel: iLevel});
                if (BONUS_TIME === true) {
                    s_oGame.stoppedTime(false);
                }
            });
            createjs.Tween.get(oLogo, {override: true}).wait(100).to({y: -oSpriteLogo.height}, 700, createjs.Ease.backIn).call(function () {
                s_oStage.removeChild(oLogo);
                oLogo = null;

            });
        });
    };

    this.animEarnedMoney = function (iMoney) {
        _iEarned = iMoney + _oInterface.getCount();
        _iMoney += _iEarned;
        _oInterface.addedMoneyAnim(_iEarned, 2000, "#00ff00");
        _oInterface.refreshMoney(_iMoney);
    };

    this.animSpentMoney = function (iMoney) {
        this.manageMoney(iMoney);
        _oInterface.addedMoneyAnim(iMoney, 2000, "#ff0000");
    };

    this.manageMoney = function (i) {
        _iMoney += i;
        _oInterface.refreshMoney(_iMoney);
    };

    this.getMoney = function () {
        return _iMoney;
    };

    this.restartGame = function () {
        this.unload();
        this._init();
    };

    this.stoppedTime = function (bVal) {
        _oInterface.setStoppedTime(bVal);
    };

    this.unload = function () {

        _oInterface.unload();

        _oSettings.unload();

        if (_oEndPanel !== null) {
            _oEndPanel.unload();
        }

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();

    };

    this.onExit = function () {

        this.unload();

        s_oMain.gotoMenu();

        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("show_interlevel_ad");
        $(s_oMain).trigger("restart");

    };

    this.update = function () {
        if (BONUS_TIME === true) {
            _oInterface.update();
        }
    };

    s_oGame = this;

    N_MAX_WORDS_TO_GUESS = oData.words_to_guess;
    NUM_OF_SPAWN_LETTER = oData.spawn_letters;
    START_MONEY = oData.start_money;
    COST_OF_A_LETTER = oData.cost_of_a_letter;
    COST_FOR_REMOVE_LETTERS = oData.cost_for_remove_letters;
    TIME_FOR_EVERY_WORD = oData.time_for_every_quest;
    NUM_QUIZ_FOR_ADS = oData.num_quiz_before_ads;
    _oParent = this;
    this._init();
}

var s_oGame;
