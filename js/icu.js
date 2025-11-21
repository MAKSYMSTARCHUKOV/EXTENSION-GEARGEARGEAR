(async () => {
  const ovdps = Array.from(document.querySelector('ovdp-table table tbody').children).reduce((res, cur) => {
    const obj = {}
    obj.isin = cur.children[1].children[0].children[0].textContent
    const date = cur.children[2].textContent.split('.')
    obj.date = `${date[2]}-${date[1]}-${date[0]}`
    obj.price = parseFloat(cur.children[5].textContent.replace(/грн.|\s/g, '').replace(',', '.'))
    obj.ytm = cur.children[3].textContent
    res.push(obj)
    return res
}, [])
// const sessionStore = sessionStorage.getItem("ngStorage-currentUser");
// const { token } = JSON.parse(sessionStore)
// const headers = {
//   'authorization': `Bearer ${token}`
// }
// const responsePromise = await Promise.allSettled(ovdps.reduce((res, ovdp) => {
//   res.push(new Promise(async (resolve, reject) => {
//     try {
//       const response = await fetch(`https://trade.online.icu/IcuTest/api/getSharesPayout?isin=${ovdp.isin}`, { headers });
//       const json = await response.json()
//       resolve(json)
//     } catch (error) {
//       reject(error)
//     }
//   }))
//   return res
// }, []))
// console.log(responsePromise);

return JSON.stringify(ovdps)

})()
