/*
 Copyright 1996 Adobe. All Rights Reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

window.s_account="exturnodatest"

window.s=s_gi(s_account)
/************************** CONFIG SECTION **************************/
s.charSet="UTF-8"
s.cookieDomainPeriods="3"
/* Conversion Config */
s.currencyCode="JPY"
/* Link Tracking Config */
s.trackDownloadLinks=true
s.trackExternalLinks=true
s.linkDownloadFileTypes="avi,css,csv,doc,docx,eps,exe,jpg,js,m4v,mov,mp3,pdf,png,ppt,pptx,rar,svg,tab,txt,vsd,vxd,wav,wma,wmv,xls,xlsx,xml,zip"
s.linkInternalFilters="javascript:,mailto:,tel:,ex-ture.com,ex-ture.jp,stills.html.xdomain.jp"
s.linkLeaveQueryString=true
s.linkTrackVars="None"
s.linkTrackEvents="None"
s.debugTracking=false 
s.useForcedLinkTracking=false
s.trackingServer="noda.sc.omtrdc.net"

/* Plugin Config */
s.usePlugins=true

function s_doPlugins() {

   // clickイベントのevent等を上書きしないためにPV系の値設定をするか判定
   if (s.linkTrackVars !== "None") return;

   // 共通設定
   setAADataCommon();

   // TOP
   setAADataTop();
    
   // 検索結果
   setAASearchResult();

   // ショップ
   setAAShop();

   // カテゴリ
   setAACategory();

   // 商品詳細
   setAAProduct();

   // カート
   setAACart();

   // 支払い
   setAACheckout();

   //　注文完了
   setAAPurchase();

}
s.doPlugins=s_doPlugins

// Event設定
setAADataCommonEvents();
setAADataCheckoutEvents();
setAAProductEvents();

/**
 * Adobe 共通設定
 */
function setAADataCommon() {
   const pageNamePrms = "s,post_type,reset-link-sent,show-reset-form,password-reset";
   // TOPページと検索結果画面を別画面扱いする
	s.pageName = getPageName("", pageNamePrms);
   s.campaign = getQueryParam("cid");
   s.server = location.hostname;

   // Home / EC 以外の設定を追加する場合を想定して関数化（例：Blog等）
   setAAChannel();

   s.prop1 = document.title;
   s.prop2 = "D=g";
   s.prop3 = getYMD(true);
   s.prop4 = getNewRepeat();

   getPercentPageViewed(s.pageName);

   if (_ppvPreviousPage !== s.pageName) {
      s.prop5 = _ppvPreviousPage;
      s.prop6 = _ppvHighestPercentViewed;
   }

   const splitedPathName = location.pathname.split("/");
   if (!!splitedPathName[1]) s.prop7 = splitedPathName[1];
   if (!!splitedPathName[2]) s.prop8 = splitedPathName[2];
   if (!!splitedPathName[3]) s.prop9 = splitedPathName[3];

   s.eVar1 = "D=c1";
   s.eVar2 = "D=c2";
   s.eVar3 = "D=c3";
   s.eVar4 = "D=c4";
   s.eVar5 = "D=c5";
   s.eVar6 = "D=c6";
   s.eVar7 = "D=c7";
   s.eVar8 = "D=c8";
   s.eVar9 = "D=c9";

}

const itemRemove = ((e) => {
   const self = e.currentTarget;
   const btnText = self.getAttribute("aria-label");
   const parentTr = self.closest("tr");
   s.eVar31 = parentTr.querySelector(".wc-block-components-product-name").textContent.trim();
   s.eVar32 = getNumberOnly(parentTr.querySelector(".wc-block-cart-item__prices").textContent);
   s.events = "scRemove";
   s.linkTrackVars = "events,eVar31,eVar32";
   s.linkTrackEvents = "scRemove";

   s.tl(true,"o",btnText);
});

function setRemoveCart(e) {
   const removeBtns = [...document.querySelectorAll(".wc-block-cart-item__remove-link")];
   removeBtns.forEach((btn) => {
      btn.removeEventListener("click", itemRemove);
      btn.addEventListener("click", itemRemove);
   });
}

/**
 * Adobe 共通設定 - イベント
 */
function setAADataCommonEvents() {

   // 一覧系のカート追加ボタン
   const listCartBtns = [...document.querySelectorAll(".add_to_cart_button")];
   listCartBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
         const self = e.currentTarget;
         const linkText = self.getAttribute("aria-label");
         s.eVar30 = self.dataset.product_id;
         const parentLI = self.closest("li");
         s.eVar31 = parentLI.querySelector(".wp-block-post-title").textContent.trim();
         s.eVar32 = getNumberOnly(parentLI.querySelector(".amount").textContent);
         s.linkTrackVars = "events,eVar30,eVar31,eVar32";
         s.linkTrackEvents = "scAdd";
         s.events = "scAdd";
         
         const miniCartBadge = document.querySelector(".wc-block-mini-cart__badge");
         if (!miniCartBadge.textContent) {
            s.events = apl(s.events,"scOpen");
            s.linkTrackEvents = apl(s.linkTrackEvents,"scOpen");
         }
         
         s.tl(true,"o",linkText);
      });
   });
   
   //　ヘッダー・フッター共通イベント
   const judgeHeader = document.querySelector(".wc-blocks-pattern-header-essential");
   if (!judgeHeader) return;

   // SP メニューを開く
   const spNav = document.querySelector(".wp-block-navigation__responsive-container-open");
   spNav.addEventListener("click", (e) => {
      s.events = "event3";
      s.linkTrackVars = "events";
      s.linkTrackEvents = "event3";
      s.tl(true,"o","SP メニューを開く");
   });

   // ヘッダー・フッターリンク
   const headerLinks = [...document.querySelectorAll(".wp-block-navigation-item__content")];
   headerLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
         const self = e.currentTarget;
         const areaTxt = self.closest("header")? "Header": "Footer";
         s.tl(true,"o",`${areaTxt}-${self.textContent.trim()}`);
      });
   });

   // ミニカートクリック
   const miniCartBtn = document.querySelector(".wc-block-mini-cart");
   miniCartBtn.addEventListener("click", (e) => {
      s.events = "event4";
      s.linkTrackVars = "events";
      s.linkTrackEvents = "event4";
      s.tl(true,"o","ミニショッピングカート - クリック");
   });

   const bodyObserver = new MutationObserver(setRemoveCart);
   bodyObserver.observe(document.body, {childList: true, subtree: true});

   // フッター検索
   const searchBtn = document.querySelector("button.wp-block-search__button");
   searchBtn.addEventListener("click", (e) => {
      const input = document.querySelector("input.wp-block-search__input");
      setCookieSearchValue(input.value);
      s.tl(true,"o",`click - ${e.currentTarget.getAttribute("aria-label")}`);
   });
   
}

function setCookieSearchValue(val) {
   document.cookie = `search_product=${val};path=/;${val? "":"max-age=0"}`;
}

/**
 * Adobe 支払い設定 - イベント
 */
function setAADataCheckoutEvents() {
   if (location.pathname !== "/checkout/") return;
   setRemoveCart();
}

/**
 * Adobe 商品詳細設定 - イベント
 */
function setAAProductEvents() {
   if (location.pathname.indexOf("/product/") === -1) return;
   const cartBtn = document.querySelector(".single_add_to_cart_button");
   cartBtn.addEventListener("click", (e) => {
      const self = e.currentTarget;

      s.eVar30 = self.value;
      s.eVar31 = document.querySelector("h1.wp-block-post-title").textContent.trim();
      s.eVar32 = getNumberOnly(document.querySelector("h1 + div .amount").textContent);
     s.events = "scAdd";
     
      s.linkTrackVars = "events,eVar30,eVar31,eVar32";
      s.linkTrackEvents = "scAdd";      
      
      const miniCartBadge = document.querySelector(".wc-block-mini-cart__badge");
      if (!miniCartBadge.textContent) {
         s.events = apl(s.events,"scOpen");
         s.linkTrackEvents = apl(s.linkTrackEvents,"scOpen");
      }
      
      s.tl(true,"o","商品ページ - カート追加");
   });
}

/**
 * Adobe Top設定
 */
function setAADataTop() {
   if (location.pathname !== "/") return;
}

/**
 * Adobe 検索結果設定
 */
function setAASearchResult() {
   if (location.pathname !== "/" || !location.search.match(/^[¥?]s=.*/)) return;
   const productList = document.getElementsByClassName("products-block-post-template");
   s.prop10 = getQueryParam("s");
   s.events = !!productList.length? "event1": "event2";
   //　検索クリック時のクッキーをリセット
   setCookieSearchValue();
}

/**
 * Adobe ショップ設定
 */
function setAAShop() {
   if (location.pathname !== "/shop/") return;
   s.prop14 = getQueryParam("orderby");
   s.eVar14 = "D=c14";
}

/**
 * Adobe カテゴリ設定
 */
function setAACategory() {
   if (location.pathname.indexOf("/product-category/") === -1) return;
   setAABreadCrumbData();
}

/**
 * Adobe 商品詳細設定
 */
function setAAProduct() {
   if (location.pathname.indexOf("/product/") === -1) return;

   const searchVal = getCookieValue("search_product");
   setCookieSearchValue();
   if (!!searchVal) {
      s.events = "event1";
      s.prop10 = searchVal;
      s.eVar10 = "D=c10";
   }

   setAABreadCrumbData();
   setAAProductsData();
}

/**
 * Adobe カート設定
 */
function setAACart() {
   if (location.pathname.indexOf("/cart/") === -1) return;

   s.events = "scView";
   // categoryは出力されていないため未設定
   const cartItemBlocks = [...document.querySelectorAll(".wc-block-cart-items .wc-block-cart-items__row")];
   const productsData = cartItemBlocks.map((el) => {
      const itemNameEl = el.querySelector(".wc-block-components-product-name");
      const amountEl = el.querySelector(".wc-block-formatted-money-amount");
      const price = getNumberOnly(amountEl.textContent);
      const qtyEl = el.querySelector(".wc-block-components-quantity-selector__input");
      const subTotal = price * Number(qtyEl.value);
      return `;${itemNameEl.textContent};${qtyEl.value};${subTotal}`;
   });
   s.products = productsData.join(",");
}

/**
 * Adobe 支払い設定
 */
function setAACheckout() {
   if (location.pathname !== "/checkout/") return;
   // TODO SP時、Reactで動的に生成される項目のためPV時では取得できない。別途手を考える
   s.events = "scCheckout";
   const checkoutItems = [...document.querySelectorAll(".wc-block-components-order-summary__content .wc-block-components-order-summary-item")];
   const productsData = checkoutItems.map((el) => {
      const itemNameEl = el.querySelector(".wc-block-components-product-name");
      const amountEl = el.querySelector(".wc-block-formatted-money-amount");
      const price = getNumberOnly(amountEl.textContent);
      const qtyEl = el.querySelector(".wc-block-components-order-summary-item__quantity > span");
      const subTotal = price * Number(qtyEl.textContent);
      return `;${itemNameEl.textContent};${qtyEl.textContent};${subTotal}`;
   });
   s.products = productsData.join(",");
}

