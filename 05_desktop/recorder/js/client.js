'use strict'

// 它仍然属于音视频采集的范畴，但是这次采集的不是音视频数据而是桌面。
// 不过这也没什么关系，桌面也可以当作一种特殊的视频数据来看待。

var videoplay = document.querySelector('video#player');
//var audioplay = document.querySelector('audio#audioplayer');

//record
var recvideo = document.querySelector('video#recplayer');
var btnRecord = document.querySelector('button#record');
var btnPlay = document.querySelector('button#recplay');
var btnDownload = document.querySelector('button#download');

var buffer;
var mediaRecorder;


function gotMediaStream(stream) {
	// 把抓到的桌面流 送到 video 标签
	window.stream = stream;
	videoplay.srcObject = stream;

}

function handleError(err) {
	console.log('getUserMedia error:', err);
}

function start() {

	if (!navigator.mediaDevices ||
		!navigator.mediaDevices.getDisplayMedia) {

		console.log('getDisplayMedia is not supported!');
		return;

	} else {

		var constraints = {
			video: {
				width: 640,
				height: 480,
				frameRate: 15
			},
			audio: false
		}

		// getDisplayMedia是 获取桌面，getUserMedia 是获取电脑外接的设备。
		navigator.mediaDevices.getDisplayMedia(constraints)
			.then(gotMediaStream)
			.catch(handleError);
	}
}

start();

function handleDataAvailable(e) {
	if (e && e.data && e.data.size > 0) {
		buffer.push(e.data);
	}
}

function startRecord() {

	buffer = [];

	var options = {
		mimeType: 'video/webm;codecs=vp8'
	}

	if (!MediaRecorder.isTypeSupported(options.mimeType)) {
		console.error(`${options.mimeType} is not supported!`);
		return;
	}

	try {
		mediaRecorder = new MediaRecorder(window.stream, options);
	} catch (e) {
		console.error('Failed to create MediaRecorder:', e);
		return;
	}

	mediaRecorder.ondataavailable = handleDataAvailable;
	mediaRecorder.start(10);

}

function stopRecord() {
	mediaRecorder.stop();
}

btnRecord.onclick = () => {

	if (btnRecord.textContent === 'Start Record') {
		startRecord();
		btnRecord.textContent = 'Stop Record';
		btnPlay.disabled = true;
		btnDownload.disabled = true;
	} else {

		stopRecord();
		btnRecord.textContent = 'Start Record';
		btnPlay.disabled = false;
		btnDownload.disabled = false;

	}
}

btnPlay.onclick = () => {
	var blob = new Blob(buffer, { type: 'video/webm' });
	recvideo.src = window.URL.createObjectURL(blob);
	recvideo.srcObject = null;
	recvideo.controls = true;
	recvideo.play();
}

btnDownload.onclick = () => {
	var blob = new Blob(buffer, { type: 'video/webm' });
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');

	a.href = url;
	a.style.display = 'none';
	a.download = 'aaa.webm';
	a.click();
}

