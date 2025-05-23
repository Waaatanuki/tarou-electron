import type { NumberLimitPair } from 'dashboard'
import type { NetworkHTML, NetworkTransaction } from 'tarou'
import { load } from 'cheerio'

export function useNetworkService() {
  const userStore = useUserStore()

  function handleTransaction(transaction: NetworkTransaction) {
    handleTransactionUserContents(transaction)
  }

  function handleHTML(html: NetworkHTML) {
    handleHTMLUserContents(html)
  }

  function handleTransactionUserContents(transaction: NetworkTransaction) {
    if (transaction.url.includes('/user/content/index')) {
      const url = new URL(transaction.url)
      userStore.userStatus.uid = url.searchParams.get('uid')!
      const mbp_limit_info = transaction.responseBody.option.mbp_limit_info
      userStore.userStatus.mbp = {
        daily: {
          number: Number(mbp_limit_info[92001].limit_info[10100].data.daily.get_number),
          limit: Number(mbp_limit_info[92001].limit_info[10100].data.daily.get_limit),
        },
        weekly: {
          number: Number(mbp_limit_info[92001].limit_info[10100].data.weekly.get_number),
          limit: Number(mbp_limit_info[92001].limit_info[10100].data.weekly.get_limit),
        },
        bonus: {
          r: {
            number: Number(mbp_limit_info[92001].limit_info[20100].data.weekly.get_number),
            limit: Number(mbp_limit_info[92001].limit_info[20100].data.weekly.get_limit),
          },
          sr: {
            number: Number(mbp_limit_info[92001].limit_info[20200].data.weekly.get_number),
            limit: Number(mbp_limit_info[92001].limit_info[20200].data.weekly.get_limit),
          },
        },
        total: {
          number: Number(mbp_limit_info[92001].article.number),
          limit: Number(mbp_limit_info[92001].article.limit),
        },
      }

      userStore.userStatus.hmbp = {
        weekly: {
          number: Number(mbp_limit_info[92002].limit_info[10100].data.weekly.get_number),
          limit: Number(mbp_limit_info[92002].limit_info[10100].data.weekly.get_limit),
        },
        bonus: {
          crew: {
            number: Number(mbp_limit_info[92002].limit_info[20300].data.weekly.get_number),
            limit: Number(mbp_limit_info[92002].limit_info[20300].data.weekly.get_limit),
          },
        },
        total: {
          number: Number(mbp_limit_info[92002].article.number),
          limit: Number(mbp_limit_info[92002].article.limit),
        },
      }
    }
  }

  function handleHTMLUserContents(html: NetworkHTML) {
    if (html.url.includes('/#mypage')) {
      const $ = load(html.outerHTML)
      const $popArcarum = load($('#tpl-pop-arcarum-point-detail').text())
      const $popFollow = load($('#tpl-pop-follow-point-detail').text())

      userStore.userStatus.arcarum = {
        passport: parseNumberLimit($('.prt-arcarum-passport-box').text()),
        point: {
          weekly: parseNumberLimit($popArcarum('.txt-point-num').text()),
          total: parseNumberLimit($('.prt-arcarum-point-box').text()),
        },
      }

      userStore.userStatus.artifact = parseNumberLimit($('.prt-artifact-dropcount-info-box').text())

      userStore.userStatus.followPoint = {
        weekly: parseNumberLimit($popFollow('.txt-point-num').text()),
        total: parseNumberLimit($('.prt-follow-point-box').text()),
      }
    }
  }

  function parseNumberLimit(text: string): NumberLimitPair {
    const [number, limit] = text.split('/').map(Number)
    return { number: Number.isNaN(number) ? 0 : number, limit: Number.isNaN(limit) ? 0 : limit }
  }

  return {
    handleTransaction,
    handleHTML,
  }
}