/**
 * Adobe 注文完了
 */
function setAAPurchase() {
   if (location.pathname.indexOf("/checkout/order-received/") === -1) return;
   s.events = "purchase";
   s.prop15 = getQueryParam("key");
   s.eVar15 = "D=c15";
   const orderInfos = [...document.querySelectorAll(".wc-block-order-confirmation-summary-list-item")];
   const purchaseEl = orderInfos.find((block) => block.textContent.indexOf("注文番号") !== -1);
   s.purchaseID = purchaseEl.querySelector(".wc-block-order-confirmation-summary-list-item__value").textContent.trim();
   const orderItems = [...document.querySelectorAll(".order_item")];
   const productsData = orderItems.map((el) => {
      const itemNameEl = el.querySelector("a");
      const amountEl = el.querySelector(".amount");
      const price = getNumberOnly(amountEl.textContent);
      const qtyEl = el.querySelector(".product-quantity");
      const qty = Number(getNumberOnly(qtyEl.textContent));
      const subTotal = price * qty;
      return `;${itemNameEl.textContent};${qty};${subTotal}`;
   });
   s.products = productsData.join(",");

}

/**
 * Adobe チャンネル設定
 */
function setAAChannel() {
   if (location.hostname === "/") {
      s.channel = "Home";
   } else {
      s.channel = "EC";
   }
}

/**
 * Adobe prop11,12設定（カテゴリ）
 */
function setAABreadCrumbData() {
   const breadcrumbTexts = document.querySelector(".woocommerce-breadcrumb").textContent;
   const aryBC = breadcrumbTexts.split("/");
   if(!!aryBC[1].trim()) {
      s.prop11 = aryBC[1].trim();
      s.eVar11 = "D=c11";
   }
   if(!!aryBC[2].trim()) {
      s.prop12 = aryBC[2].trim();
      s.eVar12 = "D=c12";
   }
}

/**
 * Adobe prop13, prodView設定（商品名、products）
 */
function setAAProductsData() {
   const itemNameEl = document.querySelector(".wp-block-post-title");
   s.prop13 = itemNameEl.textContent.trim();
   s.eVar13 = "D=c13";

   const qtyEl = document.querySelector(".quantity .qty");
   const amountEl = document.querySelector(".amount");
   const price = getNumberOnly(amountEl.textContent);
   const subTotal = price * Number(qtyEl.value);

   s.events = "prodView";
   s.products = `${s.prop12 || ""};${s.prop13};${qtyEl.value};${subTotal}`;
}

/************************** PLUGINS SECTION *************************/

/******************************************* BEGIN CODE TO DEPLOY *******************************************/
/* Adobe Consulting Plugin: getPageName v4.2 */
var getPageName=function(si,qv,hv,de){var a=si,b=qv,f=hv,e=de;if("-v"===a)return{plugin:"getPageName",version:"4.2"};a:{if("undefined"!==typeof window.s_c_il){var d=0;for(var g;d<window.s_c_il.length;d++)if(g=window.s_c_il[d],g._c&&"s_c"===g._c){d=g;break a}}d=void 0}"undefined"!==typeof d&&(d.contextData.getPageName="4.2");var c=location.hostname,h=location.pathname.substring(1).split("/"),l=h.length,k=location.search.substring(1).split("&"),m=k.length;d=location.hash.substring(1).split("&");g=d.length;e=e?e:"|";a=a?a:c;b=b?b:"";f=f?f:"";if(1===l&&""===h[0])a=a+e+"home";else for(c=0;c<l;c++)a=a+e+decodeURIComponent(h[c]);if(b&&(1!==m||""!==k[0]))for(h=b.split(","),l=h.length,c=0;c<l;c++)for(b=0;b<m;b++)if(h[c]===k[b].split("=")[0]){a=a+e+decodeURIComponent(k[b]);break}if(f&&(1!==g||""!==d[0]))for(f=f.split(","),k=f.length,c=0;c<k;c++)for(b=0;b<g;b++)if(f[c]===d[b].split("=")[0]){a=a+e+decodeURIComponent(d[b]);break}return a.substring(a.length-e.length)===e?a.substring(0,a.length-e.length):a};
/******************************************** END CODE TO DEPLOY ********************************************/

/******************************************* BEGIN CODE TO DEPLOY *******************************************/
/* Adobe Consulting Plugin: getQueryParam v4.0.1  */
function getQueryParam(a,d,f){function n(g,c){c=c.split("?").join("&");c=c.split("#").join("&");var e=c.indexOf("&");if(g&&(-1<e||c.indexOf("=")>e)){e=c.substring(e+1);e=e.split("&");for(var h=0,p=e.length;h<p;h++){var l=e[h].split("="),q=l[1];if(l[0].toLowerCase()===g.toLowerCase())return decodeURIComponent(q||!0)}}return""}if("-v"===a)return{plugin:"getQueryParam",version:"4.0.1"};var b=function(){if("undefined"!==typeof window.s_c_il)for(var g=0,c;g<window.s_c_il.length;g++)if(c=window.s_c_il[g],c._c&&"s_c"===c._c)return c}();"undefined"!==typeof b&&(b.contextData.getQueryParam="4.0");if(a){d=d||"";f=(f||"undefined"!==typeof b&&b.pageURL||location.href)+"";(4<d.length||-1<d.indexOf("="))&&f&&4>f.length&&(b=d,d=f,f=b);b="";for(var m=a.split(","),r=m.length,k=0;k<r;k++)a=n(m[k],f),"string"===typeof a?(a=-1<a.indexOf("#")?a.substring(0,a.indexOf("#")):a,b+=b?d+a:a):b=""===b?a:b+(d+a);return b}};
/******************************************** END CODE TO DEPLOY ********************************************/

/******************************************* BEGIN CODE TO DEPLOY *******************************************/
/* Adobe Consulting Plugin: getNewRepeat v3.0 (Requires AppMeasurement) */
function getNewRepeat(d){var a=d;if("-v"===a)return{plugin:"getNewRepeat",version:"3.0"};var d=function(){if("undefined"!==typeof window.s_c_il)for(var c=0,b;c<window.s_c_il.length;c++)if(b=window.s_c_il[c],b._c&&"s_c"===b._c)return b}();"undefined"!==typeof d&&(d.contextData.getNewRepeat="3.0");window.cookieWrite=window.cookieWrite||function(c,b,f){if("string"===typeof c){var h=window.location.hostname,a=window.location.hostname.split(".").length-1;if(h&&!/^[0-9.]+$/.test(h)){a=2<a?a:2;var e=h.lastIndexOf(".");if(0<=e){for(;0<=e&&1<a;)e=h.lastIndexOf(".",e-1),a--;e=0<e?h.substring(e):h}}g=e;b="undefined"!==typeof b?""+b:"";if(f||""===b)if(""===b&&(f=-60),"number"===typeof f){var d=new Date;d.setTime(d.getTime()+6E4*f)}else d=f;return c&&(document.cookie=encodeURIComponent(c)+"="+encodeURIComponent(b)+"; path=/;"+(f?" expires="+d.toUTCString()+";":"")+(g?" domain="+g+";":""),"undefined"!==typeof cookieRead)?cookieRead(c)===b:!1}};window.cookieRead=window.cookieRead||function(c){if("string"===typeof c)c=encodeURIComponent(c);else return"";var b=" "+document.cookie,a=b.indexOf(" "+c+"="),d=0>a?a:b.indexOf(";",a);return(c=0>a?"":decodeURIComponent(b.substring(a+2+c.length,0>d?b.length:d)))?c:""};a=a?a:30;d="s_nr"+a;var k=new Date,m=cookieRead(d),n=m.split("-"),l=k.getTime();k.setTime(l+864E5*a);if(""===m||18E5>l-n[0]&&"New"===n[1])return cookieWrite(d,l+"-New",k),"New";cookieWrite(d,l+"-Repeat",k);return"Repeat"};
/******************************************** END CODE TO DEPLOY ********************************************/

