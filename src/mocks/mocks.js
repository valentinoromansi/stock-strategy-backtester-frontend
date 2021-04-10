import { BacktestResult } from "../models/backtest-result"
import { StrategyBacktestResults } from "../models/strategy-backtest-results"

export let strategyMock = {
  "name": "2 bar play",
  "enterRad": {
      "id": 1,
      "period": null,
      "type1": "CLOSE"
  },
  "stopLossRad": {
      "id": 0,
      "period": null,
      "type1": "OPEN",
      "type2": "CLOSE",
      "percent": 0.5
  },
  "riskToRewardList": [2, 3],
  "rules": [
      {
          "valueData1": {
              "id": 0,
              "period": null,
              "type1": "OPEN"
          },
          "position": "ABOVE",
          "valueData2": {
              "id": 0,
              "period": null,
              "type1": "CLOSE"
          }
      },
      {
          "valueData1": {
              "id": 1,
              "period": null,
              "type1": "OPEN"
          },
          "position": "BELOW",
          "valueData2": {
              "id": 0,
              "period": null,
              "type1": "HIGH"
          }
      },
      {
          "valueData1": {
              "id": 1,
              "period": null,
              "type1": "CLOSE"
          },
          "position": "BELOW",
          "valueData2": {
              "id": 0,
              "period": null,
              "type1": "HIGH"
          }
      },
      {
          "valueData1": {
              "id": 1,
              "period": null,
              "type1": "OPEN"
          },
          "position": "ABOVE",
          "valueData2": {
              "id": 0,
              "period": null,
              "type1": "OPEN",
              "type2": "CLOSE",
              "percent": 0.5
          }
      },
      {
          "valueData1": {
              "id": 1,
              "period": null,
              "type1": "CLOSE"
          },
          "position": "ABOVE",
          "valueData2": {
              "id": 0,
              "period": null,
              "type1": "OPEN",
              "type2": "CLOSE",
              "percent": 0.5
          }
      }
  ]
}

export let strategyBacktestResultsMock = new StrategyBacktestResults({
  strategyName: "2 bar play",
  backtestResults: [
    new BacktestResult({
      entryDatesOfProfitTrades: [
        "2020-06-29T08:30:00.000Z",
      ],
      timesProfited: 11,
      timesLost: 22,
      timesIndecisive: 33,
      winRate: 0.47282608695652173,
      plRatio: 0.8969072164948453,
      plFactor: 0.47282608695652173,
      stockName: "AAAA",
      interval: "15min",
      rewardToRisk: 2.34,
    }),
    new BacktestResult({
      entryDatesOfProfitTrades: [
        "2020-06-29T08:30:00.000Z",
      ],
      timesProfited: 11,
      timesLost: 22,
      timesIndecisive: 33,
      winRate: 0.47282608695652173,
      plRatio: 0.8969072164948453,
      plFactor: 0.47282608695652173,
      stockName: "ABCD",
      interval: "1h",
      rewardToRisk: 2
    }),
    new BacktestResult({
      entryDatesOfProfitTrades: [
        "2020-06-29T08:00:00.000Z",
        "2020-06-29T08:30:00.000Z",
      ],
      timesProfited: 87,
      timesLost: 97,
      timesIndecisive: 65,
      winRate: 0.47282608695652173,
      plRatio: 0.8969072164948453,
      plFactor: 0.47282608695652173,
      stockName: "AAON",
      interval: "15min",
      rewardToRisk: 1
    })
  ]
})
