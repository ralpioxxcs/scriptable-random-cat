// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: arrows-alt;

/* -----------------------------------------------
Script      : randomCat.js
Author      : ralpioxx@gmail.com
Version     : 1.0.0
Repository  : https://github.com/ralpioxxcs/scriptable-random-cat
Description :
  A Widget to display cat randomly
Changelog   :
  v1.0.0 | 28 Feb 2022
    - Initial release
----------------------------------------------- */

const version = "1.0.0";

const colors = {
  bg1: "#282a36",
  bg2: "#44475a",
  fg: "#f8f8f2",
  cyan: "#8be9fd",
  purple: "#bd93f9",
  pink: "#ff79c6",
};

// get cat image & links
const getRandomCat = async () => {
  const reqUrl = `https://api.thecatapi.com/v1/images/search`;
  const resp = new Request(reqUrl);

  try {
    let data = await resp.loadJSON();
    console.log("response length : " + data.length);

    const imgUrl = data[0].url;
    const imgReq = new Request(imgUrl);
    let pic = await imgReq.loadImage();

    return {
      img: pic,
      link: imgUrl,
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

let catResult;
let catImg, catImgLink, catBreeds, catDescrption;

try {
  catResult = await getRandomCat();

  catImg = catResult.img;
  catImgLink = catResult.link;
  // catBreeds = catResult.breed;
  // catDescrption = catResult.description;

  console.log("success to load cat");
} catch (err) {
    errorLayout("failed to load image");
}

// initialize widget layout
const createWidget = () => {
  let widget = new ListWidget();
  widget.backgroundImage = catImg;
  widget.url = catImgLink;
  widget.addSpacer();

  let title = widget.addText("Meow 🐱");
  title.font = Font.thinSystemFont(15);
  title.textColor = Color.white();
  title.leftAlignText();

  let nextRefresh = Date.now() + 1000*60; // 1 minutes refresh
  widget.refreshAfterDate = new Date(nextRefresh);

  return widget;
};


const errorLayout = (message) => {
  let widget = new ListWidget();
  widget.backgroundColor = new Color(colors.bg1);

  let errorTx = widget.addText(message);
  errorTx.font = Font.thinSystemFont(16);
  errorTx.textColor = new Color(colors.fg);
  errorTx.centerAlignText();

  return widget;
};

// Launch widget
Script.name = "random_cat";
let widget = createWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else {
  widget.presentSmall();
}
