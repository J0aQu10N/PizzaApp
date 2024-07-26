const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

const auth = admin.auth();
const db = admin.firestore();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.createUser({
      email: email,
      password: password
    });

    await db.collection('config').doc(userRecord.uid).set({
      email: email
    });

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: userRecord.uid });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;