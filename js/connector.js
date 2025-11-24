window.addEventListener("message", async (event) => {
  if (event.source !== window) return;

  if (event.data?.ext === "Geargeargear") {
    if((event.data?.key || '').startsWith('https://univer.1b.app')){
      const {data: icu} = event.data
      
      const getUnique = (list) => list.reduce((res, record) => (!res.some(({isin}) => isin === record.isin) && res.push(record), res), [])
      try{
        icu.forEach(bond => Object.assign(bond, {
          shop: 'ICU'
        }))
        const response = await fetch("https://www.inzhur.reit/assets");
        const bondsJson = await response.json()
        let bondsList = bondsJson.filter(bond => bond.type === 'bond').map(bond => {
          const { isin, maturityDate: date, prices: {buy: price}, paymentSchedule } = bond.assetDetails
          return {
            shop: '•|n)|(ur',
            isin,
            date,
            price,
            ytm: paymentSchedule[0].amount / 100
          }
        })
        // ------------------------

        const bodyStrRows = [...document.querySelectorAll('.os-table tr')].slice(1)
        bondsList.push(...bodyStrRows.map(row => {
          const td = row.children
          const [isin, date, price, percent] = [td[2].textContent, td[3].textContent, td[5].textContent.replace(/\s/g, '') , td[4].textContent]
          return {
            shop: 'yn1ver',
            isin,
            date,
            price: parseFloat(price),
            ytm: percent + '%'
          }
        }), ...icu)
        bondsList = bondsList.filter(({date}) => Date.now() + 12 * 30 * 24 * 60 * 60 * 1000 < new Date(date).getTime())
        bondsList.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.clear()
        // console.table(getUnique(bondsList))
        console.table(bondsList)
        console.log('----------------------------');
        console.log('----------------------------');
        let prises = getUnique([...bondsList])
        prises.sort((a,b) => a.price - b.price)
        prises.splice(7)
        prises.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        console.table(prises)
      } catch(e) {
        console.log('No Bonds')
        console.log(e)
      }
    }
  }
});
