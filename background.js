console.log('in the background.js')
// chrome.storage.local.get(['Code'], (e) => console.log(e.Code[0]))
// TypeError: Cannot read property '0' of undefined
// 初回install時、storage.localは消える<=削除、...
// 再読込されました。 reason = 'update'

// chrome.action.onInstalled.addListener(r => foo)
// ファイルorURLよりjson読込、storage.localへ
// default_popupとコンフリクト
// chrome.runtime.onClicked.addListener(tab =>bar)
// スクリプト起動
chrome.runtime.onInstalled.addListener(reason => {
  console.log('onInstalled reason =', reason.reason)
  let code
  fetch('https://www.eonet.ne.jp/~stocks/code.json') // (1) リクエスト送信
  // fetch('asset/code.json') // (1) リクエスト送信
    .then(response => response.text()) // (2) レスポンスデータを取得
    .then(data => { // (3)レスポンスデータを処理
      // console.log(data)
      code = JSON.parse(data);
      console.log(code[0]?.name ?? 'code is undefined')
    })
    .then((res) => {
      chrome.storage.local.set({ 'Code': code }, 
        function(){ console.log('saved to storage.local') 
        }
      )
    })
    .catch((reason) => {
      console.log('fetch failure, code.json retrieving')
    });
  // chrome.storage.local.get(['Code'], (e) => console.log(e.Code[0]))
  // 同期実行したいのだけど？local.setを同期実行したい。方法は？



  if (reason.reason == chrome.runtime.OnInstalledReason.INSTALL) {
    console.log('onInstalled')
    chrome.storage.local.get(['Code'], (e) => console.log(e?.Code[0]))
  }
});
