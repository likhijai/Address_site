module.exports = (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const order = req.body;
    console.log('Received order:', order);
    // You could persist to a database here
    res.status(200).json({ message: 'Order logged' });
  } catch (err) {
    console.error('Error logging order:', err);
    res.status(500).json({ error: 'Server Error' });
  }
};

