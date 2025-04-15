let img1, img2;
let blendSpeed = 1.0;

let scaledW, scaledH;
let imgGraphics1, imgGraphics2;

function preload() {
  img1 = loadImage('data/imgs/000017.png');
  img2 = loadImage('data/imgs/000038.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  noSmooth();
  noiseDetail(4, 0.5);

  // Scale image to half screen size (maintain aspect ratio)
  let scaleFactor = 0.5;
  scaledW = floor(windowWidth * scaleFactor);
  scaledH = floor(windowHeight * scaleFactor);

  // Resize based on the smaller axis to maintain aspect
  let ar1 = img1.width / img1.height;
  if (scaledW / scaledH > ar1) {
    scaledW = floor(scaledH * ar1);
  } else {
    scaledH = floor(scaledW / ar1);
  }

  // Create resized versions in graphics buffers
  imgGraphics1 = createGraphics(scaledW, scaledH);
  imgGraphics2 = createGraphics(scaledW, scaledH);
  imgGraphics1.image(img1, 0, 0, scaledW, scaledH);
  imgGraphics2.image(img2, 0, 0, scaledW, scaledH);
}

function draw() {
  background(0);
  loadPixels();
  imgGraphics1.loadPixels();
  imgGraphics2.loadPixels();

  let xOffset = floor((width - scaledW) / 2);
  let yOffset = floor((height - scaledH) / 2);

  let t = millis() * 0.0001 * blendSpeed;

  for (let y = 0; y < scaledH; y++) {
    for (let x = 0; x < scaledW; x++) {
      let i = y * scaledW + x;
      let pi = i * 4;

      let scale = 0.005;
      let n = noise(x * scale, y * scale, t);
      let drift = 0.1 * sin(t * 0.5);
      let blendFactor = smoothstep(0.3 + drift, 0.7 + drift, n);

      let c1 = color(
        imgGraphics1.pixels[pi],
        imgGraphics1.pixels[pi + 1],
        imgGraphics1.pixels[pi + 2],
        imgGraphics1.pixels[pi + 3]
      );

      let c2 = color(
        imgGraphics2.pixels[pi],
        imgGraphics2.pixels[pi + 1],
        imgGraphics2.pixels[pi + 2],
        imgGraphics2.pixels[pi + 3]
      );

      let c = lerpColor(c1, c2, blendFactor);

      let screenX = x + xOffset;
      let screenY = y + yOffset;
      if (screenX >= 0 && screenX < width && screenY >= 0 && screenY < height) {
        let screenIndex = 4 * (screenX + screenY * width);
        pixels[screenIndex]     = red(c);
        pixels[screenIndex + 1] = green(c);
        pixels[screenIndex + 2] = blue(c);
        pixels[screenIndex + 3] = 255;
      }
    }
  }

  updatePixels();
}

function smoothstep(edge0, edge1, x) {
  let t = constrain((x - edge0) / (edge1 - edge0), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}
