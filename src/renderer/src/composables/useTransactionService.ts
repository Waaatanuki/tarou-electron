import type { NetworkHTML, NetworkTransaction } from 'tarou'
import { load } from 'cheerio'

export function useTransactionService() {
  const userStore = useUserStore()

  function handleTransaction(transaction: NetworkTransaction) {
  }

  function handleHTML(html: NetworkHTML) {
    handleHTMLUserContents(html)
  }

  function handleHTMLUserContents(html: NetworkHTML) {
    if (html.url.includes('/#mypage')) {
      const $ = load(html.outerHTML)

      // 提取状态数据
      const gameStatus = {
        lupi: $('.prt-lupi').text().trim(),
        jp: $('.prt-jp').text().trim(),
        stone: $('.prt-stone').text().trim(),
        mbp: {
          current: $('.prt-mbp-box .txt-current-point').text().trim(),
          max: $('.prt-mbp-box .txt-max-point').text().trim(),
        },
        hmbp: {
          current: $('.prt-hmbp-box .txt-current-point').text().trim(),
          max: $('.prt-hmbp-box .txt-max-point').text().trim(),
        },
        artifact: $('.prt-artifact-dropcount-info-box .txt-possessed-data').text().trim(),
        arcarum: {
          passport: $('.prt-arcarum-passport-box').text().trim(),
          point: $('.prt-arcarum-point-box').text().trim(),
        },
        followPoint: $('.prt-follow-point-box span').text().trim(),
      }
      console.log('提取的游戏状态数据:', gameStatus)
    }
  }

  return {
    handleTransaction,
    handleHTML,
  }
}
