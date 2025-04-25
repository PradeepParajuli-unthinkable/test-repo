(function(){if(window.location.search.indexOf('mythdebug')!==-1)console.log('Current path: ',window.location.pathname);class GPTLoader{static domain='jornaldia.com.br';static contentSlots=[{"id":1003,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_1","display":"/22794149020/jornaldia/jornaldia_content1","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1004,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_2","display":"/22794149020/jornaldia/jornaldia_content2","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1005,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_3","display":"/22794149020/jornaldia/jornaldia_content3","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1006,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_4","display":"/22794149020/jornaldia/jornaldia_content4","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1007,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_5","display":"/22794149020/jornaldia/jornaldia_content5","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1008,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_6","display":"/22794149020/jornaldia/jornaldia_content6","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1009,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_7","display":"/22794149020/jornaldia/jornaldia_content7","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1010,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_8","display":"/22794149020/jornaldia/jornaldia_content8","sizesMobile":["fluid","336x280","300x250","320x100"],"sizesTablet":["fluid","336x280","300x250","320x100"],"sizes":["fluid","336x280","300x250","250x250"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01},{"id":1011,"mobile":!0,"tablet":!0,"desktop":!0,"slot":"ad_paragraph_9","display":"/22794149020/jornaldia/jornaldia_content9","sizesMobile":["fluid","300x250","336x280","320x100"],"sizesTablet":["fluid","300x250","336x280","320x100"],"sizes":["fluid","250x250","300x250","336x280"],"autoTargeting":!1,"refreshIndividually":!0,"refresh":!0,"refreshTime":30000,"mythValue":0.01}];static customSlots=[];static fallbackPaths=[{slot:'ad_paragraph_1',path:'/22794149020/jornaldia/jornaldia_content9'},{slot:'ad_paragraph_2',path:'/22794149020/jornaldia/jornaldia_content8'},{slot:'ad_paragraph_3',path:'/22794149020/jornaldia/jornaldia_content7'}];static avoids=[];static targetting=[];static interstitial={"display":"/22794149020/jornaldia/jornaldia_interstitial","mythValue":0.01};static stick={"display":"/22794149020/jornaldia/jornaldia_stick","mythValue":0.01};static usedAdSlots={};static disableCssSizing=!1;static hideAfterMaxFails=!1;static categoryAndUserTargeting=!1;static imageAds=[{"name":"in-image","content":"/22794149020/uainoticias/uainoticias_inimage","target":".size-large img","type":1,"refreshIndividually":!0,"refresh":!0,"refreshTime":20000,"mythValue":0.01}];static refreshTime=20000;static enableTruvidScript=!0;static truvidTarget='.wp-post-image';static truvidCode=`<div class="truvidPos"><script async type="text/javascript" src="https://cnt.trvdp.com/js/1646/11775.js"></script></div>`;static enableTaboolaScript=!1;static taboolaScriptId='';static taboolaTarget='';static startTimeout=1000;static enableIngest=0==1;static pageInitTime=Date.now();static enableLatestNews=('false'!='true')??!1;static latestNewsParagraphId=parseInt('1')||0;static latestNewsSpacementStyle='pixel'||'pixel';static latestNewsSpacementValue=parseInt('50')||0;static latestNewsDivName='taboola-latest-news'||'';static latestNewsDivColor='#4CAF50'||'#4CAF50';static latestNewsDivSwapColors=('false'=='true')??!1;static sentTracing=[];static enableIndividualSlotRefresh=!0;static isArticleExpanded=!this.enableLatestNews;constructor(){this.MAX_RETRIES=300;this.TOTAL_WORDS_LENGTH=50;this.slotsRefreshCount={};this.fallbackAttemptedSlots=new Set();this.MAX_FALLBACKS=GPTLoader.fallbackPaths.length;this.slotsFallbackCount={}}
static location(){let url=window.location.origin+window.location.pathname;if(url.startsWith('https://')){url=url.substring(8)}else if(url.startsWith('http://')){url=url.substring(7)}
if(url.startsWith('www.')){url=url.substring(4)}
return url}
stringToNumber(str){let hash=5381;for(let i=0;i<str.length;i++){hash=(hash<<5)+hash+str.charCodeAt(i)}
let val=hash>>>0;return val.toString()}
async sendTracingData(data){if(!GPTLoader.enableIngest)return;if(data.SlotId==null)return;if(data.MythValue==null)return;let elapsedTime=Date.now()-GPTLoader.pageInitTime;if(elapsedTime>10*60*1000)return;let key=`${data.SlotId}_${data.State}`;if(GPTLoader.sentTracing[key])return;GPTLoader.sentTracing[key]=!0;let url='https://analytics.mythneural.com/ingest';let device=this.getDevice();data.Url=GPTLoader.location();data.Device=device;data.Domain=GPTLoader.domain;let response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});let result=await response.json();return result.message=='success'}
getDevice(){let size=window.innerWidth;if(size<=520){return'mobile'}else if(size<=820){return'tablet'}else{return'desktop'}}
getCurrentPageSkips(){if(typeof window.adSkips!=='undefined'){return{wholePage:window.adSkips>=95?1:0,skips:window.adSkips}}}
async init(){try{let exceptions=[];window.googletag=window.googletag||{cmd:[]};let shouldSkip=exceptions.find((exception)=>exception.path===window.location.pathname);let currentPage=this.getCurrentPageSkips();if((shouldSkip&&shouldSkip.wholePage===1)||(currentPage&&currentPage.wholePage===1)){return}
googletag.cmd.push(()=>{for(let target of GPTLoader.targetting){let allowed=!0;if(target.condition&&target.condition==1){let pageUrl=window.location.href;if(pageUrl.indexOf(target.conditionValue)==-1){allowed=!1}}
if(allowed){googletag.pubads().setTargeting(target.key,target.value).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()))}}
if(GPTLoader.categoryAndUserTargeting==!0){if(typeof __postCategories!='undefined'){googletag.pubads().setTargeting('myth-tracking-category',__postCategories[0]).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()))}
if(typeof __postAuthor!='undefined'){googletag.pubads().setTargeting('myth-tracking-author',__postAuthor).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()))}}
googletag.pubads().setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));let anchorSlot,interstitialSlot;if(GPTLoader.interstitial!=null){interstitialSlot=googletag.defineOutOfPageSlot(GPTLoader.interstitial.display,googletag.enums.OutOfPageFormat.INTERSTITIAL);if(interstitialSlot){interstitialSlot.setTargeting('refresh','false').addService(googletag.pubads()).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));if(GPTLoader.enableIngest)
interstitialSlot.setTargeting('myth_value',GPTLoader.interstitial.mythValue);GPTLoader.interstitial.div=interstitialSlot.getSlotElementId()}}
if(GPTLoader.stick!=null){anchorSlot=googletag.defineOutOfPageSlot(GPTLoader.stick.display,googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR);if(anchorSlot){anchorSlot.setTargeting('refresh','true').addService(googletag.pubads()).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));if(GPTLoader.enableIngest)
anchorSlot.setTargeting('myth_value',GPTLoader.stick.mythValue);GPTLoader.stick.div=anchorSlot.getSlotElementId()}}
this.configureCustomSlots();this.configureContentSlots();this.configureImageSlots();googletag.pubads().enableLazyLoad();googletag.pubads().enableLazyLoad({fetchMarginPercent:-1});googletag.pubads().enableLazyLoad({fetchMarginPercent:500,renderMarginPercent:200,mobileScaling:2.0,});googletag.enableServices();googletag.pubads().enableSingleRequest();if(window.googletag&&window.googletag.apiReady){googletag.pubads().addEventListener('slotRenderEnded',event=>{this.handleSlotRenderEnded(event)});googletag.pubads().addEventListener('slotOnload',event=>{this.handleSlotLoadEnded(event)});googletag.pubads().addEventListener('slotVisibilityChanged',event=>{this.handleSlotVisibilityChanged(event)})}else{console.error('GPT API is not ready when trying to set up event listeners.')}
if(anchorSlot){this.executeDisplaySlot(anchorSlot)}
if(interstitialSlot){this.executeDisplaySlot(interstitialSlot)}
if(GPTLoader.enableTruvidScript){this.initTruvidScript()}
if(GPTLoader.enableTaboolaScript){window.addEventListener('load',()=>{this.initTaboolaScript()})}
this.desplayAllAdSlots();googletag.pubads().addEventListener('impressionViewable',(event)=>{let slot=event.slot;if(window.location.search.indexOf('mythdebug')!==-1)console.log(slot.getSlotElementId()+" is viewable");let isContent=GPTLoader.contentSlots.find(e=>e.slot===slot.getSlotElementId());let refreshTime=GPTLoader.refreshTime;let contentSlot=GPTLoader.contentSlots.find(e=>e.slot===slot.getSlotElementId());if(this.enableIndividualSlotRefresh&&contentSlot&&contentSlot.refreshIndividually){if(contentSlot.refresh==!1)return;refreshTime=contentSlot.refreshTime}
let imageSlot=GPTLoader.imageAds.find(e=>e.div?.id===slot.getSlotElementId());if(this.enableIndividualSlotRefresh&&imageSlot&&imageSlot.refreshIndividually){if(imageSlot.refresh==!1)return;refreshTime=imageSlot.refreshTime}
let customSlot=GPTLoader.customSlots.find(e=>e.target===slot.getSlotElementId());if(this.enableIndividualSlotRefresh&&customSlot&&customSlot.refreshIndividually){if(customSlot.refresh==!1)return;refreshTime=customSlot.refreshTime}
setTimeout(function(){googletag.pubads().refresh([slot]);slot.refreshCount++;if(imageSlot){let element=document.getElementById(`${imageSlot.div.id}`);if(element){this.updateOverlayDiv(element,document.querySelector(imageSlot.target))}}},refreshTime)})})}catch(error){if(window.location.search.indexOf('mythdebug')!==-1)console.error('[GPTLoader] Failed to initialize GPT:',error);}}
initTruvidScript(){let element=document.querySelector(GPTLoader.truvidTarget);if(!element){if(window.location.search.indexOf('mythdebug')!==-1)console.warn('Failed to find Truvid target element:',GPTLoader.truvidTarget);return}
element.innerHTML+=GPTLoader.truvidCode}
initTaboolaScript(){let header=document.querySelector('head');let script=document.createElement('script');script.type='text/javascript';script.innerHTML=`
                window._taboola = window._taboola || [];
                _taboola.push({article:'auto'});
                !function (e, f, u, i) {
                    if (!document.getElementById(i)){
                    e.async = 1;
                    e.src = u;
                    e.id = i;
                    f.parentNode.insertBefore(e, f);
                    }
                }(document.createElement('script'),
                document.getElementsByTagName('script')[0],
                '//cdn.taboola.com/libtrc/${GPTLoader.taboolaScriptId}/loader.js',
                'tb_loader_script');
                if(window.performance && typeof window.performance.mark == 'function')
                    {window.performance.mark('tbl_ic');}
            `;header.appendChild(script);let element=document.querySelector(GPTLoader.taboolaTarget);if(!element){if(window.location.search.indexOf('mythdebug')!==-1)console.warn('Failed to find Taboola target element:',GPTLoader.taboolaTarget);}else{let script=document.createElement('script');script.type='text/javascript';script.innerHTML=`
                    window._taboola = window._taboola || [];
                    _taboola.push({
                        mode: 'alternating-thumbnails-a',
                        container: '${GPTLoader.taboolaTarget.replace('#', '').replace('.', '')}',
                        placement: 'Below Article Thumbnails',
                        target_type: 'mix'
                    });
                `;element.appendChild(script)}
let body=document.querySelector('body');let scriptEnd=document.createElement('script');scriptEnd.type='text/javascript';scriptEnd.innerHTML=`
                window._taboola = window._taboola || [];
                _taboola.push({flush: true});
            `;body.appendChild(scriptEnd)}
