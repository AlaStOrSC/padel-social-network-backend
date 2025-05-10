const express = require('express');
const router = express.Router();
const {
    register,
    login,
    getUsers,
    getUserProfile,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getPendingRequests,
    logout,
    getPendingRequestsCount,
  } = require('../controllers/userController');
  const authMiddleware = require('../middlewares/authMiddleware');

router.post('/register', register);

router.post('/login', login);
router.post('/logout', authMiddleware(), logout);

router.get('/', authMiddleware(), getUsers);

router.get('/profile', authMiddleware(), getUserProfile);

router.post('/friends/request/:recipientId', authMiddleware(), sendFriendRequest); 
router.put('/friends/accept/:requesterId', authMiddleware(), acceptFriendRequest); 
router.put('/friends/reject/:requesterId', authMiddleware(), rejectFriendRequest); 
router.delete('/friends/:friendId', authMiddleware(), removeFriend); 
router.get('/friends', authMiddleware(), getFriends); 
router.get('/friends/requests', authMiddleware(), getPendingRequests);
router.get('/friends/requests/count', authMiddleware(), getPendingRequestsCount);
// comprobar esta ruta bien

module.exports = router;