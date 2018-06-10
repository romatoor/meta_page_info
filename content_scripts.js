//фоновый скрит загружается на каждой странице
// благодаря этому получаем доступ к DOM

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {

    sendResponse( document.head.outerHTML );
});