/******************************************* BEGIN CODE TO DEPLOY *******************************************/
/* Adobe Consulting Plugin: getPercentPageViewed v5.1 */
function getPercentPageViewed(pid,ch){var e=pid,i=ch;if("-v"===e)return{plugin:"getPercentPageViewed",version:"5.1"};var t=function(){if(void 0!==window.s_c_il){for(var e,i=0;i<window.s_c_il.length;i++)if((e=window.s_c_il[i])._c&&"s_c"===e._c)return e}}();function o(){if(window.ppvID){var e=Math.max(Math.max(document.body.scrollHeight,document.documentElement.scrollHeight),Math.max(document.body.offsetHeight,document.documentElement.offsetHeight),Math.max(document.body.clientHeight,document.documentElement.clientHeight)),i=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t=(window.pageYOffset||window.document.documentElement.scrollTop||window.document.body.scrollTop)+i,o=Math.min(Math.round(t/e*100),100),n=Math.floor(e/i),p=Math.floor(t/i),s="";if(!window.cookieRead("s_tp")||decodeURIComponent(window.cookieRead("s_ppv").split(",")[0])!==window.ppvID||window.p_fo(window.ppvID)||!0==window.ppvChange&&window.cookieRead("s_tp")&&e!=window.cookieRead("s_tp")){if((decodeURIComponent(window.cookieRead("s_ppv").split(",")[0])!==window.ppvID||window.p_fo(window.ppvID+"1"))&&window.cookieWrite("s_ips",t),window.cookieRead("s_tp")&&decodeURIComponent(window.cookieRead("s_ppv").split(",")[0])===window.ppvID){window.cookieRead("s_tp");var a=window.cookieRead("s_ppv"),c=a.indexOf(",")>-1?a.split(","):[],d=c[0]?c[0]:"",r=window.cookieRead("s_ips"),l=c[3]?c[3]:"";s=d+","+Math.round(r/e*100)+","+Math.round(l/e*100)+","+o+","+l+","+n+","+p}window.cookieWrite("s_tp",e)}else s=window.cookieRead("s_ppv");var v=s&&s.indexOf(",")>-1?s.split(",",7):[],f=v.length>0?v[0]:encodeURIComponent(window.ppvID),$=v.length>1?parseInt(v[1]):o,h=v.length>2?parseInt(v[2]):o,u=v.length>4?parseInt(v[4]):t,k=v.length>5?parseInt(v[5]):n,m=v.length>6?parseInt(v[6]):p;o>0&&(s=f+","+$+","+(o>h?o:h)+","+o+","+(t>u?t:u)+","+(n>k?n:k)+","+(p>m?p:m)),window.cookieWrite("s_ppv",s)}}void 0!==t&&(t.contextData.getPercentPageViewed="5.1"),window.pageName=void 0!==t&&t.pageName||"",window.cookieWrite=window.cookieWrite||function(e,i,t){if("string"==typeof e){if(g=function(){var e=window.location.hostname,i=window.location.hostname.split(".").length-1;if(e&&!/^[0-9.]+$/.test(e)){i=2<i?i:2;var t=e.lastIndexOf(".");if(0<=t){for(;0<=t&&1<i;)t=e.lastIndexOf(".",t-1),i--;t=0<t?e.substring(t):e}}return t}(),i=void 0!==i?""+i:"",t||""===i){if(""===i&&(t=-60),"number"==typeof t){var o=new Date;o.setTime(o.getTime()+6e4*t)}else o=t}return!!e&&(document.cookie=encodeURIComponent(e)+"="+encodeURIComponent(i)+"; path=/;"+(t?" expires="+o.toUTCString()+";":"")+(g?" domain="+g+";":""),void 0!==window.cookieRead)&&window.cookieRead(e)===i}},window.cookieRead=window.cookieRead||function(e){if("string"!=typeof e)return"";e=encodeURIComponent(e);var i=" "+document.cookie,t=i.indexOf(" "+e+"="),o=0>t?t:i.indexOf(";",t);return(e=0>t?"":decodeURIComponent(i.substring(t+2+e.length,0>o?i.length:o)))?e:""},window.p_fo=window.p_fo||function(e){return window.__fo||(window.__fo={}),!window.__fo[e]&&(window.__fo[e]={},!0)};var n=window.cookieRead("s_ppv"),p=n.indexOf(",")>-1?n.split(","):[];p[0]=p.length>0?decodeURIComponent(p[0]):"",e=e||(window.pageName?window.pageName:document.location.href),void 0===i||!0==i?window.ppvChange=!0:window.ppvChange=!1,void 0!==t&&t.linkType&&"o"===t.linkType||(window.ppvID&&window.ppvID===e||(window.ppvID=e,window.cookieWrite("s_ppv",""),o()),window.p_fo("s_gppvLoad2")&&window.addEventListener&&(window.addEventListener("load",o,!1),window.addEventListener("click",o,!1),window.addEventListener("scroll",o,!1)),this._ppvPreviousPage=p[0]?p[0]:"",this._ppvInitialPercentViewed=p[1]?p[1]:"",this._ppvHighestPercentViewed=p[2]?p[2]:"",this._ppvFinalPercentViewed=p[3]?p[3]:"",this._ppvHighestPixelsSeen=p[4]?p[4]:"",this._ppvFoldsAvailable=p[5]?p[5]:"",this._ppvFoldsSeen=p[6]?p[6]:"")}
/******************************************** END CODE TO DEPLOY ********************************************/

/******************************************* BEGIN CODE TO DEPLOY *******************************************/
/* Adobe Consulting Plugin: apl (appendToList) v4.0 */
function apl(lv,va,d1,d2,cc){var b=lv,d=va,e=d1,c=d2,g=cc;if("-v"===b)return{plugin:"apl",version:"4.0"};var h=function(){if("undefined"!==typeof window.s_c_il)for(var k=0,b;k<window.s_c_il.length;k++)if(b=window.s_c_il[k],b._c&&"s_c"===b._c)return b}();"undefined"!==typeof h&&(h.contextData.apl="4.0");window.inList=window.inList||function(b,d,c,e){if("string"!==typeof d)return!1;if("string"===typeof b)b=b.split(c||",");else if("object"!==typeof b)return!1;c=0;for(a=b.length;c<a;c++)if(1==e&&d===b[c]||d.toLowerCase()===b[c].toLowerCase())return!0;return!1};if(!b||"string"===typeof b){if("string"!==typeof d||""===d)return b;e=e||",";c=c||e;1==c&&(c=e,g||(g=1));2==c&&1!=g&&(c=e);d=d.split(",");h=d.length;for(var f=0;f<h;f++)window.inList(b,d[f],e,g)||(b=b?b+c+d[f]:d[f])}return b};
/******************************************** END CODE TO DEPLOY ********************************************/

/**
 * 現在日時をYYYY/MM/DD hh:mm:ss形式で取得する
 * @param isHour 時分秒表示フラグ
 * @returns YYYY/MM/DD hh:mm:ss
 */
function getYMD(isHour = false) {
   var date = new Date();
   var yyyy = date.getFullYear();
   var mm = getLPad(date.getMonth() + 1, 2);
   var dd = getLPad(date.getDay() , 2);
   var ret = `${yyyy}/${mm}/${dd}`
   if (!isHour) return ret;
   var h = getLPad(date.getHours(), 2);
   var m = getLPad(date.getMinutes(), 2);
   var s = getLPad(date.getSeconds(), 2);
   return `${ret} ${h}:${m}:${s}`;
}

/**
 * 左埋めした値を取得する
 * @param val 置換する値
 * @param digit 桁数
 * @param word 追加する文字列
 * @returns valに対してdigit分wordを追加した文字列
 */
function getLPad(val,  digit, word = "0") {
   var linkage = "";
   for (var i = 0; i < digit; i++) {
       linkage += word;
   }
   return (linkage + val).slice(-1 * digit);
 }

 /**
  * 数値と文字列が混在した文字列から数値のみ取得する
  * 数値部分がない場合、0を返却
  * @param {String} trgt 数値と文字列が混在した文字列
  * @returns {Number} 数値
  */
 function getNumberOnly(trgt) {
   const replaced = trgt.replace(/[^0-9]/g, '');
   return replaced? Number(replaced): 0;
 }

 /**
 * クッキーの値を取得する
 * @param trgt cookie name
 * @returns cookie value
 */
function getCookieValue(trgt) {
   var cks = document.cookie.split(";");
   var ret = "";
   for (var i = 0; i < cks.length; i++) {
       var ck = cks[i].split("=");
       if (ck[0].trim() === trgt) {
           ret = ck[1].trim();
           break;
       }
   }
   return ret;
 }

