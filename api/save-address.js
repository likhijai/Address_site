module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const data = req.body;
    console.log('Received address data:', data);
    // You could persist to a database here
    res.status(200).json({ message: 'Saved' });
  } catch (err) {
    console.error('Error saving address:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

