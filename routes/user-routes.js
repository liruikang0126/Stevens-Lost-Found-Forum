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
            friends: userProfile.friends,
            canEdit: req.session.userId === userId  // 向模板传递是否可以编辑的标志
        });
    } catch (error) {
        res.status(404).send("User not found");
    }
});


// 更新用户资料
router.post('/:id/profile', upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const loggedInUserId = req.session.userId;

    if (userId !== loggedInUserId) {
        return res.status(403).send('Access Denied: You can only update your own profile.');
    }

    const updateData = {
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
    };

    if (req.file) {
        updateData.image = '/uploads/' + req.file.filename; // 更新图片路径
    }

    try {
        await userData.updateUserProfile(userId, updateData);
        res.redirect(`/users/${userId}/profile`);
    } catch (error) {
        res.status(500).send("Failed to update profile");
    }
});



export default router;
