// 定義名稱。要與 images 資料夾內相同名稱 
//var labels = prompt("請輸入名稱並以逗號隔開人名:","Teddy,Chuan").toString().split(",")
var labels = ['family1','family2','family3']  //要和*.py內容所列一致
var labelcc = ['家人1','家人2','家人3']  //跳出中文
//var username = prompt("請輸入 AIO 使用者名稱:","hylin")
const inputtextUser = document.getElementById('inputtextUser')   //1.不要prompt改用inputbox
const inputtext = document.getElementById('inputtext')
const video1 = document.getElementById('inputVideo')
const idn = document.getElementById('identify')     //2.比age多了按鈕
//const conDev = document.getElementById('connDiv') 
//const discon = document.getElementById('disconnBtn')
//const con = document.getElementById('connBtn')
//const connBtnImg = document.getElementById('connBtnImg')


// 讓輸入框圓角一點  需要 jquery-ui.min.js 和 jquery-ui.min.css
$('input:text').addClass("ui-widget ui-widget-content ui-corner-all ui-textfield");

setInterval(async () => {
    inputtext.style.width = video1.offsetWidth.toString()+"px"
    inputtext.style.height = video1.offsetHeight.toString()/8+"px"
    inputtextUser.style.width = video1.offsetWidth.toString()+"px"  //3.新增的
    inputtextUser.style.height = video1.offsetHeight.toString()/8+"px"  //3.新增的
    idn.style.height = video1.offsetHeight.toString()/8+"px"
    idn.style.fontSize = video1.offsetHeight.toString()/15+"px"
    checkCookie()
},100)

