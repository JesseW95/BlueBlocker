var whitelist = ['matthwatson', 'elirymagee', 'supermegashow']; //if sync.get fails, we use 50 as a default.
var blockNFT = true;
chrome.storage.local.get('whitelist', function(items) {
    whitelist = items?.whitelist;
    blockNFT = items?.blockNFT;
});

function BlockBlue(){
    let verifieds = document.querySelectorAll('svg[aria-label="Verified account"]');

    document.querySelectorAll('section')[0].addEventListener('DOMSubtreeModified', bbUpdate);

    verifieds.forEach(function(element) {
        let tweet = element.closest('article');

        if (tweet != null){
            let tweetAuthor = element.closest('a')?.getAttribute('href').replace('/', '').toLowerCase();
            if (!whitelist.includes(tweetAuthor) 
                && (!tweet.hasAttribute('blue-blocked') || tweet?.getAttribute('blue-blocked' === 'True'))) {
                tweet.setAttribute('blue-blocked', 'True');
                tweet.setAttribute('bbHandle', tweetAuthor);
                tweet.innerHTML = '<div style="padding:10px 5px 10px 5px;width:340px;"><span class="blueBlocked" style="color:rgb(231, 233, 234);">'
                                + '<div style="padding-right:5%;"><button class="showhide" data-o-content="'+ encodeURI(tweet.innerHTML) +'"">Show</button>'
                                + '<button class="blockub">Whitelist</button><span>@'+ tweetAuthor +'</span><div>'
                                + '<b>this tweet was hidden for being blue</b></span></div>';
            } else if (!tweet.hasAttribute('blue-blocked-wl')) {
                tweet.setAttribute('blue-blocked', 'False');
                tweet.setAttribute('blue-blocked-wl', '');
                tweet.setAttribute('bbHandle', tweetAuthor);
                tweet.children[0].children[0].children[0].children[0].innerHTML += '<span class="blueBlocked" style="color:rgb(231, 233, 234);padding-top:5px;">'
                                + '<div style="margin-left:65%;"><button class="showhide" data-o-content="'+ encodeURI(tweet.innerHTML) +'">Hide</button>'
                                + '<button class="blockub">Block</button><div></span>';
            }
        }
    });

    var bbSHButtons = document.querySelectorAll('button[class="showhide"]');
    bbSHButtons.forEach(function(element){
        let tweet = element.closest('article');
        if(tweet !== null) {
            element.addEventListener('click', function(){
                if (tweet.getAttribute('blue-blocked') === 'True') {
                    bbShow(element);
                } else {
                    bbHide(element);
                }
            });
        }
    });

    var bbUBButtons = document.querySelectorAll('button[class="blockub"]');
    bbUBButtons.forEach(function(element){
        let tweet = element.closest('article');
        if(tweet !== null) {
            element.addEventListener('click', function(){
                if (tweet.getAttribute('blue-blocked') === 'True') {
                    bbWhitelist(element);
                } else {
                    bbBlock(element);
                }
            });
        }
    });
}

function bbShow(element){
    let tweet = element.closest('article');
    if(tweet !== null) {
        tweet.innerHTML = decodeURI(element.getAttribute('data-o-content'));
        tweet.setAttribute('blue-blocked', 'False');
        tweet.setAttribute('blue-blocked-wl', '');
        tweet.children[0].children[0].children[0].children[0].innerHTML = '<span class="blueBlocked" style="color:rgb(231, 233, 234);padding-top:10px;">'
        + '<div style="margin-left:65%;"><button class="showhide" data-o-content="'+ encodeURI(tweet.innerHTML) +'">Hide</button>'
        + '<button class="blockub">Block</button><div></span>';
    }
}

function bbHide(element){
    let tweet = element.closest('article');
    if(tweet !== null) {
        tweet.setAttribute('blue-blocked', 'True');
        tweet.removeAttribute('blue-blocked-wl');
        let tweetAuthor = tweet.getAttribute('bbHandle');
        tweet.innerHTML = '<div style="padding:10px 5px 10px 5px;width:340px;"><span class="blueBlocked" style="color:rgb(231, 233, 234);">'
        + '<div style="padding-right:5%;"><button class="showhide" data-o-content="'+ encodeURI(tweet.innerHTML) +'"">Show</button>'
        + '<button class="blockub">Whitelist</button><span>@'+ tweetAuthor +'</span><div>'
        + '<b>this tweet was hidden for being blue</b></span></div>';
    }
}

function bbWhitelist(element){
    let tweet = element.closest('article');

    if (tweet !== null){
        tweet.innerHTML = decodeURI(element.getAttribute('data-o-content'));
        let tweetAuthor = tweet.getAttribute('bbHandle');
        whitelist.push(tweetAuthor);
        chrome.storage.local.set({ whitelist: whitelist });
        tweet.setAttribute('blue-blocked', 'False');
        tweet.setAttribute('blue-blocked-wl', '');
    }
}

function bbBlock(element){
    let tweet = element.closest('article');

    if (tweet !== null){
        let tweetAuthor = element.closest('a')?.getAttribute('href').replace('/', '').toLowerCase();
        whitelist = whitelist.filter(function(item) {
            return item !== tweetAuthor
        })
        chrome.storage.local.set({ whitelist: whitelist });
        bbHide(element);
    }
}

function bbUpdate(){
    document.querySelectorAll('section')[0].removeEventListener('DOMSubtreeModified', bbUpdate);
    setTimeout(function(){
        BlockBlue();
        document.querySelectorAll('section')[0].addEventListener('DOMSubtreeModified', bbUpdate);
    }, 25);
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

window.onload = function(){
    waitForElm('section').then((elm) => {
        console.log('Element is ready');
        BlockBlue();
    });
}