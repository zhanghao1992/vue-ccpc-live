import axios from 'axios'

export function getLatestRound (matchId) {
  return axios.get('/node/player/getLatestRound', {
    params: {
      matchId: matchId
    }
  })
}
