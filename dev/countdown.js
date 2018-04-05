'use strict'

function divmod(a, b) {
    return [Math.floor(a / b), a % b];
}

function Time(time) {
    this.timeObj = time;
}
Time.fields = ['days', 'hours', 'minutes', 'seconds'];
Time.maxDigit = [9, 9, 2, 3, 5, 9, 5, 9];

function countDownOf(numArray) {
    function digitOf(num) {
        return `<div class="digitWrapper"><span class="digit">${num}</span></div>`;
    }
    function divider() {
        return '<div class="dividerWrapper"><span class="divider">:</span></div>';
    }
    var ret = [];
    ret.push('<div id="countdown">');
    var i = 0;
    for (var num of numArray) {
        ret.push(digitOf(num));
        i += 1;
        if (i == 2) {
            ret.push(divider());
            i = 0;
        }
    }
    ret.pop();
    ret.push('</div>')
    return ret.join('');
}

function renderMove(move) {
    var digit = $(`.digit:nth(${move.pos})`);
    var newDigit = $('<span>',{
        'class':'digit',
        css:{
            top: '-100%'
        },
        html: move.toDigit
    });
    digit.before(newDigit).removeClass('static').animate({}, 'fast', function() {
        digit.remove();
    });
    newDigit.delay(100).animate({top: 0}, 'fast', function() {
        newDigit.addClass('static');
    });
}

function Countdown(time, gap, div, callback) {
    function numArrayOf(time) {
        var numArray = [];
        Time.fields.forEach(function(field) {
            numArray.push(...divmod(time.timeObj[field], 10));
        });
        return numArray;
    }
    this.time = time;
    this.gap = gap;
    this.numArray = numArrayOf(time);
    var numArrayHandler = this.numArray;
    div.html(countDownOf(this.numArray));
    var tickHandler = function() {
        var isEnd = false;
        function moveOf(pos, toDigit) {
            return {pos: pos, toDigit: toDigit};
        }
        function tickHelper(pos) {
            if (numArrayHandler[pos] == 0) {
                numArrayHandler[pos] = Time.maxDigit[pos];
                moves.push(moveOf(pos, Time.maxDigit[pos]));
                if (pos == 0) {
                    isEnd = true;
                    return; // 0 -> max
                }
                tickHelper(pos - 1);
            } else {
                numArrayHandler[pos] -= 1;
                moves.push(moveOf(pos, numArrayHandler[pos]));
            }
        }
        var moves = [];
        tickHelper(7);
        if (isEnd) {
            console.log('STOP');
            return;
        }
        // console.log(numArrayHandler.join(''));
        moves.forEach(renderMove);
        setTimeout(tickHandler, gap);
    };
    this.tick = tickHandler;
}
