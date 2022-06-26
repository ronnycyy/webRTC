'use strict'

/**
 * 在这段脚本中，我们调用了之前所讲的 getUserMedia 方法，该方法会打开摄像头，并通过它采集音视频流。
 * 然后再将采集到的视频流赋值给 HTML 中定义的 video 标签的 srcObject 字段，
 * 这样 video 标签就可以从摄像头源源不断地获得视频帧，并将它播放出来了。
 */

//filter
var filtersSelect = document.querySelector('select#filter');

//picture
var snapshot = document.querySelector('button#snapshot');
var picture = document.querySelector('canvas#picture');
picture.width = 640;
picture.height = 480;

var videoplay = document.querySelector('video#player');

function gotMediaStream(stream) {
    var videoTrack = stream.getVideoTracks()[0];

    window.stream = stream;
    videoplay.srcObject = stream;
}

function handleError(err) {
    console.log('getUserMedia error:', err);
}

function start() {

    if (!navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia) {

        console.log('getUserMedia is not supported!');
        return;

    } else {

        //var deviceId = videoSource.value; 
        var constraints = {
            video: {
                width: 640,
                height: 480,
                frameRate: 15,
                facingMode: 'enviroment'
                //,
                //deviceId : deviceId ? {exact:deviceId} : undefined 
            },
            audio: false
        }

        navigator.mediaDevices.getUserMedia(constraints)
            .then(gotMediaStream)
            .catch(handleError);
    }
}

filtersSelect.onchange = function () {
    videoplay.className = filtersSelect.value;
}

snapshot.onclick = function () {
    picture.className = filtersSelect.value;
    // drawImage方法的第一个参数特别重要，它既可以是一幅图片，也可以是一个 Video 元素。
    // 而 HTML 中的 <video> 标签就是一个 video 元素，所以它可以当作是 drawImage 方法的第一个参数。这样就可以通过 Canvas 获取到照片了。
    picture.getContext('2d').drawImage(videoplay, 0, 0, picture.width, picture.height);
}


start();
