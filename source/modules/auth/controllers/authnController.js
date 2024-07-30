const User = require('../models/userModel');
const Plan = require('../models/planModel');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const workspaceInterface = require('../interfaces/auth-workspace')
const { validateEmail, generateUID } = require('../../../common/helpers/helper');

const registerUser = async (req, res) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const { email, firstName, lastName, address } = req.body;

        if (!email || !firstName || !lastName) {
            return res.error('Missing required fields', 400);
        }

        if (validateEmail(email) === false) {
            return res.error('Invalid email format', 400);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.error('Email already exists', 400, 'Duplicate Email');
        }

        const UIDx = generateUID();

        let newUser = new User({
            UID: UIDx,
            email,
            hash: hashedPassword,
            firstName,
            lastName,
            address,
        });

        newUser = await newUser.save();

        if (newUser instanceof Error) {
            res.error('Error al crear nuevo usuario');
        }

        // Si se pasan las validaciones, se crea un workspace
        const userId = newUser._id;

        const { _id: planId } = await Plan.findOne({ name: 'basic' }, '_id');
        const workspaceData = {
            name: `${email}-default-workspace`,
            planId: planId,
            settings: {},
        }

        const createWorkspaceResult = await workspaceInterface.createWorkspace(userId, workspaceData);

        // Si da error, se rollbackea el usuario
        if (!createWorkspaceResult) {
            await User.findByIdAndDelete(newUser._id);
            return res.error('Error al crear un workspace para el nuevo usuario', createWorkspaceResult.status);
            // Si da error al crear el workspace, se elimina el nuevo usuario
        }

        // Se inserta el workspace creado en el usuario
        newUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    workspaces: [{
                        workspaceId: createWorkspaceResult._id,
                        defaultWorkspace: true,
                    }]
                }
            }, // Añade el nuevo valor aquí
            { new: true, useFindAndModify: false } // Opciones para devolver el documento actualizado
        ).select('-_id email lastName firstName UID');


        return res.success('User created successfully', newUser);
    } catch (error) {
        if (error.code === 11000) {
            console.log(error);
            return res.error('Email already exists', 400, 'Duplicate Email');
        }
        console.error(error);
        await User.findByIdAndDelete(newUser._id);
        return res.error(error.message, 500, 'Error creating user');
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId, firstName, lastName, address } = req.body;

        if (!userId) {
            return res.error('userId is required', 400);
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.error('Invalid userId', 400);
        }

        if (!firstName && !lastName && !address) {
            return res.error('At least one field (firstName, lastName, address) is required to update', 400);
        }

        const updateData = {};
        if (firstName) updateData.firstName = firstName;
        if (lastName) updateData.lastName = lastName;
        if (address) updateData.address = address;

        // Find the user before the update
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.error('userId does not exists', 400);
        }

        // Check if the update resulted in changes
        const hasChanges = Object.keys(updateData).some(key => {
            if (typeof updateData[key] === 'object' && updateData[key] !== null) {
                return JSON.stringify(existingUser[key]) !== JSON.stringify(updateData[key]);
            }
            return existingUser[key] !== updateData[key];
        });

        if (!hasChanges) {
            return res.error('No changes detected', 400);
        }

        // Update the user
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        return res.success('User updated successfully', updatedUser.toJSON());
    } catch (error) {
        console.error(error);
        return res.error(error.message, 500);
    }
};


//TODO: el update password no debería enviar el userId sino que directamente se debería sacar del token
const updatePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;

        if (!userId || !currentPassword || !newPassword) {
            return res.error('Missing required fields', 400);
        }

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.error('Invalid user ID', 400);
        }

        // Validate the current password
        const isMatch = await bcrypt.compare(currentPassword, user.hash);
        if (!isMatch) {
            return res.error('Current password is incorrect', 400);
        }

        // Validate that the new password is different from the current password
        const isNewPasswordSame = await bcrypt.compare(newPassword, user.hash);
        if (isNewPasswordSame) {
            return res.error('New password must be different from the current password', 400);
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password
        const updateData = {
            hash: hashedPassword,
            modifiedAt: Date.now()
        };

        const result = await User.updateOne({ _id: userId }, { $set: updateData });

        if (result.nModified === 0) {
            return res.error('No changes detected or update failed', 400);
        }

        return res.success('Password updated successfully');
    } catch (error) {
        console.error(error);
        return res.error(error.message, 500);
    }
};

const updatePlan = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        if (!userId || !planId) {
            return res.error('Missing required fields', 400);
        }

        // Check if the planId is valid
        if (!mongoose.Types.ObjectId.isValid(planId)) {
            return res.error('Invalid plan ID', 400);
        }

        // Check if the plan exists
        const plan = await Plan.findById(planId);
        if (!plan) {
            return res.error('Plan not found', 404);
        }

        // Update the user's plan
        const updateData = {
            plan: planId,
            modifiedAt: Date.now()
        };

        const result = await User.updateOne({ _id: userId }, { $set: updateData });

        if (result.nModified === 0) {
            return res.error('No changes detected or update failed', 400);
        }

        return res.success('Plan updated successfully');
    } catch (error) {
        console.error(error);
        return res.error(error.message, 500);
    }
};


module.exports = {
    registerUser,
    updateUser,
    updatePassword,
    updatePlan
};