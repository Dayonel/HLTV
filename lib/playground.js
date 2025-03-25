"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var log = function (promise) {
    return promise
        .then(function (res) { return console.dir(res, { depth: null }); })
        .catch(function (err) { return console.log(err); });
};
// HLTV.getMatch({ id: 2356133 }).then(res => {
//   console.log(res.streams);
// });.
// log(new Hltv({requestMethod: 'playwright'}).getMatches())
log(index_1.HLTV.getMatches());
// log(HLTV.getEvent({ id: 5741 }))
// log(HLTV.getEvents())
// log(HLTV.getMatchMapStats({ id: 115827 }))
// log(HLTV.getMatchStats({ id: 79924 }))
// log(HLTV.getMatchesStats()
// log(HLTV.getPlayer({ id: 7998 }))
// log(HLTV.getPlayerRanking())
// log(HLTV.getPlayerStats({ id: 1122 }))
// log(HLTV.getRecentThreads())
// log(HLTV.getStreams())
// log(HLTV.getTeam({ id: 7020 }))
// log(HLTV.getTeamStats({ id: 10566 }))
// log(HLTV.getPastEvents({ startDate: '2019-3-1', endDate: '2019-3-29' }))
// log(HLTV.getTeamRanking())
// log(HLTV.getResults({ eventIds: [1617] }))
// const todayDate = "2022-04-25";
// log(HLTV.getResults({startDate: todayDate, endDate: todayDate}))
// log(HLTV.getNews())
var isEmptyObject = function (e) {
    for (var t in e)
        if (e.hasOwnProperty(t))
            return false;
    return true;
};
// HLTV.connectToMatchesScorebot({
//   ids: [2360972],
//   onConnect: (done) => {},
//   onUpdate: (data) => {
//     if (data.mapScores && !isEmptyObject(data.mapScores)) {
//       let score: {
//         [teamId: string]: {
//           maps?: number,
//           current?: number,
//         }
//       } = {}
//       const currentMap = data.mapScores[Object.keys(data.mapScores).sort().reverse()[0]].scores;
//       Object.keys(currentMap).map(teamId => {
//         score[teamId] = {
//           maps: data.wins?.[teamId],
//           current: currentMap[teamId],
//         }
//       });
//       console.log(data.listId, score);
//     } else {
//       console.log(data.listId, "- -- -");
//     }
//   }
// }).then(({sendReadyIds}) => {
//   setTimeout(() => {
//     sendReadyIds([2360972, 2360975]);
//   }, 10*60*1000);
// });
