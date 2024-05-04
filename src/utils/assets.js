export const countCoinBalance = (transaction, currentPrice) => {
    let totalCoin = 0;
    let totalBalance = 0;

    transaction.forEach(item => {
        totalCoin = totalCoin + parseFloat(item.coin);
        totalBalance = totalBalance + (parseFloat(currentPrice).toFixed(2) * parseFloat(item.usd).toFixed(2))
    });

    return {
        totalCoin: totalCoin,
        totalBalance: totalBalance,
    }
};

export const countTotalBalance = (assetList, marketList) => {
    let totalBalancePrev = 0;
    let totalBalanceNow = 0;
    let totalPercentage = 0;

    assetList.forEach(item => {
        const market = marketList.find(val => val.id === item.id);
        const countDiff = countPercentage(item.transaction, market?.current_price);
        totalBalanceNow = totalBalanceNow + countDiff.totalNow;
        totalBalancePrev = totalBalanceNow + countDiff.totalPrev;
        totalPercentage = totalPercentage + countDiff.percentage;
    });

    return {
        balanceNow: parseFloat(totalBalanceNow).toFixed(2),
        percentage: parseFloat(totalPercentage).toFixed(2),
    }
}

export const countPercentage = (transaction = [], currentPrice = 0) => {
    let totalBalancePrev = 0;
    let totalBalanceNow = 0;

    transaction?.forEach(item => {
        totalBalancePrev = totalBalancePrev + (parseFloat(item.usd) * parseFloat(item.price));
        totalBalanceNow = totalBalanceNow + (parseFloat(item.usd) * parseFloat(currentPrice));
    });

    percentageDiff = parseFloat((totalBalanceNow - totalBalancePrev) / totalBalanceNow * 100).toFixed(2);

    return {
        totalPrev: parseFloat(totalBalancePrev),
        totalNow: parseFloat(totalBalanceNow),
        percentage: parseFloat(percentageDiff),
    };
};