"use client"

export function FetchStravaDataButton() {
  const fetchStravaData = async () => {
    fetch("/api/strava").then((res) => {
      console.log(res)
    }).catch((err) => {
      console.error(err)
    })
  }

  return (
    <button onClick={fetchStravaData}>Fetch Strava Data</button>
  )
}
