const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo(){
    navigator.mediaDevices.getUserMedia({video:true,audio:false})
    .then(localMediaStream => {
        console.log(localMediaStream);
        video.src = window.URL.createObjectURL(localMediaStream);
        video.play();
    })
    .catch(err => {
        console.log(`OH NO!!!`,err);
    });
}

/*function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() =>{
        ctx.drawImage(video,0,0,width,height);
    },16);
}*/

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() =>{
        ctx.drawImage(video,0,0,width,height);
        //const pixels = ctx.getImageData(0,0,width,height);
        //console.log(pixels);

        //take the pixels out
        let pixels = ctx.getImageData(0,0,width,height);

        //mass with them
        //pixels = redEffect(pixels);
        //pixels = rgbSplit(pixels);
        //ctx.globalAlpha = 0.8;
        pixels = greenScreen(pixels);

        //put them back
        ctx.putImageData(pixels,0,0);
        //debugger;
    },16);
}

//change the pixels' RGB value 

function redEffect(pixels){
    for(let i=0;i < pixels.data.lenght;i+=4){
        pixels.data[i + 0] = pixels.data[i + 0] + 100;// R
        pixels.data[i + 1] = pixels.data[i + 0] - 50;// G
        pixels.data[i + 2] = pixels.data[i + 0] * 0.5;// B
    }
    return pixels;
}

function rgbSplit(pixels){
    for(let i=0;i < pixels.data.lenght;i+=4){
        pixels.data[i - 150] = pixels.data[i + 0];// R
        pixels.data[i + 500] = pixels.data[i + 0];// G
        pixels.data[i - 550] = pixels.data[i + 0];// B
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

function takePhoto(){
    //Play the sound
    snap.currentTime = 0;
    snap.play();

    const data = canvas.toDataURL('image/jpeg');
    console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download','handsome');
    //link.textContent = 'Download Image';
    link.innerHTML = `<img src="${data}" alt="handsome man" />`;
    strip.insertBefore(link,strip.firstChild);
}

getVideo();


video.addEventListener('canplay',paintToCanvas);