getSlotDetails(slot){let contentSlot=GPTLoader.contentSlots.find(e=>e.slot===slot.getSlotElementId());let stickSlot=GPTLoader.stick&&GPTLoader.stick.div===slot.getSlotElementId();let interstitialSlot=GPTLoader.interstitial&&GPTLoader.interstitial.div===slot.getSlotElementId();let imageSlot=GPTLoader.imageAds.find(e=>e.div?.id===slot.getSlotElementId());let customSlot=GPTLoader.customSlots.find(e=>e.target===slot.getSlotElementId());let slotType=contentSlot?contentSlot.slot:stickSlot?'stick':interstitialSlot?'interstitial':imageSlot?`image-${imageSlot.name}`:customSlot?`custom-${customSlot.type}-${customSlot.originalTarget}`:null;return slotType}
getSlotMythValue(slot){let contentSlot=GPTLoader.contentSlots.find(e=>e.slot===slot.getSlotElementId());let stickSlot=GPTLoader.stick&&GPTLoader.stick.div===slot.getSlotElementId();let interstitialSlot=GPTLoader.interstitial&&GPTLoader.interstitial.div===slot.getSlotElementId();let imageSlot=GPTLoader.imageAds.find(e=>e.div?.id===slot.getSlotElementId());let customSlot=GPTLoader.customSlots.find(e=>e.target===slot.getSlotElementId());let mythValue=contentSlot?contentSlot.mythValue:stickSlot?GPTLoader.stick.mythValue:interstitialSlot?GPTLoader.interstitial.mythValue:imageSlot?imageSlot.mythValue:customSlot?customSlot.mythValue:null;return mythValue}
isElementInView(elementId){let element=document.getElementById(elementId);if(!element){return!1}
let rect=element.getBoundingClientRect();return(rect.top>=0&&rect.left>=0&&rect.bottom<=(window.innerHeight||document.documentElement.clientHeight)&&rect.right<=(window.innerWidth||document.documentElement.clientWidth))}
async loadGPTScript(){if(window.googletag&&window.googletag.apiReady){return}
return new Promise((resolve,reject)=>{let gptScript=document.createElement('script');gptScript.src='https://securepubads.g.doubleclick.net/tag/js/gpt.js';gptScript.addEventListener('load',resolve);gptScript.addEventListener('error',reject);document.head.appendChild(gptScript)})}
createAdSlot(elName,type='div',position='beforeBegin'){let customId=elName;if(type=='class'){customId=elName+'_'+Math.floor(Math.random()*10000000000000000);let element=document.getElementsByClassName(elName)[0];if(element){element.id=customId}else{console.warn(`No element found with class: ${elName}`);return}}
let element=document.getElementById(customId);if(!element){console.warn(`No element found with ID: ${customId}`);return}
let newId=customId+'_'+Math.floor(Math.random()*10000000000000000);let newElement=document.createElement('div');newElement.id=newId;newElement.setAttribute('class','ad-wrapper-div');if(!GPTLoader.disableCssSizing)newElement.setAttribute('auto-height','true');newElement.style.textAlign='center';if(!GPTLoader.disableCssSizing)newElement.style.height='280px';if(position=='beforeBegin'){element.insertAdjacentElement('beforebegin',newElement)}else if(position=='afterEnd'){element.insertAdjacentElement('afterend',newElement)}
return newId}
async configureCustomSlots(){let device=this.getDevice();for(let i=0;i<GPTLoader.customSlots.length;i++){let active=GPTLoader.customSlots[i]?.[device];if(!active){continue}
let id=GPTLoader.customSlots[i].id;let slotConfig=GPTLoader.customSlots[i];let elName=slotConfig.target;let display=slotConfig.display;let customCSS=slotConfig.css;let slotType=slotConfig.position;let type=slotConfig.type;let mythValue=slotConfig.mythValue;let sizes=device==='mobile'?slotConfig.sizesMobile:device==='tablet'?slotConfig.sizesTablet:slotConfig.sizes;sizes=sizes.map((size)=>{if(size.indexOf('x')!==-1){return size.split('x').map((s)=>parseInt(s))}else{return size}});slotConfig.originalTarget=elName;if(elName&&display){switch(slotType){case "insideContent":slotConfig.target=this.configureAdSlots(elName,display,sizes,'',type,!0,!1,customCSS,mythValue);slotConfig.targetElement=document.getElementById(elName);break;case "beforeBegin":elName=this.createAdSlot(elName,type,'beforeBegin');slotConfig.type='div';slotConfig.target=this.configureAdSlots(elName,display,sizes,'','div',!0,!1,customCSS,mythValue);slotConfig.targetElement=document.getElementById(elName);break;case "afterEnd":elName=this.createAdSlot(elName,type,'afterEnd');slotConfig.type='div';slotConfig.target=this.configureAdSlots(elName,display,sizes,'','div',!0,!1,customCSS,mythValue);slotConfig.targetElement=document.getElementById(elName);break}}
slotConfig.target=elName;GPTLoader.usedAdSlots[elName]=`custom-${id}`}}
async configureContentSlots(){let device=this.getDevice();for(let i=0;i<GPTLoader.contentSlots.length;i++){let active=GPTLoader.contentSlots[i]?.[device]||!0;if(!active){continue}
if(window.location.search.indexOf('mythdebug')!==-1)console.log("GPTLoader.contentSlots[i].slot: ",GPTLoader.contentSlots[i].slot);let elName=GPTLoader.contentSlots[i].slot;let divElement=document.getElementById(elName);let autoTargeting=GPTLoader.contentSlots[i].autoTargeting;if(!divElement){if(window.location.search.indexOf('mythdebug')!==-1)console.warn(`No element found with ID: ${elName}`);continue}
let display=GPTLoader.contentSlots[i].display;let sizes=device==='mobile'?GPTLoader.contentSlots[i].sizesMobile:device==='tablet'?GPTLoader.contentSlots[i].sizesTablet:GPTLoader.contentSlots[i].sizes;sizes=sizes.map((size)=>{if(size.indexOf('x')!==-1){return size.split('x').map((s)=>parseInt(s))}else{return size}});let mythValue=GPTLoader.contentSlots[i].mythValue;if(elName&&display){this.configureAdSlots(elName,display,sizes,undefined,undefined,undefined,autoTargeting,undefined,mythValue);GPTLoader.usedAdSlots[elName]=`slot-${GPTLoader.contentSlots[i].id}`}}}
async desplayAllAdSlots(){let exceptions=[];let shouldSkip=exceptions.find((exception)=>exception.path===window.location.pathname);let currentPage=this.getCurrentPageSkips();if((shouldSkip&&shouldSkip.wholePage===1)||(currentPage&&currentPage.wholePage===1)){return}
for(let slot of GPTLoader.imageAds){if(!document.querySelector(slot.target))continue;if(slot.div&&googletag.pubads().getSlots().some(s=>s.getSlotElementId()===slot.div.id)){this.executeDisplaySlot(slot.div.id)}else{if(window.location.search.includes("mythdebug"))
console.warn(`[GPT] Skipping display for image ad ${slot.div?.id} � slot not defined yet.`);}}
for(let i=0;i<GPTLoader.customSlots.length;i++){let elName=GPTLoader.customSlots[i].target;let divElement;if(GPTLoader.customSlots[i].type==='div'){divElement=document.getElementById(elName)}else{divElement=document.getElementsByClassName(elName)[0]}
if(elName&&divElement){this.executeDisplaySlot(divElement.id)}}
let device=this.getDevice();for(let i=0;i<GPTLoader.contentSlots.length;i++){let active=GPTLoader.contentSlots[i]?.[device]||!0;if(!active){continue}
let elName=GPTLoader.contentSlots[i].slot;let divElement=document.getElementById(elName);if(elName&&divElement){this.executeDisplaySlot(elName)}}}
configureImageSlot(slot){if(!googletag.pubads().getSlots().find(adSlot=>adSlot.getSlotElementId()==slot.div.id)){googletag.cmd.push(()=>{if(slot.type==1){let device=(window.innerWidth<=768)?'mobile':'desktop';let slotElement,sizes;if(device=='mobile'){let targetElement=document.querySelector(slot.target);let slotWidth=targetElement.getBoundingClientRect().width;let sizes=[[slotWidth,50],[slotWidth,100]];if(slotWidth>=320)sizes.push([320,50]);if(slotWidth>=300)sizes.push([300,50]);if(slotWidth>=250)sizes.push([250,50]);if(slotWidth>=200)sizes.push([200,50]);if(slotWidth>=160)sizes.push([160,50]);if(slotWidth>=120)sizes.push([120,50]);slotElement=googletag.defineSlot(slot.content,sizes,slot.div.id)}else{let slotHeight=Math.floor(slot.div.parentElement.getBoundingClientRect().height/10)*10;sizes=[[300,slotHeight],[200,slotHeight],[160,slotHeight],[120,slotHeight]];slotElement=googletag.defineSlot(slot.content,sizes,slot.div.id)}
let mapping=googletag.sizeMapping().addSize([0,0],sizes).build();if(slotElement&&mapping!==null){slotElement=slotElement.defineSizeMapping(mapping)}
if(slotElement){slotElement.setCollapseEmptyDiv(!0).addService(googletag.pubads()).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));if(GPTLoader.enableIngest)
slotElement.setTargeting('myth_value',slot.mythValue);}}})}}
async configureImageSlots(){for(let slot of GPTLoader.imageAds){if(!document.querySelector(slot.target))continue;this.configureImageSlot(slot)}}
configureAdSlots(elName,display,sizes=['fluid',[250,250],[300,250],[336,280]],customCSS='',type='div',isCustomSlot=!1,autoTargeting=!1,css='',mythValue=0.01){if(!googletag.pubads().getSlots().find(slot=>{let element=document.getElementById(slot.getSlotElementId());return((type=='div'&&slot.getSlotElementId()===elName)||(type=='class'&&element&&element.classList.contains(elName)))})){let customId=elName;if(type=='class'){customId=elName+'_'+Math.floor(Math.random()*10000000000000000);let element=document.getElementsByClassName(elName)[0];if(element){element.id=customId}else{console.warn(`No element found with class: ${elName}`);return}}
googletag.cmd.push(()=>{let mapping=googletag.sizeMapping().addSize([0,0],sizes).build();if(isCustomSlot){let element=document.getElementById(customId);if(!element)return;this.configureCustomSlot(element)}
let slot=googletag.defineSlot(display,sizes.filter(e=>e!='fluid'),customId);if(autoTargeting&&typeof __postCategories!='undefined'){if(__postCategories.length>0){slot.setTargeting('category',__postCategories[0]).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()))}
slot.setTargeting('author',__postAuthor).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()))}
if(slot&&mapping!==null&&googletag!==null){slot=slot.defineSizeMapping(mapping)}
if(slot){slot.setCollapseEmptyDiv(!0).addService(googletag.pubads()).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));if(GPTLoader.enableIngest)
slot.setTargeting('myth_value',mythValue);}
if(customCSS){let slotElement=document.getElementById(customId);if(slotElement){slotElement.classList.add(customCSS)}}
if(css&&css.length>0){let slotElement=document.getElementById(customId);if(slotElement){slotElement.style.cssText+=css}}});return customId}}
configureCustomSlot(element){if(!element)return;element.style.textAlign='center';if(!GPTLoader.disableCssSizing)element.style.height='280px'}
async handleSlotRenderEnded(event){let slot=event.slot;let elementId=slot.getSlotElementId();let element=document.getElementById(elementId);if(!element)return;this.slotsRefreshCount[elementId]=this.slotsRefreshCount[elementId]||0;this.slotsFallbackCount[elementId]=this.slotsFallbackCount[elementId]||0;if(event.isEmpty){setTimeout(()=>{if(this.slotsRefreshCount[elementId]<this.MAX_RETRIES){this.slotsRefreshCount[elementId]++;if(window.location.search.indexOf('mythdebug')!==-1)console.log(`${elementId} slot is empty, retrying (${this.slotsRefreshCount[elementId]}/${this.MAX_RETRIES})`);try{googletag.pubads().refresh([slot])}catch(error){if(window.location.search.indexOf('mythdebug')!==-1)console.error(`Failed to reload ad slot ${elementId}:`,error);}}else if(this.slotsFallbackCount[elementId]<this.MAX_FALLBACKS){if(elementId.includes("Stick")||elementId.includes("Interstitial")||elementId.includes("stick")||elementId.includes("interstitial")){if(window.location.search.indexOf('mythdebug')!==-1)console.log(`No fallback for ${elementId} as it's a Stick or Interstitial slot.`);}else{if(window.location.search.indexOf('mythdebug')!==-1)console.log(`${elementId} slot is still empty after ${this.MAX_RETRIES} retries, attempting fallback.`);this.slotsFallbackCount[elementId]++;this.loadFallbackContent(slot,elementId)}}else{if(window.location.search.indexOf('mythdebug')!==-1)console.log(`No more fallbacks available for ${elementId}.`);if(GPTLoader.hideAfterMaxFails){let parent=element.parentElement;if(parent){parent.style.display='none'}}
let slotType=this.getSlotDetails(slot);let mythValue=this.getSlotMythValue(slot);this.sendTracingData({SlotId:slotType,State:'Empty',FallbackCallsCount:this.slotsFallbackCount[elementId],MythValue:mythValue,})}
if(!GPTLoader.hideAfterMaxFails){element.style.display=''}},3000)}else{if(window.location.search.indexOf('mythdebug')!==-1)console.log(`Ad slot ${elementId} loaded successfully.`);let imageAd=GPTLoader.imageAds.find(ad=>(ad.div?ad.div.id:'')===elementId);if(imageAd){imageAd.div.style.display='flex';imageAd.div.style.justifyContent='end';imageAd.div.style.alignItems='center';let iframe=imageAd.div.querySelector('iframe');if(iframe){}
let closeButton=document.getElementById(`${elementId.replace('__ad-element', '__wrapper-close')}`);if(closeButton){closeButton.style.display='flex'}
let wrapper=document.getElementById(`${elementId.replace('__ad-element', '__wrapper')}`);if(wrapper){wrapper.style.opacity=1}}}}
async loadFallbackContent(slot,elementId){let fallbackIndex=this.slotsFallbackCount[elementId]-1;let fallbackPath=GPTLoader.fallbackPaths[fallbackIndex];if(fallbackPath){if(window.location.search.indexOf('mythdebug')!==-1)console.log(`Loading fallback content for ${elementId}: ${fallbackPath}`);try{let currentId=GPTLoader.usedAdSlots[elementId];if(currentId&&(fallbackPath.exceptions.includes(currentId)||(currentId.startsWith('custom-')&&fallbackPath.exceptions.includes('allcustom')))){if(window.location.search.indexOf('mythdebug')!==-1)console.log(`Skipping fallback for ${elementId} as it has been marked as exception.`);return}
googletag.destroySlots([slot]);let device=this.getDevice();let sizes=device==='mobile'?fallbackPath.sizesMobile:device==='tablet'?fallbackPath.sizesTablet:fallbackPath.sizes;sizes=sizes.map((size)=>{if(size.indexOf('x')!==-1){return size.split('x').map((s)=>parseInt(s))}else{return size}});googletag.defineSlot(fallbackPath.content,sizes.filter(e=>e!='fluid'),elementId).addService(googletag.pubads()).setTargeting('page_unique_id',this.stringToNumber(GPTLoader.location()));if(GPTLoader.enableIngest)
googleTag.setTargeting('myth_value',fallbackPath.mythValue)
googletag.display(elementId);}catch(error){if(window.location.search.indexOf('mythdebug')!==-1)console.error(`Failed to load fallback content for ${elementId}:`,error);}}else{if(window.location.search.indexOf('mythdebug')!==-1)console.error(`No fallback path defined for index ${fallbackIndex}`);}}
async executeDisplaySlot(elName){googletag.display(elName)}
applyHeight(elementId){let element=document.getElementById(elementId);if(!element)return;let parent=element.parentElement;if(!parent)return;let isAutoHeight=parent.getAttribute('auto-height');if(isAutoHeight){let currentHeight=parent.style.height;currentHeight=currentHeight?parseInt(currentHeight.replace('px','')):0;parent.style.height='auto';let dom=parent.getBoundingClientRect();let height=Math.max(dom.height,currentHeight);if(height<=10){setTimeout(()=>{this.applyHeight(elementId)},1000);return}
parent.style.height=Math.max(dom.height,currentHeight)+'px'}}
handleSlotVisibilityChanged(event){let slot=event.slot;let slotType=this.getSlotDetails(slot);let mythValue=this.getSlotMythValue(slot);let elementId=slot.getSlotElementId();let isVisible=event.inViewPercentage>0;if(isVisible){this.sendTracingData({SlotId:slotType,State:'ShownToUser',FallbackCallsCount:0,MythValue:mythValue,})}}
async handleSlotLoadEnded(event){let slot=event.slot;window.globalxd=slot;let elementId=slot.getSlotElementId();if(window.location.search.indexOf('mythdebug')!==-1)console.log(`${elementId} slot loaded successfully.`);this.applyHeight(elementId);let slotType=this.getSlotDetails(slot);let mythValue=this.getSlotMythValue(slot);this.sendTracingData({SlotId:slotType,State:'Loaded',FallbackCallsCount:this.slotsFallbackCount[elementId],MythValue:mythValue,})}
getElementOffset(el){el.style.position='absolute';el.style.top='0px';el.style.left='0px';let rect=el.getBoundingClientRect();return{top:rect.top+window.scrollY,left:rect.left+window.scrollX}}
updateOverlayDiv(element,targetElement){let dom=targetElement.getBoundingClientRect();let scrollWidth=window.innerWidth-document.documentElement.clientWidth;let offset=this.getElementOffset(element);element.style.left=(dom.left+window.scrollX-offset.left)+'px';element.style.top=(dom.top+window.scrollY-offset.top)+'px';element.style.height=dom.height+'px';element.style.width=dom.width+'px';let iframe=element.querySelector('iframe');if(!iframe)return;let parentElement=iframe.parentElement.parentElement;let parentDom=parentElement.getBoundingClientRect();let iframeDom=iframe.getBoundingClientRect();if(Math.abs(iframeDom.height-parentDom.height)>7){let computedStyle=window.getComputedStyle(iframe);let currentScale=parseFloat(computedStyle.scale);if(isNaN(currentScale))currentScale=1;let newScale=parentDom.height/iframeDom.height*currentScale;iframe.style.scale=newScale}
iframeDom=iframe.getBoundingClientRect();parentDom=parentElement.getBoundingClientRect();if(iframeDom.width-parentDom.width>7){let computedStyle=window.getComputedStyle(iframe);let currentScale=parseFloat(computedStyle.scale);if(isNaN(currentScale))currentScale=1;let newScale=parentDom.width/iframeDom.width*currentScale;iframe.style.scale=newScale}}
createOverlayDiv(target){let targetElement=document.querySelector(target);if(!targetElement){console.warn(`No element found with selector: ${target}`);return}
let parent=targetElement.parentElement;let elementName=target.slice(1);while(elementName.indexOf(' ')!=-1)elementName=elementName.replace(' ','-');let id=`${elementName}__wrapper`;if(document.getElementById(id)){}else{}
let element=document.createElement('div');element.id=id;element.style.position='absolute';element.style.height='100%';element.style.display='flex';element.style.opacity=0;element.style.justifyContent='end';parent.append(element);let insideWrapper=document.createElement('div');element.append(insideWrapper);insideWrapper.style.position='absolute';insideWrapper.style.height='100%';let closeButton=document.createElement('div');closeButton.innerHTML='&#10005;';closeButton.style.cursor='pointer';closeButton.style.position='absolute';closeButton.style.background='#575757';closeButton.style.top='3px';closeButton.style.left='3px';closeButton.style.width='30px';closeButton.style.height='30px';closeButton.style.justifyContent='center';closeButton.style.alignItems='center';closeButton.style.fontSize='14px';closeButton.style.borderRadius='50%';closeButton.style.color='#fff';closeButton.style.opacity='0.6';closeButton.style.display='none';closeButton.id=`${elementName}__wrapper-close`;closeButton.addEventListener('click',(event)=>{event.preventDefault();element.style.display='none';return!1});let adElement=document.createElement('div');adElement.id=`${elementName}__ad-element`;adElement.style.backgroundColor='rgba(65, 65, 65, 0.8)';adElement.style.height='100%';insideWrapper.append(adElement);insideWrapper.append(closeButton);this.updateOverlayDiv(element,targetElement);setInterval(this.updateOverlayDiv.bind(this),5000,element,targetElement);window.addEventListener('resize',this.updateOverlayDiv.bind(this,element,targetElement));window.addEventListener('scroll',this.updateOverlayDiv.bind(this,element,targetElement));return adElement}
loadLatestNewsDiv(){if(!GPTLoader.enableLatestNews)return;let element=document.getElementById(`ad_paragraph_${GPTLoader.latestNewsParagraphId}`);if(!element)return console.warn(`No element found with ID: ad_paragraph_${GPTLoader.latestNewsParagraphId}`);let insertedElement=null;if(GPTLoader.latestNewsSpacementStyle=='pixel'){let div=document.createElement('div');div.style.marginTop=`${GPTLoader.latestNewsSpacementValue}px`;div.style.height='90px';div.id=GPTLoader.latestNewsDivName;element.parentElement.insertAdjacentElement('afterend',div);insertedElement=div}else{let paragraphs=element.parentElement.parentElement.children;let filteredParagraphs=[];let found=!1;for(let p of paragraphs){if(found&&p.tagName=='P'){filteredParagraphs.push(p)}
if(p==element||p==element.parentElement||p==element.parentElement.parentElement){found=!0}}
if(filteredParagraphs.length==0)return console.warn('No paragraphs found after the current paragraph');let totalWords=0;let insertAfter=null;for(let p of filteredParagraphs){let words=p.textContent.trim().split(/\s+/);totalWords+=words.length;if(totalWords>=GPTLoader.latestNewsSpacementValue){insertAfter=p;break}}
if(insertAfter){let div=document.createElement('div');div.id=GPTLoader.latestNewsDivName;insertAfter.insertAdjacentElement('afterend',div);div.style.marginTop='5px';insertedElement=div}else{console.warn('No paragraph found to insert the div')}}
if(insertedElement){insertedElement.innerHTML=`<div id="latest-news-button-center"><button id="latest-news-button">CONTINUAR LENDO</button></div>`;document.head.innerHTML+=`<style>
                    #latest-news-button {
                        background-color: white;
                        border: none;
                        color: ${GPTLoader.latestNewsDivSwapColors ? '#ffffff' : GPTLoader.latestNewsDivColor};
                        box-shadow: 0 1px 2px #cecece;
                        padding: 15px 32px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                        font-size: 13px;
                        margin: 4px 2px;
                        cursor: pointer;
                        border-radius: 5px;
                        font-weight: 700;
                        transition: background-color 0.3s;
                    }

                    #latest-news-button:hover {
                        background-color: ${GPTLoader.latestNewsDivSwapColors ? GPTLoader.latestNewsDivColor : '#ffffff'};
                    }
                    
                    #latest-news-button-center {
                        display: flex;
                        justify-content: center;
                        padding-block: 1rem;
                        background: #f6f6f6;
                        border-top: 1px solid #dedede;
                        border-bottom: 1px solid #dedede;
                        position: absolute;
                        left: 50%;
                        width: min(100%, 1600px);
                        transform: translateX(-50%);
                    }
                </style>`;let elementsAfter=[];let parent=insertedElement.parentElement;let found=!1;for(let i=0;i<parent.children.length;i++){let child=parent.children[i];if(found){elementsAfter.push(child)}
if(child==insertedElement){found=!0}}
for(let el of elementsAfter){el.style.display='none'}
document.getElementById('latest-news-button').addEventListener('click',()=>{for(let el of elementsAfter){el.style.display=''}
insertedElement.style.display='none'})}}
autoDiv(){let paragraphs=document.getElementsByTagName('p');let currentId=1;let totalWords=0;let skipId=1;let paragraphCounter=0;let device=this.getDevice();let exceptions=[];for(let i=0;i<paragraphs.length;i++){let paragraph=paragraphs[i];let paragraphText=paragraph.textContent.trim();let words=paragraphText.split(/\s+/);totalWords+=words.length;if(totalWords<this.TOTAL_WORDS_LENGTH){continue}
totalWords=0;let isInFooter=this.isDescendantOf(paragraph,'footer');let isInSidebar=this.isDescendantWithClass(paragraph,'sidebar');let isInsideAvoid=!1;for(let j=0;j<GPTLoader.avoids.length;j++){let avoid=GPTLoader.avoids[j];if(avoid.type=='class'){if(this.isDescendantWithClass(paragraph,avoid.selector)){isInsideAvoid=!0;break}}else if(avoid.type=='id'){if(this.isDescendantOfId(paragraph,avoid.selector)){isInsideAvoid=!0;break}}}
if(isInsideAvoid){continue}
let shouldSkip=exceptions.find((exception)=>exception.path===window.location.pathname&&skipId<=exception.skip);let currentPage=this.getCurrentPageSkips();shouldSkip=shouldSkip||(currentPage&&currentPage.skips>skipId);if(shouldSkip){if(window.location.search.indexOf('mythdebug')!==-1)console.log('Skipping paragraph: ',i);skipId++;continue}
let wrapperDiv=document.createElement('div');wrapperDiv.setAttribute('class','ad-wrapper-div');wrapperDiv.style.textAlign='center';let adTitle=document.createElement('p');adTitle.innerText='Advertisment';wrapperDiv.appendChild(adTitle);let divId='ad_paragraph_'+currentId;let div=document.createElement('div');if(window.location.search.indexOf('mythdebug')!==-1)console.log('creating div with id: ',divId);div.setAttribute('id',divId);wrapperDiv.setAttribute('auto-height','true');wrapperDiv.style.textAlign='center';if(!GPTLoader.disableCssSizing)wrapperDiv.style.height='280px';div.innerHTML='';wrapperDiv.appendChild(div);let isActive=GPTLoader.contentSlots[currentId-1]?.[device]||!0;if(isActive){paragraph.insertAdjacentElement('afterend',wrapperDiv)}
currentId++;let observer=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){let adDiv=entry.target;this.executeDisplaySlot(adDiv.id);observer.unobserve(adDiv)}})},{threshold:0.1})}
let contentImageAds=GPTLoader.imageAds.filter(e=>e.type==2);if(contentImageAds.length>0){let contentElementOptions=['.entry-content','.content-container'];let contentElements=[];for(let el of contentElementOptions){let contentElement=document.querySelectorAll(el)
if(contentElement.length>0){contentElements=contentElements.concat(Array.from(contentElement))}}
if(contentElements&&contentElements.length>0){let images=[]
for(let contentElement of contentElements){images=images.concat(Array.from(contentElement.querySelectorAll('img')))}
let i=0;for(let image of images){if(i>=contentImageAds.length)break;let imageAd=contentImageAds[i];let id=`auto-image-${i++}`;if(image.id){id=image.id}else{image.id=id}
if(this.isLargeFigureImage(image)){let div=this.createOverlayDiv(`#${id}`);imageAd.div=div;imageAd.target=`#${image.id}`;imageAd.type=1;this.insertInImageAd(image,div.id)}}}}
for(let slot of GPTLoader.imageAds){if(slot.div)continue;slot.div=this.createOverlayDiv(slot.target)}}
isLargeFigureImage(image){const parent=image.parentNode;return(parent&&parent.tagName==='FIGURE'&&parent.classList.contains('size-large'))}
insertInImageAd(img,adId){const wrapper=document.createElement('div');wrapper.style.position='relative';wrapper.style.display='inline-block';const adDiv=document.createElement('div');adDiv.id=adId;adDiv.style.position='relative';adDiv.style.bottom='4px';adDiv.style.left='4px';adDiv.style.zIndex='10';adDiv.style.background='rgba(255,255,255,0.8)';img.parentNode.insertBefore(wrapper,img);wrapper.appendChild(img);wrapper.appendChild(adDiv)}
isDescendantOf(element,parentTagName){while(element!==null&&element.tagName.toLowerCase()!=='body'){if(element.tagName.toLowerCase()===parentTagName){return!0}
element=element.parentNode}
return!1}
isDescendantOfId(element,parentId){while(element!==null&&element.tagName.toLowerCase()!=='body'){if(element.id===parentId){return!0}
element=element.parentNode}
return!1}
isDescendantWithClass(element,className){while(element!==null&&element.tagName.toLowerCase()!=='body'){if(element.classList){for(let i=0;i<element.classList.length;i++){if(element.classList[i].split(' ').includes(className)){return!0}}}
element=element.parentNode}
return!1}
addCustomStyling(){const style=document.createElement('style');style.innerHTML=`
                .ad-wrapper-div {
                    background-color: #FAF9F9 !important;
                    border: 2px solid #F5F5F5 !important;
                    box-sizing: content-box;
                    float: none !important;
                    line-height: 0px;
                    margin: 10px auto !important;
                    max-width: 100% !important;
                    min-height: 250px;
                    padding: 10px 0 !important;
                    text-align: center !important;
                }

                .ad-wrapper-div p {
                    font-size: 12px;
                    padding-bottom: 2px;
                    display: block;
                    text-align: center;
                    line-height: 15px;
                }

                @media only screen and (min-width: 1024px) {
                    .ad-wrapper-div {
                        min-width: 728px;
                        min-height: 280px;
                    }
                }

                @media only screen and (min-width: 768px) and (max-width: 1023px) {
                    .ad-wrapper-div {
                        min-width: 468px;
                        min-height: 250px;
                    }
                }

                @media only screen and (max-width: 767px) {
                    .ad-wrapper-div {
                        min-width: 100%;
                        min-height: 90px;
                        padding-top: 5px !important;
                        padding-bottom: 5px !important;
                    }

                    .ad-wrapper-div p {
                        font-size: 10px;
                        line-height: 13px;
                    }
                }
            `;document.head.appendChild(style)}
async start(){try{await this.init()}catch(error){if(window.location.search.indexOf('mythdebug')!==-1)console.error('[GPTLoader] Failed to load GPT script:',error);}}}
window.gptLoader=new GPTLoader();window.gptLoader.addCustomStyling();document.addEventListener("DOMContentLoaded",function async(){window.gptLoader.autoDiv();window.gptLoader.loadLatestNewsDiv();setTimeout(function(){window.gptLoader.start()},GPTLoader.startTimeout)})})()
