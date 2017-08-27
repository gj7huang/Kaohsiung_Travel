var selectPageBar = document.querySelector('.selectPageBar');
var zoneListElement = document.querySelector('.zoneList');
var hotNowBox = document.querySelector('.hotNowBox');
var selectedZone = '';
var selectedPage = 1;
var pageTotalNum = 1;
var selectedZoneAttractions = [];
var itemNum = 8;

// Pre-operation

// function setItemNum() {
//   console.log(window.innerWidth);
//   if(window.innerWidth < 420) {
//     itemNum = 4;
//   }else if( 420 <= window.innerWidth && window.innerWidth < 960) {
//     itemNum = 6;
//   }else {
//     itemNum = 8;
//   }
// }
// setItemNum();
const zoneList = data.reduce((obj, item) => {
  if(!obj[item.Zone]){
  	obj[item.Zone] = 0;
  }
  obj[item.Zone]++;
  return obj;
},{});
Object.freeze(zoneList);
console.log(zoneList);

const orderZoneList = Object.keys(zoneList).map((k) => {
  return {
    key: k,
    value: zoneList[k]
  }
}).sort((a, b)=> b.value - a.value ).slice(0,5);
Object.freeze(orderZoneList);
console.log(orderZoneList);

(function setzoneListElement() {
  for (let key in zoneList) { //適用在物件
    let item = document.createElement('option');
    item.setAttribute('value', key);
    console.log(key);
    item.textContent = key;
    zoneListElement.appendChild(item);
  }
})();
(function setHotNowBox() {
  let str = orderZoneList.map((obj, index)=> {
    return '<button class="hotZoneBtn'+index+'" value="'+obj.key+'">'+obj.key+'</button>'
  }).join('');
  hotNowBox.innerHTML = str;
})();

// operation
function btnShowContent(e) {
  if(e.target.nodeName === 'DIV'){return}
  showContent(e);
}
function showContent(e) {
  if(selectedZone === e.target.value){return}
  selectedZone = e.target.value;
  // console.log(e.target.nodeName);
  selectedZoneAttractions = data.filter(function(value, index, arr) {
    return arr[index].Zone  === selectedZone;
  });
  // console.log(pageTotalNum);
  setAreaTitle();
  setSelectPageBar();
  setAttractionsList(selectedPage); // page 1
}
function setAreaTitle() {
  let areaTitle = document.querySelector('.zoneTitle');
  areaTitle.textContent = selectedZone;
}
function setAttractionsList(changePage) {
  // console.log('changePage');
  selectedPage = changePage;
  // console.log('Page:'+ changePage);
  let attractionsList = document.querySelector('.attractionsList');
  let str = '';
  let attractionsInedx = (changePage-1)*itemNum;
  for(let index=attractionsInedx;(index < attractionsInedx+itemNum) && (zoneList[selectedZone] > index);index++) {
    // console.log(index);
  // for(let index of Object.keys(selectedZoneAttractions)){
    // Id, Name, Zone, Opentime, Add, Tel, Ticketinfo
    if((index+1)%itemNum === 0){
      str += '<div class="attractions num'+itemNum+'"><div class="attractionsPic" style="background-image:url('+selectedZoneAttractions[index].Picture1+')"><h3 class="attractionsName">'+ selectedZoneAttractions[index].Name +'</h3><h4 class="attractionsZone">'+ selectedZoneAttractions[index].Zone +'</h4></div><ul class="attractionsInfo"><li class="openTime">'+ selectedZoneAttractions[index].Opentime +'</li><li class="add">'+ selectedZoneAttractions[index].Add +'</li><li class="tel">'+ selectedZoneAttractions[index].Tel +'</li><li class="ticketInfo">'+ selectedZoneAttractions[index].Ticketinfo +'</li></ul><a class="goTop" href="#zoneList">o</a></div>';
    }else {
      str += '<div class="attractions"><div class="attractionsPic" style="background-image:url('+selectedZoneAttractions[index].Picture1+')"><h3 class="attractionsName">'+ selectedZoneAttractions[index].Name +'</h3><h4 class="attractionsZone">'+ selectedZoneAttractions[index].Zone +'</h4></div><ul class="attractionsInfo"><li class="openTime">'+ selectedZoneAttractions[index].Opentime +'</li><li class="add">'+ selectedZoneAttractions[index].Add +'</li><li class="tel">'+ selectedZoneAttractions[index].Tel +'</li><li class="ticketInfo">'+ selectedZoneAttractions[index].Ticketinfo +'</li></ul></div>';
    }
  }
  attractionsList.innerHTML = str;
  checkPage(changePage);
}
function setSelectPageBar() {
  pageTotalNum = Math.ceil(zoneList[selectedZone]/itemNum);
  let str = '<a class="prev" href="#footer" data-pagekey="prev">< prev</a>';
  for (var i = 1; i <= pageTotalNum; i++) {
    str += '<a class="page" href="#footer" data-pagekey="'+ i +'">'+ i +'</a>';
  }
  str += '<a class="next" href="#footer" data-pagekey="next">next ></a>';
  selectPageBar.innerHTML = str;
}
function changePage(e) {
  e.stopPropagation();
  if(e.target.nodeName === 'DIV'){return}
  if(e.target.dataset.pagekey === 'next') {
    if(selectedPage < pageTotalNum){
      // console.log('next');
      setAttractionsList(++selectedPage);
    }
  }else if(e.target.dataset.pagekey === 'prev'){
    if(selectedPage > 1){
      // console.log('prev');
      setAttractionsList(--selectedPage);
    }
  }else {
    let pageNum = parseInt(e.target.dataset.pagekey);
    if(typeof(pageNum) === 'number' && !(selectedPage === pageNum)){
      // console.log('jump');
      setAttractionsList(parseInt(e.target.dataset.pagekey));
    }
  }
}
function checkPage(page) {
  let prev = document.querySelector('.prev');
  let next = document.querySelector('.next');
  if(page === 1) {
    if(page === pageTotalNum){
      prev.setAttribute('style','color: RGBA(200, 200, 200, 1.00);');
      next.setAttribute('style','color: RGBA(200, 200, 200, 1.00);');
    }else{
      prev.setAttribute('style','color: RGBA(200, 200, 200, 1.00);');
      next.setAttribute('style','color: #000;');
    }
  }else if(page === pageTotalNum) {
    next.setAttribute('style','color: RGBA(200, 200, 200, 1.00)');
    prev.setAttribute('style','color: #000;');
  }else {
    prev.setAttribute('style','color: #000;');
    next.setAttribute('style','color: #000;');
  }
}
zoneListElement.addEventListener('change',showContent);
hotNowBox.addEventListener('click',btnShowContent);
selectPageBar.addEventListener('click',changePage);
// window.addEventListener('resize', setItemNum);