/*

 Start ActivityMap Module

 The following module enables ActivityMap tracking in Adobe Analytics, offering
 data overlays on links and content for user engagement analysis. If not required,
 remove this code block from AppMeasurement.js.
 Implementation guide: https://adobe.ly/3UddQ2L
*/
function AppMeasurement_Module_ActivityMap(k){function p(){var a=f.pageYOffset+(f.innerHeight||0);a&&a>+g&&(g=a)}function q(){if(e.scrollReachSelector){var a=k.d.querySelector&&k.d.querySelector(e.scrollReachSelector);a?(g=a.scrollTop||0,a.addEventListener("scroll",function(){var d;(d=a&&a.scrollTop+a.clientHeight||0)>g&&(g=d)})):0<v--&&setTimeout(q,1E3)}}function l(a,d){var b,c,n;if(a&&d&&(b=e.c[d]||(e.c[d]=d.split(","))))for(n=0;n<b.length&&(c=b[n++]);)if(-1<a.indexOf(c))return null;return a}function r(a,
d,b,c,e){var f,h;if(a.dataset&&(h=a.dataset[d]))f=h;else if(a.getAttribute)if(h=a.getAttribute("data-"+b))f=h;else if(h=a.getAttribute(b))f=h;if(!f&&k.useForcedLinkTracking&&e){var g;a=a.onclick?""+a.onclick:"";d="";if(c&&a&&(b=a.indexOf(c),0<=b)){for(b+=c.length;b<a.length;)if(h=a.charAt(b++),0<="'\"".indexOf(h)){g=h;break}for(var l=!1;b<a.length&&g;){h=a.charAt(b);if(!l&&h===g)break;"\\"===h?l=!0:(d+=h,l=!1);b++}}(g=d)&&(k.w[c]=g)}return f||e&&k.w[c]}function s(a,d,b){var c;return(c=e[d](a,b))&&
l(m(c),e[d+"Exclusions"])}function t(a,d,b){var c;if(a&&!(1===(c=a.nodeType)&&(c=a.nodeName)&&(c=c.toUpperCase())&&w[c])&&(1===a.nodeType&&(c=a.nodeValue)&&(d[d.length]=c),b.a||b.t||b.s||!a.getAttribute||((c=a.getAttribute("alt"))?b.a=c:(c=a.getAttribute("title"))?b.t=c:"IMG"==(""+a.nodeName).toUpperCase()&&(c=a.getAttribute("src")||a.src)&&(b.s=c)),(c=a.childNodes)&&c.length))for(a=0;a<c.length;a++)t(c[a],d,b)}function m(a){if(null==a||void 0==a)return a;try{return a.replace(RegExp("^[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+",
"mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]+$","mg"),"").replace(RegExp("[\\s\\n\\f\\r\\t\t-\r \u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u205f\u3000\ufeff]{1,}","mg")," ").substring(0,254)}catch(d){}}var e=this;e.s=k;var f=window;f.s_c_in||(f.s_c_il=[],f.s_c_in=0);e._il=f.s_c_il;e._in=f.s_c_in;e._il[e._in]=e;f.s_c_in++;e._c="s_m";var g=0,u,v=60;e.c={};var w={SCRIPT:1,STYLE:1,LINK:1,CANVAS:1};e._g=function(){var a,d,b,c=k.contextData,
e=k.linkObject;(a=k.pageName||k.pageURL)&&(d=s(e,"link",k.linkName))&&(b=s(e,"region"))&&(c["a.activitymap.page"]=a.substring(0,255),c["a.activitymap.link"]=128<d.length?d.substring(0,128):d,c["a.activitymap.region"]=127<b.length?b.substring(0,127):b,0<g&&(c["a.activitymap.xy"]=10*Math.floor(g/10)),c["a.activitymap.pageIDType"]=k.pageName?1:0)};e._d=function(){e.trackScrollReach&&!u&&(e.scrollReachSelector?q():(p(),f.addEventListener&&f.addEventListener("scroll",p,!1)),u=!0)};e.link=function(a,d){var b;
if(d)b=l(m(d),e.linkExclusions);else if((b=a)&&!(b=r(a,"sObjectId","s-object-id","s_objectID",1))){var c,f;(f=l(m(a.innerText||a.textContent),e.linkExclusions))||(t(a,c=[],b={a:void 0,t:void 0,s:void 0}),(f=l(m(c.join(""))))||(f=l(m(b.a?b.a:b.t?b.t:b.s?b.s:void 0)))||!(c=(c=a.tagName)&&c.toUpperCase?c.toUpperCase():"")||("INPUT"==c||"SUBMIT"==c&&a.value?f=l(m(a.value)):"IMAGE"==c&&a.src&&(f=l(m(a.src)))));b=f}return b};e.region=function(a){for(var d,b=e.regionIDAttribute||"id";a&&(a=a.parentNode);){if(d=
r(a,b,b,b))return d;if("BODY"==a.nodeName)return"BODY"}}}
/* End ActivityMap Module */
/*
 ============== DO NOT ALTER ANYTHING BELOW THIS LINE ! ===============
 AppMeasurement for JavaScript version: 2.26.0
 Implementation guide: https://adobe.ly/40OOIRT
*/
function AppMeasurement(r){var a=this;a.version="2.26.0";var h=window;h.s_c_in||(h.s_c_il=[],h.s_c_in=0);a._il=h.s_c_il;a._in=h.s_c_in;a._il[a._in]=a;h.s_c_in++;a._c="s_c";var q=h.AppMeasurement.Bc;q||(q=null);var p=h,m,s;try{for(m=p.parent,s=p.location;m&&m.location&&s&&""+m.location!==""+s&&p.location&&""+m.location!==""+p.location&&m.location.host===s.host;)p=m,m=p.parent}catch(u){}a.log=function(a){try{console.log(a)}catch(c){}};a.$a=function(a){return""+parseInt(a)==""+a};a.replace=function(a,
c,d){return!a||0>a.indexOf(c)?a:a.split(c).join(d)};a.escape=function(b){var c,d;if(!b)return b;b=encodeURIComponent(b);for(c=0;7>c;c++)d="+~!*()'".substring(c,c+1),0<=b.indexOf(d)&&(b=a.replace(b,d,"%"+d.charCodeAt(0).toString(16).toUpperCase()));return b};a.unescape=function(b){if(!b)return b;b=0<=b.indexOf("+")?a.replace(b,"+"," "):b;try{return decodeURIComponent(b)}catch(c){}return unescape(b)};a.yb=function(b){var c=a.fpCookieDomainPeriods,d;if(!a.Ta&&b&&!a.Jb(b)&&(c||(c=a.cookieDomainPeriods),
c||(c=a.xb(b)),c=c?parseInt(c):2,c=2<c?c:2,d=b.lastIndexOf("."),0<=d)){for(;0<=d&&1<c;)d=b.lastIndexOf(".",d-1),c--;a.Ta=0<d?b.substring(d):b}return a.Ta};a.Jb=function(a){return/^(?:\d{1,3}\.){3}\d{1,3}$/.test(a)||/^([a-f0-9:]+:+)+[a-f0-9]+$/.test(a)};a.ub=function(a){var c=[];a=a?a.split("."):[];var d;for(d=a.length-1;0<=d;d--)c.push(a.slice(d).join("."));return c};a.xb=function(b){var c="";b=a.ub(b);for(var d=0;d<b.length&&!a.cookieRead("s_ac");)c=b[d],d+=1,a.d.cookie=a.W("s_ac","1",{path:"/",
domain:c});a.d.cookie=a.W("s_ac","",{path:"/",domain:c,ma:new Date(0)});return d};a.c_r=a.cookieRead=function(b){b=a.escape(b);var c=" "+a.d.cookie,d=c.indexOf(" "+b+"="),f=0>d?d:c.indexOf(";",d);b=0>d?"":a.unescape(c.substring(d+2+b.length,0>f?c.length:f));return"[[B]]"!=b?b:""};a.c_w=a.cookieWrite=function(b,c,d){var f=a.yb(h.location.hostname),e=a.cookieLifetime,g;c=""+c;e=e?(""+e).toUpperCase():"";d&&"SESSION"!==e&&"NONE"!==e&&((g=""!=c?parseInt(e?e:0):-60)?(d=new Date,d.setTime(d.getTime()+1E3*
g)):1===d&&(d=new Date,g=d.getYear(),d.setYear(g+2+(1900>g?1900:0))));return b&&"NONE"!==e?(f={path:"/",domain:f,sc:a.writeSecureCookies},"SESSION"!==e&&(f.ma=d),a.d.cookie=a.W(b,c,f),a.cookieRead(b)==c):!1};a.W=function(b,c,d){d=d||{};if(!b)return"";c=""!==c?c:"[[B]]";b=a.escape(b)+"="+a.escape(c);d.path&&(b+="; path="+d.path);d.ma&&(b+="; expires="+(new Date(d.ma)).toUTCString());d.domain&&(b+="; domain="+d.domain);d.sc&&(b+="; secure");return b};a.fc=function(){var b=a.Util.getIeVersion();"number"===
typeof b&&10>b&&(a.unsupportedBrowser=!0,a.Qb(a,function(){}))};a.Ga=function(){var a=navigator.userAgent;return"Microsoft Internet Explorer"===navigator.appName||0<=a.indexOf("MSIE ")||0<=a.indexOf("Trident/")&&0<=a.indexOf("Windows NT 6")?!0:!1};a.Qb=function(a,c){for(var d in a)Object.prototype.hasOwnProperty.call(a,d)&&"function"===typeof a[d]&&(a[d]=c)};a.M=[];a.ka=function(b,c,d){if(a.Ua)return 0;a.maxDelay||(a.maxDelay=250);var f=0,e=(new Date).getTime()+a.maxDelay,g=a.d.visibilityState,k=
["webkitvisibilitychange","visibilitychange"];g||(g=a.d.webkitVisibilityState);if(g&&"prerender"==g){if(!a.la)for(a.la=1,d=0;d<k.length;d++)a.d.addEventListener(k[d],function(){var b=a.d.visibilityState;b||(b=a.d.webkitVisibilityState);"visible"==b&&(a.la=0,a.delayReady())});f=1;e=0}else d||a.v("_d")&&(f=1);f&&(a.M.push({m:b,a:c,t:e}),a.la||setTimeout(a.delayReady,a.maxDelay));return f};a.delayReady=function(){var b=(new Date).getTime(),c=0,d;for(a.v("_d")?c=1:a.Ia();0<a.M.length;){d=a.M.shift();
if(c&&!d.t&&d.t>b){a.M.unshift(d);setTimeout(a.delayReady,parseInt(a.maxDelay/2));break}a.Ua=1;a[d.m].apply(a,d.a);a.Ua=0}};a.setAccount=a.sa=function(b){var c,d;if(!a.ka("setAccount",arguments))if(a.account=b,a.allAccounts)for(c=a.allAccounts.concat(b.split(",")),a.allAccounts=[],c.sort(),d=0;d<c.length;d++)0!=d&&c[d-1]==c[d]||a.allAccounts.push(c[d]);else a.allAccounts=b.split(",")};a.foreachVar=function(b,c){var d,f,e,g,k="";e=f="";if(a.lightProfileID)d=a.Q,(k=a.lightTrackVars)&&(k=","+k+","+a.ra.join(",")+
",");else{d=a.i;if(a.pe||a.linkType)k=a.linkTrackVars,f=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,1).toUpperCase()+a.pe.substring(1),a[e]&&(k=a[e].xc,f=a[e].wc));k&&(k=","+k+","+a.F.join(",")+",");f&&k&&(k+=",events,")}c&&(c=","+c+",");for(f=0;f<d.length;f++)e=d[f],(g=a[e])&&(!k||0<=k.indexOf(","+e+","))&&(!c||0<=c.indexOf(","+e+","))&&b(e,g)};a.l=function(b,c,d,f,e){var g="",k,l,h,n,m=0;"contextData"==b&&(b="c");"clientHints"==b&&(b="h");if(c){for(k in c)if(!(Object.prototype[k]||e&&k.substring(0,
e.length)!=e)&&c[k]&&(!d||0<=d.indexOf(","+(f?f+".":"")+k+","))){h=!1;if(m)for(l=0;l<m.length;l++)if(k.substring(0,m[l].length)==m[l]){h=!0;break}if(!h&&(""==g&&(g+="&"+b+"."),l=c[k],e&&(k=k.substring(e.length)),0<k.length))if(h=k.indexOf("."),0<h)l=k.substring(0,h),h=(e?e:"")+l+".",m||(m=[]),m.push(h),g+=a.l(l,c,d,f,h);else if("boolean"==typeof l&&(l=l?"true":"false"),l){if("retrieveLightData"==f&&0>e.indexOf(".contextData."))switch(h=k.substring(0,4),n=k.substring(4),k){case "transactionID":k="xact";
break;case "channel":k="ch";break;case "campaign":k="v0";break;default:a.$a(n)&&("prop"==h?k="c"+n:"eVar"==h?k="v"+n:"list"==h?k="l"+n:"hier"==h&&(k="h"+n,l=l.substring(0,255)))}g+="&"+a.escape(k)+"="+a.escape(l)}}""!=g&&(g+="&."+b)}return g};a.usePostbacks=0;a.kc=function(){var b="",c,d,f,e,g,k,l,h,n="",m="",p=e="",r=a.X();if(a.lightProfileID)c=a.Q,(n=a.lightTrackVars)&&(n=","+n+","+a.ra.join(",")+",");else{c=a.i;if(a.pe||a.linkType)n=a.linkTrackVars,m=a.linkTrackEvents,a.pe&&(e=a.pe.substring(0,
1).toUpperCase()+a.pe.substring(1),a[e]&&(n=a[e].xc,m=a[e].wc));n&&(n=","+n+","+a.F.join(",")+",");m&&(m=","+m+",",n&&(n+=",events,"));a.events2&&(p+=(""!=p?",":"")+a.events2)}if(r&&r.getCustomerIDs){e=q;if(g=r.getCustomerIDs())for(d in g)Object.prototype[d]||(f=g[d],"object"==typeof f&&(e||(e={}),f.id&&(e[d+".id"]=f.id),f.authState&&(e[d+".as"]=f.authState)));e&&(b+=a.l("cid",e))}a.AudienceManagement&&a.AudienceManagement.isReady()&&(b+=a.l("d",a.AudienceManagement.getEventCallConfigParams()));for(d=
0;d<c.length;d++){e=c[d];g=a[e];f=e.substring(0,4);k=e.substring(4);g||("events"==e&&p?(g=p,p=""):"marketingCloudOrgID"==e&&r&&a.Y("ECID")&&(g=r.marketingCloudOrgID));if(g&&(!n||0<=n.indexOf(","+e+","))){switch(e){case "customerPerspective":e="cp";break;case "marketingCloudOrgID":e="mcorgid";break;case "supplementalDataID":e="sdid";break;case "timestamp":e="ts";break;case "dynamicVariablePrefix":e="D";break;case "visitorID":e="vid";break;case "marketingCloudVisitorID":e="mid";break;case "analyticsVisitorID":e=
"aid";break;case "audienceManagerLocationHint":e="aamlh";break;case "audienceManagerBlob":e="aamb";break;case "authState":e="as";break;case "pageURL":e="g";255<g.length&&(a.pageURLRest=g.substring(255),g=g.substring(0,255));break;case "pageURLRest":e="-g";break;case "referrer":e="r";break;case "vmk":case "visitorMigrationKey":e="vmt";break;case "visitorMigrationServer":e="vmf";a.ssl&&a.visitorMigrationServerSecure&&(g="");break;case "visitorMigrationServerSecure":e="vmf";!a.ssl&&a.visitorMigrationServer&&
(g="");break;case "charSet":e="ce";break;case "visitorNamespace":e="ns";break;case "cookieDomainPeriods":e="cdp";break;case "cookieLifetime":e="cl";break;case "variableProvider":e="vvp";break;case "currencyCode":e="cc";break;case "channel":e="ch";break;case "transactionID":e="xact";break;case "campaign":e="v0";break;case "latitude":e="lat";break;case "longitude":e="lon";break;case "resolution":e="s";break;case "colorDepth":e="c";break;case "javascriptVersion":e="j";break;case "javaEnabled":e="v";
break;case "cookiesEnabled":e="k";break;case "browserWidth":e="bw";break;case "browserHeight":e="bh";break;case "connectionType":e="ct";break;case "homepage":e="hp";break;case "events":p&&(g+=(""!=g?",":"")+p);if(m)for(k=g.split(","),g="",f=0;f<k.length;f++)l=k[f],h=l.indexOf("="),0<=h&&(l=l.substring(0,h)),h=l.indexOf(":"),0<=h&&(l=l.substring(0,h)),0<=m.indexOf(","+l+",")&&(g+=(g?",":"")+k[f]);break;case "events2":g="";break;case "contextData":b+=a.l("c",a[e],n,e);g="";break;case "clientHints":b+=
a.l("h",a[e],n,e);g="";break;case "lightProfileID":e="mtp";break;case "lightStoreForSeconds":e="mtss";a.lightProfileID||(g="");break;case "lightIncrementBy":e="mti";a.lightProfileID||(g="");break;case "retrieveLightProfiles":e="mtsr";break;case "deleteLightProfiles":e="mtsd";break;case "retrieveLightData":a.retrieveLightProfiles&&(b+=a.l("mts",a[e],n,e));g="";break;default:a.$a(k)&&("prop"==f?e="c"+k:"eVar"==f?e="v"+k:"list"==f?e="l"+k:"hier"==f&&(e="h"+k,g=g.substring(0,255)))}g&&(b+="&"+e+"="+("pev"!=
e.substring(0,3)?a.escape(g):g))}"pev3"==e&&a.e&&(b+=a.e)}a.qa&&(b+="&lrt="+a.qa,a.qa=null);return b};a.C=function(a){var c=a.tagName;if("undefined"!=""+a.Ec||"undefined"!=""+a.rc&&"HTML"!=(""+a.rc).toUpperCase())return"";c=c&&c.toUpperCase?c.toUpperCase():"";"SHAPE"==c&&(c="");c&&(("INPUT"==c||"BUTTON"==c)&&a.type&&a.type.toUpperCase?c=a.type.toUpperCase():!c&&a.href&&(c="A"));return c};a.Wa=function(a){var c=h.location,d=a.href?a.href:"",f,e,g;"string"!==typeof d&&(d="");f=d.indexOf(":");e=d.indexOf("?");
g=d.indexOf("/");d&&(0>f||0<=e&&f>e||0<=g&&f>g)&&(e=a.protocol&&1<a.protocol.length?a.protocol:c.protocol?c.protocol:"",f=c.pathname.lastIndexOf("/"),d=(e?e+"//":"")+(a.host?a.host:c.host?c.host:"")+("/"!=d.substring(0,1)?c.pathname.substring(0,0>f?0:f)+"/":"")+d);return d};a.N=function(b){var c=a.C(b),d,f,e="",g=0;return c&&(d=b.protocol,f=b.onclick,!b.href||"A"!=c&&"AREA"!=c||f&&d&&!(0>d.toLowerCase().indexOf("javascript"))?f?(e=a.replace(a.replace(a.replace(a.replace(""+f,"\r",""),"\n",""),"\t",
"")," ",""),g=2):"INPUT"==c||"SUBMIT"==c?(b.value?e=b.value:b.innerText?e=b.innerText:b.textContent&&(e=b.textContent),g=3):"IMAGE"==c&&b.src&&(e=b.src):e=a.Wa(b),e)?{id:e.substring(0,100),type:g}:0};a.Cc=function(b){for(var c=a.C(b),d=a.N(b);b&&!d&&"BODY"!=c;)if(b=b.parentElement?b.parentElement:b.parentNode)c=a.C(b),d=a.N(b);d&&"BODY"!=c||(b=0);b&&(c=b.onclick?""+b.onclick:"",0<=c.indexOf(".tl(")||0<=c.indexOf(".trackLink("))&&(b=0);return b};a.qc=function(){var b,c,d=a.linkObject,f=a.linkType,
e=a.linkURL,g,k;a.ta=1;d||(a.ta=0,d=a.clickObject);if(d){b=a.C(d);for(c=a.N(d);d&&!c&&"BODY"!=b;)if(d=d.parentElement?d.parentElement:d.parentNode)b=a.C(d),c=a.N(d);c&&"BODY"!=b||(d=0);if(d&&!a.linkObject){var l=d.onclick?""+d.onclick:"";if(0<=l.indexOf(".tl(")||0<=l.indexOf(".trackLink("))d=0}}else a.ta=1;!e&&d&&(e=a.Wa(d));e&&!a.linkLeaveQueryString&&(g=e.indexOf("?"),0<=g&&(e=e.substring(0,g)));if(!f&&e){var m=0,n=0,p;if(a.trackDownloadLinks&&a.linkDownloadFileTypes)for(l=e.toLowerCase(),g=l.indexOf("?"),
k=l.indexOf("#"),0<=g?0<=k&&k<g&&(g=k):g=k,0<=g&&(l=l.substring(0,g)),g=a.linkDownloadFileTypes.toLowerCase().split(","),k=0;k<g.length;k++)(p=g[k])&&l.substring(l.length-(p.length+1))=="."+p&&(f="d");if(a.trackExternalLinks&&!f&&(l=e.toLowerCase(),a.Za(l)&&(a.linkInternalFilters||(a.linkInternalFilters=h.location.hostname),g=0,a.linkExternalFilters?(g=a.linkExternalFilters.toLowerCase().split(","),m=1):a.linkInternalFilters&&(g=a.linkInternalFilters.toLowerCase().split(",")),g))){for(k=0;k<g.length;k++)p=
g[k],0<=l.indexOf(p)&&(n=1);n?m&&(f="e"):m||(f="e")}}a.linkObject=d;a.linkURL=e;a.linkType=f;if(a.trackClickMap||a.trackInlineStats)a.e="",d&&(f=a.pageName,e=1,d=d.sourceIndex,f||(f=a.pageURL,e=0),h.s_objectID&&(c.id=h.s_objectID,d=c.type=1),f&&c&&c.id&&b&&(a.e="&pid="+a.escape(f.substring(0,255))+(e?"&pidt="+e:"")+"&oid="+a.escape(c.id.substring(0,100))+(c.type?"&oidt="+c.type:"")+"&ot="+b+(d?"&oi="+d:"")))};a.lc=function(){var b=a.ta,c=a.linkType,d=a.linkURL,f=a.linkName;c&&(d||f)&&(c=c.toLowerCase(),
"d"!=c&&"e"!=c&&(c="o"),a.pe="lnk_"+c,a.decodeLinkParameters?(a.pev1=d?a.unescape(d):"",a.pev2=f?a.unescape(f):"",a.pev1=a.escape(a.pev1),a.pev2=a.escape(a.pev2)):(a.pev1=d?a.escape(d):"",a.pev2=f?a.escape(f):""),b=1);a.abort&&(b=0);if(a.trackClickMap||a.trackInlineStats||a.nc()){var c={},d=0,e=a.Kb(),g=e?e.split("&"):0,k,l,h,e=0;if(g)for(k=0;k<g.length;k++)l=g[k].split("="),f=a.unescape(l[0]).split(","),l=a.unescape(l[1]),c[l]=f;f=a.account.split(",");k={};for(h in a.contextData)h&&!Object.prototype[h]&&
"a.activitymap."==h.substring(0,14)&&(k[h]=a.contextData[h],a.contextData[h]="");a.e=a.l("c",k)+(a.e?a.e:"");if(b||a.e){b&&!a.e&&(e=1);for(l in c)if(!Object.prototype[l])for(h=0;h<f.length;h++)for(e&&(g=c[l].join(","),g==a.account&&(a.e+=("&"!=l.charAt(0)?"&":"")+l,c[l]=[],d=1)),k=0;k<c[l].length;k++)g=c[l][k],g==f[h]&&(e&&(a.e+="&u="+a.escape(g)+("&"!=l.charAt(0)?"&":"")+l+"&u=0"),c[l].splice(k,1),d=1);b||(d=1);if(d){e="";k=2;!b&&a.e&&(e=a.escape(f.join(","))+"="+a.escape(a.e),k=1);for(l in c)!Object.prototype[l]&&
0<k&&0<c[l].length&&(e+=(e?"&":"")+a.escape(c[l].join(","))+"="+a.escape(l),k--);a.Sb(e)}}}return b};a.Kb=function(){if(a.useLinkTrackSessionStorage){if(a.o(h.sessionStorage))try{return h.sessionStorage.getItem(a.R)}catch(b){}}else return a.cookieRead(a.R)};a.Sb=function(b){if(a.useLinkTrackSessionStorage){if(a.o(h.sessionStorage))try{h.sessionStorage.setItem(a.R,b)}catch(c){}}else a.cookieWrite(a.R,b)};a.mc=function(){if(!a.vc){var b=new Date,c=p.location,d,f,e=f=d="",g="",k="",h="1.2",m=a.cookieWrite(a.jb,
"true",0)?"Y":"N",n="",q="";if(b.setUTCDate&&(h="1.3",(0).toPrecision&&(h="1.5",b=[],b.forEach))){h="1.6";f=0;d={};try{f=new Iterator(d),f.next&&(h="1.7",b.reduce&&(h="1.8",h.trim&&(h="1.8.1",Date.parse&&(h="1.8.2",Object.create&&(h="1.8.5")))))}catch(r){}}d=screen.width+"x"+screen.height;e=navigator.javaEnabled()?"Y":"N";f=screen.pixelDepth?screen.pixelDepth:screen.colorDepth;g=a.w.innerWidth?a.w.innerWidth:a.d.documentElement.offsetWidth;k=a.w.innerHeight?a.w.innerHeight:a.d.documentElement.offsetHeight;
try{a.b.addBehavior("#default#homePage"),n=a.b.Dc(c)?"Y":"N"}catch(s){}try{a.b.addBehavior("#default#clientCaps"),q=a.b.connectionType}catch(t){}a.resolution=d;a.colorDepth=f;a.javascriptVersion=h;a.javaEnabled=e;a.cookiesEnabled=m;a.browserWidth=g;a.browserHeight=k;a.connectionType=q;a.homepage=n;a.vc=1}};a.rb=function(){if(a.collectHighEntropyUserAgentHints&&!a.J&&a.mb()){a.J=!0;try{navigator.userAgentData.getHighEntropyValues(a.ya).then(function(b){a.clientHints={};a.ya.forEach(function(d){Object.prototype.hasOwnProperty.call(b,
d)&&(a.clientHints[d]=b[d])})})["catch"](function(b){a.J=!1;a.clientHints={};a.debugTracking&&a.log(b.message)})}catch(b){a.J=!1,a.clientHints={},a.debugTracking&&a.log(b.message)}}else a.clientHints={}};a.mb=function(){return"undefined"!==typeof navigator.userAgentData};a.S={};a.loadModule=function(b,c){var d=a.S[b];if(!d){d=h["AppMeasurement_Module_"+b]?new h["AppMeasurement_Module_"+b](a):{};a.S[b]=a[b]=d;d.Bb=function(){return d.Nb};d.Tb=function(c){if(d.Nb=c)a[b+"_onLoad"]=c,a.ka(b+"_onLoad",
[a,d],1)||c(a,d)};try{Object.defineProperty?Object.defineProperty(d,"onLoad",{get:d.Bb,set:d.Tb}):d._olc=1}catch(f){d._olc=1}}c&&(a[b+"_onLoad"]=c,a.ka(b+"_onLoad",[a,d],1)||c(a,d))};a.v=function(b){var c,d;for(c in a.S)if(!Object.prototype[c]&&(d=a.S[c])&&(d._olc&&d.onLoad&&(d._olc=0,d.onLoad(a,d)),d[b]&&d[b]()))return 1;return 0};a.nc=function(){return a.ActivityMap&&a.ActivityMap._c?!0:!1};a.oc=function(){var b=Math.floor(1E13*Math.random()),c=a.visitorSampling,d=a.visitorSamplingGroup,d="s_vsn_"+
(a.visitorNamespace?a.visitorNamespace:a.account)+(d?"_"+d:""),f=a.cookieRead(d);if(c){c*=100;f&&(f=parseInt(f));if(!f){if(!a.cookieWrite(d,b))return 0;f=b}if(f%1E4>c)return 0}return 1};a.U=function(b,c){var d,f,e,g,k,h,m;m={};for(d=0;2>d;d++)for(f=0<d?a.Pa:a.i,e=0;e<f.length;e++)if(g=f[e],(k=b[g])||b["!"+g]){if(k&&!c&&("contextData"==g||"retrieveLightData"==g)&&a[g])for(h in a[g])k[h]||(k[h]=a[g][h]);a[g]||(m["!"+g]=1);m[g]=a[g];a[g]=k}return m};a.Ac=function(b){var c,d,f,e;for(c=0;2>c;c++)for(d=
0<c?a.Pa:a.i,f=0;f<d.length;f++)e=d[f],b[e]=a[e],b[e]||"prop"!==e.substring(0,4)&&"eVar"!==e.substring(0,4)&&"hier"!==e.substring(0,4)&&"list"!==e.substring(0,4)&&"channel"!==e&&"events"!==e&&"eventList"!==e&&"products"!==e&&"productList"!==e&&"purchaseID"!==e&&"transactionID"!==e&&"state"!==e&&"zip"!==e&&"campaign"!==e&&"events2"!==e&&"latitude"!==e&&"longitude"!==e&&"ms_a"!==e&&"contextData"!==e&&"supplementalDataID"!==e&&"tnt"!==e&&"timestamp"!==e&&"abort"!==e&&"useBeacon"!==e&&"linkObject"!==
e&&"clickObject"!==e&&"linkType"!==e&&"linkName"!==e&&"linkURL"!==e&&"bodyClickTarget"!==e&&"bodyClickFunction"!==e||(b["!"+e]=1)};a.hc=function(a){var c,d,f,e,g,h=0,l,m="",n="";if(a&&255<a.length&&(c=""+a,d=c.indexOf("?"),0<d&&(l=c.substring(d+1),c=c.substring(0,d),e=c.toLowerCase(),f=0,"http://"==e.substring(0,7)?f+=7:"https://"==e.substring(0,8)&&(f+=8),d=e.indexOf("/",f),0<d&&(e=e.substring(f,d),g=c.substring(d),c=c.substring(0,d),0<=e.indexOf("google")?h=",q,ie,start,search_key,word,kw,cd,":
0<=e.indexOf("yahoo.co")?h=",p,ei,":0<=e.indexOf("baidu.")&&(h=",wd,word,"),h&&l)))){if((a=l.split("&"))&&1<a.length){for(f=0;f<a.length;f++)e=a[f],d=e.indexOf("="),0<d&&0<=h.indexOf(","+e.substring(0,d)+",")?m+=(m?"&":"")+e:n+=(n?"&":"")+e;m&&n?l=m+"&"+n:n=""}d=253-(l.length-n.length)-c.length;a=c+(0<d?g.substring(0,d):"")+"?"+l}return a};a.pb=function(b){var c=a.d.visibilityState,d=["webkitvisibilitychange","visibilitychange"];c||(c=a.d.webkitVisibilityState);if(c&&"prerender"==c){if(b)for(c=0;c<
d.length;c++)a.d.addEventListener(d[c],function(){var c=a.d.visibilityState;c||(c=a.d.webkitVisibilityState);"visible"==c&&b()});return!1}return!0};a.ha=!1;a.H=!1;a.Wb=function(){a.H=!0;a.q()};a.K=!1;a.Xb=function(b){a.marketingCloudVisitorID=b.MCMID;a.visitorOptedOut=b.MCOPTOUT;a.analyticsVisitorID=b.MCAID;a.audienceManagerLocationHint=b.MCAAMLH;a.audienceManagerBlob=b.MCAAMB;a.K=!1;a.q()};a.ob=function(b){a.maxDelay||(a.maxDelay=250);return a.v("_d")?(b&&setTimeout(function(){b()},a.maxDelay),!1):
!0};a.fa=!1;a.G=!1;a.Ia=function(){a.G=!0;a.q()};a.isReadyToTrack=function(){var b=!0;if(!a.Gb()||!a.Eb())return!1;a.Ib()||(b=!1);a.Mb()||(b=!1);a.qb()||(b=!1);return b};a.Gb=function(){a.ha||a.H||(a.pb(a.Wb)?a.H=!0:a.ha=!0);return a.ha&&!a.H?!1:!0};a.Eb=function(){var b=a.Ea();if(b)if(a.Aa||a.ga)if(a.Aa){if(!b.isApproved(b.Categories.ANALYTICS))return!1}else return!1;else return b.fetchPermissions(a.Ob,!0),a.ga=!0,!1;return!0};a.Y=function(b){var c=a.Ea();return c&&!c.isApproved(c.Categories[b])?
!1:!0};a.Ea=function(){return h.adobe&&h.adobe.optIn?h.adobe.optIn:null};a.da=!0;a.Ib=function(){var b=a.X();if(!b||!b.getVisitorValues)return!0;a.da&&(a.da=!1,a.K||(a.K=!0,b.getVisitorValues(a.Xb)));return!a.K};a.X=function(){var b=a.visitor;b&&!b.isAllowed()&&(b=null);return b};a.Mb=function(){a.fa||a.G||(a.ob(a.Ia)?a.G=!0:a.fa=!0);return a.fa&&!a.G?!1:!0};a.qb=function(){a.J||a.clientHints||a.rb();return a.clientHints};a.ga=!1;a.Ob=function(){a.ga=!1;a.Aa=!0};a.j=q;a.r=0;a.callbackWhenReadyToTrack=
function(b,c,d){var f;f={};f.ac=b;f.$b=c;f.Yb=d;a.j==q&&(a.j=[]);a.j.push(f);0==a.r&&(a.r=setInterval(a.q,100))};a.q=function(){var b;if(a.isReadyToTrack()&&(a.Ub(),a.j!=q))for(;0<a.j.length;)b=a.j.shift(),b.$b.apply(b.ac,b.Yb)};a.Ub=function(){a.r&&(clearInterval(a.r),a.r=0)};a.Ba=function(b){var c,d={};a.Ac(d);if(b!=q)for(c in b)d[c]=b[c];a.callbackWhenReadyToTrack(a,a.Oa,[d]);a.La()};a.ic=function(){var b=a.cookieRead("s_fid"),c="",d="",f;f=8;var e=4;if(!b||0>b.indexOf("-")){for(b=0;16>b;b++)f=
Math.floor(Math.random()*f),c+="0123456789ABCDEF".substring(f,f+1),f=Math.floor(Math.random()*e),d+="0123456789ABCDEF".substring(f,f+1),f=e=16;b=c+"-"+d}a.cookieWrite("s_fid",b,1)||(b=0);return b};a.Oa=function(b){var c=new Date,d="s"+Math.floor(c.getTime()/108E5)%10+Math.floor(1E13*Math.random()),f=c.getYear(),f="t="+a.escape(c.getDate()+"/"+c.getMonth()+"/"+(1900>f?f+1900:f)+" "+c.getHours()+":"+c.getMinutes()+":"+c.getSeconds()+" "+c.getDay()+" "+c.getTimezoneOffset()),e=a.X(),g;b&&(g=a.U(b,1));
a.oc()&&!a.visitorOptedOut&&(a.Fa()||(a.fid=a.ic()),a.qc(),a.usePlugins&&a.doPlugins&&a.doPlugins(a),a.account&&(a.abort||(a.trackOffline&&!a.timestamp&&(a.timestamp=Math.floor(c.getTime()/1E3)),b=h.location,a.pageURL||(a.pageURL=b.href?b.href:b),a.referrer||a.kb||(b=a.Util.getQueryParam("adobe_mc_ref",null,null,!0),a.referrer=b||void 0===b?void 0===b?"":b:p.document.referrer),a.kb=1,!a.referrer&&a.ea&&(a.referrer=a.ea),a.ea=0,a.referrer=a.hc(a.referrer),a.v("_g")),a.lc()&&!a.abort&&(e&&a.Y("TARGET")&&
!a.supplementalDataID&&e.getSupplementalDataID&&(a.supplementalDataID=e.getSupplementalDataID("AppMeasurement:"+a._in,a.expectSupplementalData?!1:!0)),a.Y("AAM")||(a.contextData["cm.ssf"]=1),a.mc(),a.Pb(),f+=a.kc(),a.Lb(d,f),a.v("_t"),a.referrer="",a.contextData&&a.contextData.excCodes&&(a.contextData.excCodes=0))));a.referrer&&(a.ea=a.referrer);a.La();g&&a.U(g,1)};a.t=a.track=function(b,c){c&&a.U(c);a.da=!0;a.isReadyToTrack()?null!=a.j&&0<a.j.length?(a.Ba(b),a.q()):a.Oa(b):a.Ba(b)};a.Pb=function(){a.writeSecureCookies&&
!a.ssl&&a.lb()};a.lb=function(){a.contextData.excCodes=a.contextData.excCodes||[];a.contextData.excCodes.push(1)};a.La=function(){a.abort=a.supplementalDataID=a.timestamp=a.pageURLRest=a.linkObject=a.clickObject=a.linkURL=a.linkName=a.linkType=h.s_objectID=a.pe=a.pev1=a.pev2=a.pev3=a.e=a.lightProfileID=a.useBeacon=a.referrer=0};a.Ka=[];a.registerPreTrackCallback=function(b){for(var c=[],d=1;d<arguments.length;d++)c.push(arguments[d]);"function"==typeof b?a.Ka.push([b,c]):a.debugTracking&&a.log("Warning, Non function type passed to registerPreTrackCallback")};
a.wb=function(b){a.Da(a.Ka,b)};a.Ja=[];a.registerPostTrackCallback=function(b){for(var c=[],d=1;d<arguments.length;d++)c.push(arguments[d]);"function"==typeof b?a.Ja.push([b,c]):a.debugTracking&&a.log("Warning, Non function type passed to registerPostTrackCallback")};a.vb=function(b){a.Da(a.Ja,b)};a.Da=function(b,c){if("object"==typeof b)for(var d=0;d<b.length;d++){var f=b[d][0],e=b[d][1].slice();e.unshift(c);if("function"==typeof f)try{f.apply(null,e)}catch(g){a.debugTracking&&a.log(g.message)}}};
a.tl=a.trackLink=function(b,c,d,f,e){a.linkObject=b;a.linkType=c;a.linkName=d;e&&(a.bodyClickTarget=b,a.bodyClickFunction=e);return a.track(f)};a.trackLight=function(b,c,d,f){a.lightProfileID=b;a.lightStoreForSeconds=c;a.lightIncrementBy=d;return a.track(f)};a.clearVars=function(){var b,c;for(b=0;b<a.i.length;b++)if(c=a.i[b],"prop"==c.substring(0,4)||"eVar"==c.substring(0,4)||"hier"==c.substring(0,4)||"list"==c.substring(0,4)||"channel"==c||"events"==c||"eventList"==c||"products"==c||"productList"==
c||"purchaseID"==c||"transactionID"==c||"state"==c||"zip"==c||"campaign"==c)a[c]=void 0};a.tagContainerMarker="";a.Lb=function(b,c){var d=a.zb()+"/"+b+"?AQB=1&ndh=1&pf=1&"+(a.Ha()?"callback=s_c_il["+a._in+"].doPostbacks&et=1&":"")+c+"&AQE=1";a.wb(d);a.V?a.Vb(h.sessionStorage,d):(a.Ma(),a.Ca(d),a.I())};a.zb=function(){var b=a.Ab();return"http"+(a.ssl?"s":"")+"://"+b+"/b/ss/"+a.account+"/"+(a.mobile?"5.":"")+(a.Ha()?"10":"1")+"/JS-"+a.version+(a.uc?"T":"")+(a.tagContainerMarker?"-"+a.tagContainerMarker:
"")};a.Ha=function(){return a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks};a.Ab=function(){var b=a.dc,c=a.trackingServer;c?a.trackingServerSecure&&a.ssl&&(c=a.trackingServerSecure):(b=b?(""+b).toLowerCase():"d1","d1"==b?b="112":"d2"==b&&(b="122"),c=a.Cb()+"."+b+".2o7.net");return c};a.Cb=function(){var b=a.visitorNamespace;b||(b=a.account.split(",")[0],b=b.replace(/[^0-9a-z]/gi,""));return b};a.ib=/{(%?)(.*?)(%?)}/;a.zc=RegExp(a.ib.source,"g");a.gc=function(b){if("object"==
typeof b.dests)for(var c=0;c<b.dests.length;++c){var d=b.dests[c];if("string"==typeof d.c&&"aa."==d.id.substr(0,3))for(var f=d.c.match(a.zc),e=0;e<f.length;++e){var g=f[e],h=g.match(a.ib),l="";"%"==h[1]&&"timezone_offset"==h[2]?l=(new Date).getTimezoneOffset():"%"==h[1]&&"timestampz"==h[2]&&(l=a.jc());d.c=d.c.replace(g,a.escape(l))}}};a.jc=function(){var b=new Date,c=new Date(6E4*Math.abs(b.getTimezoneOffset()));return a.k(4,b.getFullYear())+"-"+a.k(2,b.getMonth()+1)+"-"+a.k(2,b.getDate())+"T"+a.k(2,
b.getHours())+":"+a.k(2,b.getMinutes())+":"+a.k(2,b.getSeconds())+(0<b.getTimezoneOffset()?"-":"+")+a.k(2,c.getUTCHours())+":"+a.k(2,c.getUTCMinutes())};a.k=function(a,c){return(Array(a+1).join(0)+c).slice(-a)};a.wa={};a.doPostbacks=function(b){if("object"==typeof b)if(a.gc(b),"object"==typeof a.AudienceManagement&&"function"==typeof a.AudienceManagement.isReady&&a.AudienceManagement.isReady()&&"function"==typeof a.AudienceManagement.passData)a.AudienceManagement.passData(b);else if("object"==typeof b&&
"object"==typeof b.dests)for(var c=0;c<b.dests.length;++c){var d=b.dests[c];"object"==typeof d&&"string"==typeof d.c&&"string"==typeof d.id&&"aa."==d.id.substr(0,3)&&(a.wa[d.id]=new Image,a.wa[d.id].alt="",a.wa[d.id].src=d.c)}};a.bufferRequests=function(b){b||void 0===b?a.tb():a.sb()};a.tb=function(){a.o(a.w.sessionStorage)?a.V=!0:a.log("Warning, session storage is not available. Requests will not be buffered.")};a.sb=function(){a.V&&a.Ma();a.V=!1};a.o=function(a){var c=!0;a&&a.setItem&&h.JSON||(c=
!1);return c};a.Ma=function(){var b=a.ba(h.sessionStorage);if(b){for(var c=0;c<b.length;c++)a.Ca(b[c]);a.za(h.sessionStorage);a.I()}};a.Ca=function(b){a.g||a.Db();a.g.push(b);a.pa=a.B();a.hb()};a.Vb=function(b,c){var d=a.ba(b)||[];d.push(c);a.Na(b,d)};a.Na=function(b,c){try{b.setItem(a.ca(),h.JSON.stringify(c))}catch(d){}};a.ba=function(b){var c,d;if(a.o(b)){try{(d=b.getItem(a.ca()))&&(c=h.JSON.parse(d))}catch(f){}return c}};a.Db=function(){a.va()&&(a.g=a.ba(h.localStorage));a.g||(a.g=[])};a.za=function(b){if(a.o(b))try{b.removeItem(a.ca())}catch(c){}};
a.va=function(){var b=!0;a.trackOffline&&a.storageFilename&&a.o(h.localStorage)||(b=!1);return b};a.Xa=function(){var b=0;a.g&&(b=a.g.length);a.p&&b++;return b};a.I=function(){if(a.p&&(a.A&&a.A.complete&&a.A.D&&a.A.T(),a.p))return;a.Ya=q;if(a.ua)a.pa>a.P&&a.fb(a.g),a.xa(500);else{var b=a.Zb();if(0<b)a.xa(b);else if(b=a.Va())a.p=1,a.pc(b),a.tc(b)}};a.xa=function(b){a.Ya||(b||(b=0),a.Ya=setTimeout(a.I,b))};a.Zb=function(){var b;if(!a.trackOffline||0>=a.offlineThrottleDelay)return 0;b=a.B()-a.cb;return a.offlineThrottleDelay<
b?0:a.offlineThrottleDelay-b};a.Va=function(){if(a.g&&0<a.g.length)return a.g.shift()};a.pc=function(b){if(a.debugTracking){var c="AppMeasurement Debug: "+b;b=b.split("&");var d;for(d=0;d<b.length;d++)c+="\n\t"+a.unescape(b[d]);a.log(c)}};a.Fa=function(){return a.marketingCloudVisitorID||a.analyticsVisitorID};a.aa=!1;var t;try{t=JSON.parse('{"x":"y"}')}catch(v){t=null}t&&"y"==t.x?(a.aa=!0,a.Z=function(a){return JSON.parse(a)}):h.$&&h.$.parseJSON?(a.Z=function(a){return h.$.parseJSON(a)},a.aa=!0):
a.Z=function(){return null};a.tc=function(b){var c,d,f;a.Fb(b)&&(d=1,c={send:function(b){a.useBeacon=!1;navigator.sendBeacon(b)?c.T():c.na()}});!c&&a.Fa()&&2047<b.length&&(a.nb()&&(d=2,c=new XMLHttpRequest),c&&(a.AudienceManagement&&a.AudienceManagement.isReady()||0!=a.usePostbacks)&&(a.aa?c.Qa=!0:c=0));!c&&a.yc&&(b=b.substring(0,2047));!c&&a.d.createElement&&(0!=a.usePostbacks||a.AudienceManagement&&a.AudienceManagement.isReady())&&(c=a.d.createElement("SCRIPT"))&&"async"in c&&((f=(f=a.d.getElementsByTagName("HEAD"))&&
f[0]?f[0]:a.d.body)?(c.type="text/javascript",c.setAttribute("async","async"),d=3):c=0);c||(c=new Image,d=4,c.alt="",c.abort||"undefined"===typeof h.InstallTrigger||(c.abort=function(){c.src=q}));c.eb=Date.now();c.Sa=function(){try{c.D&&(clearTimeout(c.D),c.D=0)}catch(a){}};c.onload=c.T=function(){if(!0!==c.bc&&(c.bc=!0,c.eb&&(a.qa=Date.now()-c.eb),a.vb(b),c.Sa(),a.ec(),a.ia(),a.p=0,a.I(),c.Qa)){c.Qa=!1;try{a.doPostbacks(a.Z(c.responseText))}catch(d){}}};c.onabort=c.onerror=c.na=function(){c.Sa();
(a.trackOffline||a.ua)&&a.p&&a.g.unshift(a.cc);a.p=0;a.pa>a.P&&a.fb(a.g);a.ia();a.xa(500)};c.onreadystatechange=function(){4==c.readyState&&(200==c.status?c.T():c.na())};a.cb=a.B();if(1===d)c.send(b);else if(2===d)f=b.indexOf("?"),d=b.substring(0,f),f=b.substring(f+1),f=f.replace(/&callback=[a-zA-Z0-9_.\[\]]+/,""),c.open("POST",d,!0),c.withCredentials=!0,c.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),c.send(f);else if(c.src=b,3===d){if(a.ab)try{f.removeChild(a.ab)}catch(e){}f.firstChild?
f.insertBefore(c,f.firstChild):f.appendChild(c);a.ab=a.A}c.D=setTimeout(function(){c.D&&(c.complete?c.T():(a.trackOffline&&c.abort&&c.abort(),c.na()))},5E3);a.cc=b;a.A=h["s_i_"+a.replace(a.account,",","_")]=c;if(a.useForcedLinkTracking&&a.L||a.bodyClickFunction)a.forcedLinkTrackingTimeout||(a.forcedLinkTrackingTimeout=250),a.ja=setTimeout(a.ia,a.forcedLinkTrackingTimeout)};a.Fb=function(b){var c=!1;navigator.sendBeacon&&(a.Hb(b)?c=!0:a.useBeacon&&(c=!0));a.Rb(b)&&(c=!1);return c};a.Hb=function(a){return a&&
0<a.indexOf("pe=lnk_e")?!0:!1};a.Rb=function(a){return 64E3<=a.length};a.nb=function(){return"undefined"!==typeof XMLHttpRequest&&"withCredentials"in new XMLHttpRequest?!0:!1};a.ec=function(){!a.va()||a.bb>a.P||(a.za(h.localStorage),a.bb=a.B())};a.fb=function(b){a.va()&&(a.hb(),a.Na(h.localStorage,b),a.P=a.B())};a.hb=function(){if(a.trackOffline){if(!a.offlineLimit||0>=a.offlineLimit)a.offlineLimit=10;for(;a.g.length>a.offlineLimit;)a.Va()}};a.forceOffline=function(){a.ua=!0};a.forceOnline=function(){a.ua=
!1};a.ca=function(){return a.storageFilename+"-"+a.visitorNamespace+a.account};a.B=function(){return(new Date).getTime()};a.Za=function(a){a=a.toLowerCase();return 0!=a.indexOf("#")&&0!=a.indexOf("about:")&&0!=a.indexOf("opera:")&&0!=a.indexOf("javascript:")?!0:!1};a.setTagContainer=function(b){var c,d,f;a.uc=b;for(c=0;c<a._il.length;c++)if((d=a._il[c])&&"s_l"==d._c&&d.tagContainerName==b){a.U(d);if(d.lmq)for(c=0;c<d.lmq.length;c++)f=d.lmq[c],a.loadModule(f.n);if(d.ml)for(f in d.ml)if(a[f])for(c in b=
a[f],f=d.ml[f],f)!Object.prototype[c]&&("function"!=typeof f[c]||0>(""+f[c]).indexOf("s_c_il"))&&(b[c]=f[c]);if(d.mmq)for(c=0;c<d.mmq.length;c++)f=d.mmq[c],a[f.m]&&(b=a[f.m],b[f.f]&&"function"==typeof b[f.f]&&(f.a?b[f.f].apply(b,f.a):b[f.f].apply(b)));if(d.tq)for(c=0;c<d.tq.length;c++)a.track(d.tq[c]);d.s=a;break}};a.Util={urlEncode:a.escape,urlDecode:a.unescape,cookieRead:a.cookieRead,cookieWrite:a.cookieWrite,getQueryParam:function(b,c,d,f){var e,g="";c||(c=a.pageURL?a.pageURL:h.location);d=d?d:
"&";if(!b||!c)return g;c=""+c;e=c.indexOf("?");if(0>e)return g;c=d+c.substring(e+1)+d;if(!f||!(0<=c.indexOf(d+b+d)||0<=c.indexOf(d+b+"="+d))){e=c.indexOf("#");0<=e&&(c=c.substr(0,e)+d);e=c.indexOf(d+b+"=");if(0>e)return g;c=c.substring(e+d.length+b.length+1);e=c.indexOf(d);0<=e&&(c=c.substring(0,e));0<c.length&&(g=a.unescape(c));return g}},getIeVersion:function(){return document.documentMode?document.documentMode:a.Ga()?7:null}};a.F="supplementalDataID timestamp dynamicVariablePrefix visitorID marketingCloudVisitorID analyticsVisitorID audienceManagerLocationHint authState fid vmk visitorMigrationKey visitorMigrationServer visitorMigrationServerSecure charSet visitorNamespace cookieDomainPeriods fpCookieDomainPeriods cookieLifetime pageName pageURL customerPerspective referrer contextData contextData.cm.ssf contextData.opt.dmp contextData.opt.sell clientHints currencyCode lightProfileID lightStoreForSeconds lightIncrementBy retrieveLightProfiles deleteLightProfiles retrieveLightData".split(" ");
a.i=a.F.concat("purchaseID variableProvider channel server pageType transactionID campaign state zip events events2 products audienceManagerBlob tnt".split(" "));a.ra="timestamp charSet visitorNamespace cookieDomainPeriods cookieLifetime contextData lightProfileID lightStoreForSeconds lightIncrementBy".split(" ");a.Q=a.ra.slice(0);a.Pa="account allAccounts debugTracking visitor visitorOptedOut trackOffline offlineLimit offlineThrottleDelay storageFilename usePlugins doPlugins configURL visitorSampling visitorSamplingGroup linkObject clickObject linkURL linkName linkType trackDownloadLinks trackExternalLinks trackClickMap trackInlineStats linkLeaveQueryString linkTrackVars linkTrackEvents linkDownloadFileTypes linkExternalFilters linkInternalFilters useForcedLinkTracking forcedLinkTrackingTimeout writeSecureCookies decodeLinkParameters useLinkTrackSessionStorage collectHighEntropyUserAgentHints trackingServer trackingServerSecure ssl abort mobile dc lightTrackVars maxDelay expectSupplementalData useBeacon usePostbacks registerPreTrackCallback registerPostTrackCallback bodyClickTarget bodyClickFunction bufferRequests AudienceManagement".split(" ");
for(m=0;250>=m;m++)76>m&&(a.i.push("prop"+m),a.Q.push("prop"+m)),a.i.push("eVar"+m),a.Q.push("eVar"+m),6>m&&a.i.push("hier"+m),4>m&&a.i.push("list"+m);m="pe pev1 pev2 pev3 latitude longitude resolution colorDepth javascriptVersion javaEnabled cookiesEnabled browserWidth browserHeight connectionType homepage pageURLRest marketingCloudOrgID ms_a".split(" ");a.i=a.i.concat(m);a.F=a.F.concat(m);a.ssl=0<=h.location.protocol.toLowerCase().indexOf("https");a.charSet="UTF-8";a.contextData={};a.ya=["architecture",
"bitness","model","platformVersion","wow64"];a.writeSecureCookies=!1;a.collectHighEntropyUserAgentHints=!1;a.offlineThrottleDelay=0;a.storageFilename="AppMeasurement.requests";a.R="s_sq";a.cb=0;a.pa=0;a.P=0;a.bb=0;a.linkDownloadFileTypes="exe,zip,wav,mp3,mov,mpg,avi,wmv,pdf,doc,docx,xls,xlsx,ppt,pptx";a.jb="s_cc";a.w=h;a.d=h.document;a.ia=function(){a.ja&&(h.clearTimeout(a.ja),a.ja=q);a.bodyClickTarget&&a.L&&a.bodyClickTarget.dispatchEvent(a.L);a.bodyClickFunction&&("function"==typeof a.bodyClickFunction?
a.bodyClickFunction():a.bodyClickTarget&&a.bodyClickTarget.href&&(a.d.location=a.bodyClickTarget.href));a.bodyClickTarget=a.L=a.bodyClickFunction=0};a.gb=function(){a.b=a.d.body;a.b?(a.u=function(b){var c,d,f,e,g;if(!(a.d&&a.d.getElementById("cppXYctnr")||b&&b["s_fe_"+a._in])){if(a.Ra)if(a.useForcedLinkTracking)a.b.removeEventListener("click",a.u,!1);else{a.b.removeEventListener("click",a.u,!0);a.Ra=a.useForcedLinkTracking=0;return}else a.useForcedLinkTracking=0;a.clickObject=b.srcElement?b.srcElement:
b.target;try{if(!a.clickObject||a.O&&a.O==a.clickObject||!(a.clickObject.tagName||a.clickObject.parentElement||a.clickObject.parentNode))a.clickObject=0;else{var k=a.O=a.clickObject;a.oa&&(clearTimeout(a.oa),a.oa=0);a.oa=setTimeout(function(){a.O==k&&(a.O=0)},1E4);f=a.Xa();a.track();if(f<a.Xa()&&a.useForcedLinkTracking&&b.target){for(e=b.target;e&&e!=a.b&&"A"!=e.tagName.toUpperCase()&&"AREA"!=e.tagName.toUpperCase();)e=e.parentNode;if(e&&(g=e.href,a.Za(g)||(g=0),d=e.target,b.target.dispatchEvent&&
g&&(!d||"_self"==d||"_top"==d||"_parent"==d||h.name&&d==h.name))){try{c=a.d.createEvent("MouseEvents")}catch(l){c=new h.MouseEvent}if(c){try{c.initMouseEvent("click",b.bubbles,b.cancelable,b.view,b.detail,b.screenX,b.screenY,b.clientX,b.clientY,b.ctrlKey,b.altKey,b.shiftKey,b.metaKey,b.button,b.relatedTarget)}catch(m){c=0}c&&(c["s_fe_"+a._in]=c.s_fe=1,b.stopPropagation(),b.stopImmediatePropagation&&b.stopImmediatePropagation(),b.preventDefault(),a.bodyClickTarget=b.target,a.L=c)}}}}}catch(n){a.clickObject=
0}}},a.b&&a.b.attachEvent?a.b.attachEvent("onclick",a.u):a.b&&a.b.addEventListener&&(navigator&&(0<=navigator.userAgent.indexOf("WebKit")&&a.d.createEvent||0<=navigator.userAgent.indexOf("Firefox/2")&&h.MouseEvent)&&(a.Ra=1,a.useForcedLinkTracking=1,a.b.addEventListener("click",a.u,!0)),a.b.addEventListener("click",a.u,!1))):setTimeout(a.gb,30)};a.yc=a.Ga();a.fc();a.Fc||(r?a.setAccount(r):a.log("Error, missing Report Suite ID in AppMeasurement initialization"),a.gb(),a.loadModule("ActivityMap"))}
function s_gi(r){var a,h=window.s_c_il,q,p,m=r.split(","),s,u,t=0;if(h)for(q=0;!t&&q<h.length;){a=h[q];if("s_c"==a._c&&(a.account||a.oun))if(a.account&&a.account==r)t=1;else for(p=a.account?a.account:a.oun,p=a.allAccounts?a.allAccounts:p.split(","),s=0;s<m.length;s++)for(u=0;u<p.length;u++)m[s]==p[u]&&(t=1);q++}t?a.setAccount&&a.setAccount(r):a=new AppMeasurement(r);return a}AppMeasurement.getInstance=s_gi;window.s_objectID||(window.s_objectID=0);
function s_pgicq(){var r=window,a=r.s_giq,h,q,p;if(a)for(h=0;h<a.length;h++)q=a[h],p=s_gi(q.oun),p.setAccount(q.un),p.setTagContainer(q.tagContainerName);r.s_giq=0}s_pgicq();
