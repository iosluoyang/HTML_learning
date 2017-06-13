/**
 * Created by haiyang on 2017/5/10.
 */
var i = 0;

function timedCount() {
    i = i + 1;
    postMessage(i);
    setTimeout("timedCount()",500);
}

timedCount();