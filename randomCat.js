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
  v1.1.0 | 05 Mar 2022
    - Add breeds description section
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

// generated from getBreeds.js 
const breedIds = [
  "abys",
  "aege",
  "abob",
  "acur",
  "asho",
  "awir",
  "amau",
  "amis",
  "bali",
  "bamb",
  "beng",
  "birm",
  "bomb",
  "bslo",
  "bsho",
  "bure",
  "buri",
  "cspa",
  "ctif",
  "char",
  "chau",
  "chee",
  "csho",
  "crex",
  "cymr",
  "cypr",
  "drex",
  "dons",
  "lihu",
  "emau",
  "ebur",
  "esho",
  "hbro",
  "hima",
  "jbob",
  "java",
  "khao",
  "kora",
  "kuri",
  "lape",
  "mcoo",
  "mala",
  "manx",
  "munc",
  "nebe",
  "norw",
  "ocic",
  "orie",
  "pers",
  "pixi",
  "raga",
  "ragd",
  "rblu",
  "sava",
  "sfol",
  "srex",
  "siam",
  "sibe",
  "sing",
  "snow",
  "soma",
  "sphy",
  "tonk",
  "toyg",
  "tang",
  "tvan",
  "ycho",
];

// get cat image & links
const getRandomCat = async (breed) => {
  const reqUrl =
    `https://api.thecatapi.com/v1/images/search?breed_id=` + breed;
  const resp = new Request(reqUrl);

  try {
    let data = await resp.loadJSON();
    console.log("response length : " + data.length);
    // console.log("desc : " + data[0].breeds[0].description);

    const breedInfo = data[0].breeds[0];
    const imgUrl = data[0].url;
    const imgReq = new Request(imgUrl);
    let pic = await imgReq.loadImage();

    return {
      img: pic,
      link: imgUrl,
      name: breedInfo.name, 
      desc : breedInfo.description
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

let catResult;
let catImg, catImgLink, catBreeds, catDescrption;

try {
  const ranNum = getRandomInt(0, breedIds.length);
  const breed = breedIds[ranNum];

  catResult = await getRandomCat(breed);

  catImg = catResult.img;
  catImgLink = catResult.link;
  catBreeds = catResult.name;
  catDescrption = catResult.desc;

  console.log("success to load cat");
} catch (err) {
  errorLayout("failed to load image");
}

// initialize widget layout
const createWidget = () => {
  let widget = new ListWidget();

  let grad = new LinearGradient();
  let startColor = new Color(colors.bg1);
  let endColor = new Color(colors.bg2);
  grad.colors = [startColor, endColor];
  grad.locations = [0.25, 1];
  widget.backgroundGradient = grad;
  widget.backgroundColor = new Color(colors.bg1);

  widget.addImage(catImg);
  widget.url = catImgLink;
  widget.addSpacer();

  let title = widget.addText("Meow 🐱");
  title.font = Font.thinSystemFont(15);
  title.textColor = Color.white();
  title.leftAlignText();

  let name = widget.addText(catBreeds);
  name.leftAlignText();

  let desc = widget.addText(catDescrption);
  desc.font = Font.thinSystemFont(10);
  desc.rightAlignText();

  let nextRefresh = Date.now() + 1000 * 60; // 1 minutes refresh
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
