var MS_ROLLING_SCORE = 400;
function CRollingScore() {

    var _oTweenText = null;
    var _oTweenTextStroke = null;

    this.rolling = function (oScoreText, oScoreTextStruct, iScore) {
        _oTweenText = createjs.Tween.get(oScoreText.getText()).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function () {
            createjs.Tween.removeTweens(_oTweenText);
            oScoreText.setColor("#fff");
        }).addEventListener("change", function () {
            oScoreText.refreshText( Math.floor(oScoreText.getString() ));
        })

        if (oScoreTextStruct !== null) {
            _oTweenTextStroke = createjs.Tween.get(oScoreTextStruct.getText()).to({text: iScore}, MS_ROLLING_SCORE, createjs.Ease.cubicOut).call(function () {
                createjs.Tween.removeTweens(_oTweenTextStroke);
            }).addEventListener("change", function () {
                oScoreTextStruct.refreshText(Math.floor(oScoreTextStruct.getString()));
            })

        }
    };

    return this;
}

