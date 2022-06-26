'use strict'

/**
 * JavaScript 代码中首先执行 getUserMedia() 方法，该方法会请求访问 Camera。如果是第一次请求 Camera，浏览器会向用户弹出提示窗口，让用户决定是否可以访问摄像头。如果用户允许访问，且设备可用，则调用 gotLocalMediaStream 方法。在 gotLocalMediaStream 方法中，其输入参数为 MediaStream 对象，该对象中存放着 getUserMedia 方法采集到的音视频轨。我们将它作为视频源赋值给 HTML5 的 video 标签的 srcObject 属性。这样在 HTML 页面加载之后，就可以在该页面中看到摄像头采集到的视频数据了。在这个例子中，getUserMedia 方法的输入参数 mediaStreamContraints 限定了只采集视频数据。同样的，你也可以采集音频数据或同时采集音频和视频数据。
 */

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

start();
