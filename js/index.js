var audio = new Audio();
audio.autoplay = true;
var musicList = [];
var currentIndex = 0;
var clock;

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function getMusicList(callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "./music.json", true);
    request.onload = function () {
        if ((request.status >= 200 && request.status < 300) || request.status === 304) {//资源访问成功
            callback(JSON.parse(this.responseText));
        } else {
            console.log(requeset.status);
        }
        request.onerror = function () {
            console.log(request.status);
            console.log("网络异常");
        }
    }
    request.send();
}

getMusicList(function (list) {
    musicList = list;
    loadMusicList(musicList[currentIndex]);
    generator(musicList);
});

function generator(list) {
    list.forEach(function (e,id) {
        var iterm = document.createElement("li");
        var text = document.createTextNode(e.title + "-" + e.author);
        iterm.appendChild(text);
        iterm.setAttribute("data-value",id);
        $("ul.list").appendChild(iterm);
    });
}

/**
 * 播放音乐，点击音乐名字和播放按钮都会触发。
 * @param song
 */
function loadMusicList(song) {
    audio.src = song.src;
    audio.play();
    $(".musicbox .title").innerText = song.title;
    $(".musicbox .author").innerText = song.author;
}

/*
播放过程中：1.进度条问题
            2.时间显示
     需要监听音乐的播放状态，不能直接监听play事件。
 */
audio.addEventListener("timeupdate", function () {
    // 1.显示时间进度条
    $(".progress .progress-now").style.width = this.currentTime / this.duration * 100 + "%";
});

audio.addEventListener("play", function () {
    // 2.时间展示
    clock = setInterval(function () {
        var minute = Math.floor(audio.currentTime / 60);
        var second = Math.floor(audio.currentTime % 60);
        second = second >= 10 ? second : "0" + second;
        $(".progress .time").innerText = (minute + ":" + second);
    }, 1000)
});

audio.addEventListener("pause", function () {
    clearInterval(clock);
});

$(".control").addEventListener("click", function (e) {
    if (e.target.classList.contains("fa-play")) {
        //点击后暂停
        audio.pause();
        e.target.classList.remove("fa-play");
        e.target.classList.add("fa-pause");
    } else if (e.target.classList.contains("fa-pause")) {
        //点击后播放
        audio.play();
        e.target.classList.remove("fa-pause");
        e.target.classList.add("fa-play");
    } else if (e.target.classList.contains("fa-step-forward")) {
        //下一首
        currentIndex = ++currentIndex % musicList.length;
        loadMusicList(musicList[currentIndex]);
    } else if (e.target.classList.contains("fa-step-backward")) {
        //上一首
        currentIndex = (musicList.length + (--currentIndex)) % musicList.length;
        loadMusicList(musicList[currentIndex]);
    }
});

/**
 * 点击音乐播放进度条时触发
 */
$(".bar").addEventListener("click", function (e) {

    var barWidth = parseInt(window.getComputedStyle(this).width);
    var percent = e.offsetX / barWidth;
    // TODO 下面的代码没有成功修改audio的currentTime，每次都是0 ?
    audio.currentTime = audio.duration * percent;
});


/**
 * 给列表中的每个li添加事件代理。
 */
$("ul.list").addEventListener("click",function(e){
    if(e.target.classList.contains("bar")){
        console.log("点击到了ul框？")
    }else {
        var musicId = e.target.getAttribute("data-value");
        loadMusicList(musicList[musicId]);
    }
})
