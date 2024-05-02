import express from 'express';
import userData from '../data/User.js'; // 假设 userData 包含之前定义的方法
const router = express.Router();



// 显示用户资料
router.get('/:id/profile', async (req, res) => {
    try {
        const userId = req.params.id;
        const userProfile = await userData.getUserProfile(userId);
        res.render('profile', {
            _id: userId,
            username: userProfile.username,
            email: userProfile.email,
            image: userProfile.image || '/path/to/default-image.jpg',
            phoneNumber: userProfile.phoneNumber,
            friends: userProfile.friends
        });
    } catch (error) {
        res.status(404).send("User not found");
    }
});

// 更新用户资料
router.post('/:id/profile', upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const updateData = {
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    };

    if (req.file) {
        updateData.image = '/uploads/' + req.file.filename;  // 更新图片路径
    }

    try {
        await userData.updateUserProfile(userId, updateData);
        res.redirect(`/users/${userId}/profile`);
    } catch (error) {
        res.status(500).send("Failed to update profile");
    }
});



export default router;
