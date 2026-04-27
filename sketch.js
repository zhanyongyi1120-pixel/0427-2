// Hand Pose Detection with ml5.js
// https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose

let video;
let handPose;
let hands = [];

function preload() {
  // Initialize HandPose model with flipped video input
  handPose = ml5.handPose({ flipped: true });
}

function mousePressed() {
  console.log(hands);
}

function gotHands(results) {
  hands = results;
}

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 擷取攝影機影像，並設定鏡像翻轉
  video = createCapture(VIDEO, { flipped: true });
  video.hide();

  // Start detecting hands
  handPose.detectStart(video, gotHands);
}

function draw() {
  // 設定畫布背景顏色
  background('#e7c6ff');

  // 計算顯示影像的寬高 (全螢幕寬高的 50%)
  let vW = width * 0.5;
  let vH = height * 0.5;
  // 計算置中座標
  let x = (width - vW) / 2;
  let y = (height - vH) / 2;

  // 在視窗中間顯示影像
  image(video, x, y, vW, vH);
  
  // 取得影片原始解析度
  let imgW = video.elt.videoWidth;
  let imgH = video.elt.videoHeight;

  // 確保偵測到手部且影片已載入
  if (hands.length > 0 && imgW > 0) {
    for (let hand of hands) {
      if (hand.confidence > 0.1) {
        // Loop through keypoints and draw circles
        for (let i = 0; i < hand.keypoints.length; i++) {
          let keypoint = hand.keypoints[i];

          // 將原始影片座標映射到畫布上顯示影像的範圍內 (置中且 50% 大小)
          let mappedX = map(keypoint.x, 0, imgW, x, x + vW);
          let mappedY = map(keypoint.y, 0, imgH, y, y + vH);

          fill(hand.handedness == "Left" ? [255, 0, 255] : [255, 255, 0]);
          noStroke();
          circle(mappedX, mappedY, 16);
        }
      }
    }
  }
}

function windowResized() {
  // 當視窗大小改變時，重新調整畫布大小
  resizeCanvas(windowWidth, windowHeight);
}
