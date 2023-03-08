const chooseImg = document.querySelector(".choose-img"),
  saveImgBtn = document.querySelector(".save-img"),
  fileInput = document.querySelector(".file-input"),
  filterOption = document.querySelectorAll(".filter button"),
  rotateBtn = document.querySelectorAll(".rotate button"),
  previewImg = document.querySelector(".preview-img img"),
  filterName = document.querySelector(".filter-info .name"),
  filterValue = document.querySelector(".filter-info .value"),
  resetFilterBtn = document.querySelector(".reset-filter"),
  filterSlider = document.querySelector(".slider input");

let brightness = 100,
  saturation = 100,
  inversion = 0,
  greyScale = 0;

let rotate = 0,
  horizontal = 1,
  vertical = 1;

const applyFilter = () => {
  previewImg.style.transform = `rotate(${rotate}deg) scale(${horizontal}, ${vertical})`;
  previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayScale(${greyScale}%)`;
};

// Show selected image
const loadImage = () => {
  let file = fileInput.files[0]; //  Getting selected image
  if (!file) return; // Return if user hasn't select image
  previewImg.src = URL.createObjectURL(file); // URL.createObjectURL create a url of a passed file object
  previewImg.addEventListener("load", () => {
    resetFilterBtn.click(); // Clicking reset button so the filter value reset if user selected new image
    document.querySelector(".container").classList.remove("disable");
  });
};

// Clicking Filter Option buttons
filterOption.forEach((option) => {
  option.addEventListener("click", () => {
    // adding event listener to all filter buttons
    document.querySelector(".filter .active").classList.remove("active");
    option.classList.add("active");
    filterName.innerText = option.innerText;

    if (option.id === "brightness") {
      filterSlider.max = 200;
      filterSlider.value = brightness;
      filterValue.innerText = `${brightness}%`;
    } else if (option.id === "saturation") {
      filterSlider.max = 200;
      filterSlider.value = saturation;
      filterValue.innerText = `${saturation}%`;
    } else if (option.id === "inversion") {
      filterSlider.max = 100;
      filterSlider.value = inversion;
      filterValue.innerText = `${inversion}%`;
    } else {
      filterSlider.max = 100;
      filterSlider.value = greyScale;
      filterValue.innerText = `${greyScale}%`;
    }
  });
});

const updateFilter = () => {
  filterValue.innerText = `${filterSlider.value}%`; // Showing fliter slider value
  const selectedFilter = document.querySelector(".filter .active"); // Getting selected filter btn

  if (selectedFilter.id === "brightness") {
    brightness = filterSlider.value; // if the selected filter is brightness pass slider value as brightness value
  } else if (selectedFilter.id === "saturation") {
    saturation = filterSlider.value;
  } else if (selectedFilter.id === "inversion") {
    inversion = filterSlider.value;
  } else {
    greyScale = filterSlider.value;
  }
  applyFilter();
};

rotateBtn.forEach((option) => {
  // adding event listener to all rotate buttons
  option.addEventListener("click", () => {
    if (option.id === "left") {
      rotate -= 90; // If clicked btn is left decrease rotate value by 90
    } else if (option.id === "right") {
      rotate += 90; // If clicked btn is left increase rotate value by 90
    } else if (option.id === "horizontal") {
      horizontal = horizontal === 1 ? -1 : 1; // If horizontal value is 1 set to -1 else set to 1
    } else {
      vertical = vertical === 1 ? -1 : 1; // If vertical value is 1 set to -1 else set to 1
    }
    applyFilter();
  });
});

const resetFilter = () => {
  // Reseting all variable value to its default value
  brightness = 100;
  saturation = 100;
  inversion = 0;
  greyScale = 0;

  rotate = 0;
  horizontal = 1;
  vertical = 1;
  filterOption[0].click(); // Clicking brigtness btn, so brightness selected by default
  applyFilter();
};

const saveImage = () => {
  let canvas = document.createElement("canvas"); // Creating canvas element
  const ctx = canvas.getContext("2d"); // canvas.getContext return a drawing context on canvas
  canvas.width = previewImg.naturalWidth; // Setting canvas width to actual image width
  canvas.height = previewImg.naturalHeight; // Setting canvas height to actual image
  // Applying user selected filter to canvas
  ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayScale(${greyScale}%)`;
  // Appling horizontal / vertical flip
  ctx.translate(canvas.width / 2, canvas.height / 2); // Translating canvas from center
  if (rotate !== 0) {
    ctx.rotate((rotate * Math.PI) / 180);
  }
  ctx.scale(horizontal, vertical);
  ctx.drawImage(
    previewImg,
    -canvas.width / 2,
    -canvas.height / 2,
    canvas.width,
    canvas.height
  ); // drawImage(image to draw, dx, dy, dwidth, dheight) provide diff ways to draw an image onto canvas
  const link = document.createElement("a"); // Creating <a> element
  link.download = "image/jpg"; // Passing <a> tag download value to "image/jpg"
  link.href = canvas.toDataURL(); // Passing <a> tag value to canvas data url
  link.click(); // Clicking <a> tag, so the image download
};

// Showing user selected image
fileInput.addEventListener("change", loadImage);
// Updating slider value
filterSlider.addEventListener("input", updateFilter);
// Working on reset filter button
resetFilterBtn.addEventListener("click", resetFilter);
// Clicking choose img btn on clicking file input
chooseImg.addEventListener("click", () => fileInput.click());
// Save image button
saveImgBtn.addEventListener("click", saveImage);
