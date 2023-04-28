export default async function Async_Suggestions(req, res) {
  const url = "https://api.igdb.com/v4/games";
  const options = {
    method: "POST",
    headers: {
      "Client-ID": process.env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${process.env.IGDB_ACCESS_TOKEN}`,
    },
    body: `fields name, slug; search "${req.query.query}"; limit 10; where cover != null;`,
  };

  const response = await fetch(url, options);
  const data = await response.json();

  res.status(200).json(data);
}
