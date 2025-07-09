export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const data = req.body;
    console.log('Received address data:', data);
    // Here you could store the data in a database
    res.status(200).json({ message: 'Saved' });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ error: 'Server Error' });
  }
}