// 儲存 cookie 的值(cookie的名字、cookie的值、儲存的天數)
function setCookie(cname,cvalue,exdays)
{
  var d = new Date();
  d.setTime(d.getTime()+(exdays*24*60*60*1000+8*60*60*1000));   // 因為是毫秒, 所以要乘以1000
  var expires = "expires="+d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

// 得到 cookie 的值
function getCookie(cname)
{
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) 
  {
    var c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

var first = false  // 是否初始化網頁
var last_key = getCookie("key")
var last_name = getCookie("name")     //4.由此開始將年齡辨識的getCookie程式部分copy過來

// 確認 cookie 的值       //5.保留cookie較好，但增加難度 0212
function checkCookie()
{
  var key = ""
  var name = ""
  if(first == false){
    // 從 Cookie 中取值
    key = getCookie("key");
    inputtext.value = key;
    name = getCookie("name");
    inputtextUser.value = name;
    first = true
  }

  key = inputtext.value
  name = inputtextUser.value

  //if (key != "" && key != null)
  if(key != last_key)
  {
    setCookie("key",key,30);
    console.log("change:",key)
  }

  if(name != last_name)
  {
    setCookie("name",name,30);
    console.log("change:",name)
  }

  last_key = key
  last_name = name
}

Promise.all([
    inputtext.style.width = video1.offsetWidth.toString()+"px",
    inputtext.style.height = video1.offsetHeight.toString()/8+"px",
    mask.style.display = "block",
    loadImg.style.display = "block",
    checkCookie(),
    faceapi.nets.ssdMobilenetv1.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'), 
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    console.log("load models OK"),
    ]).then(startVideo)

async function startVideo(){
    await navigator.mediaDevices.getUserMedia({video: {}},)   
      .then(function(stream){
        console.log("setting")
        video1.setAttribute("autoplay", "true");
        video1.setAttribute("playsinline", "true");
        video1.setAttribute("muted", "true");
        video1.setAttribute("loop", "true");
        //video1.setAttribute("controls", "true");
        video1.srcObject = stream;
      })
      await video1.play();
      canRecognizeFaces(0)
    }

var labeledDescriptors;
var faceMatcher;
var canvas;
var detections;
var resizedDetections;
var results;
var init = false;


function  changeCanvasSize(){
    setInterval(async () => {
        canvas.style.width = video1.offsetWidth.toString()+"px"
        canvas.style.height = video1.offsetHeight.toString()+"px"
        canvas.style.left = getPosition(video1)["x"] + "px";
        canvas.style.top = getPosition(video1)["y"] + "px";
    }, 100)
}

async function canRecognizeFaces(sta){
    if(init == false){
        console.log(init)
        console.log("init success")    //初始化成功
        labeledDescriptors = await loadLabel()
        // 描述標籤
        console.log(labeledDescriptors)
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors,0.7)
        canvas =  faceapi.createCanvasFromMedia(video1)
        document.body.append(canvas)
        mask.style.display = "none"
        loadImg.style.display = "none"
        changeCanvasSize()
        // 將 canvas 的位置設定成與影像一樣
        canvas.style.left = getPosition(video1)["x"] + "px";
        canvas.style.top = getPosition(video1)["y"] + "px";
        displaySize = { width: video1.offsetWidth, height: video1.offsetHeight}
        faceapi.matchDimensions(canvas, displaySize)
        init = true
    }
    if(init == true && sta==1){   
        displaySize = { width: video1.offsetWidth, height: video1.offsetHeight}
        faceapi.matchDimensions(canvas, displaySize) ///
        detections = await faceapi.detectAllFaces(video1).withFaceLandmarks().withFaceDescriptors()
        resizedDetections = faceapi.resizeResults(detections, displaySize)
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
        results = resizedDetections.map((d) => {
            return faceMatcher.findBestMatch(d.descriptor)
        })
        
        //ˊ6.正確完整賦值 0212
        inputtext.value = ""
        if (!inputtext.value.includes("aio")) {           
           inputtext.value = "aio";
        }
        if(!inputtext.value.includes("_KmsD57ndY6KVG1ihCyNCmXH4lQGw")) {           
           inputtext.value = inputtext.value + "_KmsD57ndY6KVG1ihCyNCmXH4lQGw";
        }  
        inputtextUser.value = ""
        if (!inputtextUser.value.includes("hylin")) {           
           inputtextUser.value = "hylin";
        }  

        var resp  //7.global var 0209
        results.forEach((result,i) =>{
            console.log("最接近存檔照片的是:",results[i]["label"])     // 顯示所有偵測到的名稱(最有可能，但不一定是本人，由*.py再做篩選)
            lab = parseFloat(labels.indexOf(results[i]["label"]))
            dis = parseFloat(results[i]["distance"])
            //console.log(labels.indexOf(results[i]["label"]))
            console.log("label:",lab,"distance:",dis)
            //sendMsg(results[i]["label"]+":"+results[i]["distance"])
            console.log("inputtextUser.value:",inputtextUser.value,", inputtext.value:",inputtext.value)  //0209
            $.ajax({    //8.已用inputtextUser.value取代username
                url: "https://io.adafruit.com/api/v2/"+inputtextUser.value+"/feeds/door/data?X-AIO-Key="+inputtext.value,
                type: "POST",
                data: {
                  "value":lab+dis
                },
              })
            //var resp = prompt("辨識結果:",labelcc[lab])  //增加中文結果
            var num = 1-dis
            resp = "辨識結果: " + labelcc[lab] + ", 可信度: " + String(num.toFixed(2))            
                  
            const box = resizedDetections[i].detection.box
            const drawBox = new faceapi.draw.DrawBox(box, { label: result })
            drawBox.draw(canvas)
        })
        setTimeout(async () => {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
            alert(resp)  //8.0209
        },1000)
    }
}

$('#identify').click((e) => {
    console.log("執行辨識")
    canRecognizeFaces(1);
});

function loadLabel() {
  var labels_len = labels.length;
  console.log("Labels數量：",labels_len)
  var succ = true;
  return Promise.all(
      labels.map(async (label) => {
          console.log("Label名稱：",label)
          const descriptions = []
          for (let i = 1; i <= 3; i++) {
              try {
                  //img = await faceapi.fetchImage(`./images/${label}/${i}.jpg`)  //反引號(back-tick)
                  img = await faceapi.fetchImage('./images/'+label+'/'+i+'.jpg')
                  console.log('照片位置:./images/'+label+'/'+i+'.jpg')
              }
              catch (e) {
                  console.log("換PNG啦")
                  try {
                      //img = await faceapi.fetchImage(`./images/${label}/${i}.png`)
                      img = await faceapi.fetchImage('./images/'+label+'/'+i+'.png')
                  }
                  catch (err) {
                      console.log("錯誤啊!!!")
                      succ = false
                  }
              }
              if (succ) {
                  const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                  descriptions.push(detections.descriptor)
              }
          }
          labels_len--
          if (labels_len == 0 && !succ) {
              alert("名稱有誤, 請重新確認!!");
              window.location.reload()
          }
          return new faceapi.LabeledFaceDescriptors(label, descriptions)
      })
  )
}

// 取得元素位置
function getPosition (element) {
    var x = 0;
    var y = 0;
    while ( element ) {
      x += element.offsetLeft - element.scrollLeft + element.clientLeft;
      y += element.offsetTop - element.scrollLeft + element.clientTop;
      element = element.offsetParent;
    }
    return { x: x, y: y };
  }
