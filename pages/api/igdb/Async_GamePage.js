export default async function handler(req, res) {
  const url = "https://api.igdb.com/v4/games";
  const options = {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
    },
    body: `fields name,summary,genres.name,cover.url,screenshots.url,videos.video_id,platforms.abbreviation,release_dates.date,rating,websites.*, involved_companies.company.name,involved_companies.developer,involved_companies.publisher; where slug = "${req.query.query}"; limit 1;`,
  };

  const response = await fetch(url, options);
  const data = await response.json();

  res.status(200).json(data);
}
