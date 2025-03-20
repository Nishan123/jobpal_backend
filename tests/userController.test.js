const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginUser, registerUser, updateUser, changePassword } = require('../controllers/userController');
const User = require('../model/User');

// Mock the User model
jest.mock('../model/User');

// Mock bcrypt
jest.mock('bcrypt');

describe('User Controller Tests', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            user: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('registerUser', () => {
        test('should successfully register a new user', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            };
            req.body = userData;

            User.findOne.mockResolvedValue(null);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            User.create.mockResolvedValue({ ...userData, password: 'hashedPassword' });

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' });
        });

        test('should fail if email already exists', async () => {
            req.body = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'existing@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({ email: 'existing@example.com' });

            await registerUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
        });
    });

    describe('loginUser', () => {
        test('should successfully login user', async () => {
            const userData = {
                email: 'john@example.com',
                password: 'password123'
            };
            req.body = userData;

            const mockUser = {
                id: 1,
                email: userData.email,
                first_name: 'John',
                last_name: 'Doe',
                password: 'hashedPassword'
            };

            User.findOne.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Login successful',
                token: expect.any(String)
            }));
        });

        test('should fail with invalid credentials', async () => {
            req.body = {
                email: 'wrong@example.com',
                password: 'wrongpass'
            };

            User.findOne.mockResolvedValue(null);

            await loginUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
        });
    });

    describe('updateUser', () => {
        test('should successfully update user profile', async () => {
            req.user = { id: 1 };
            req.body = {
                first_name: 'John Updated',
                last_name: 'Doe Updated'
            };

            const mockUser = {
                id: 1,
                email: 'john@example.com',
                update: jest.fn()
            };

            User.findByPk.mockResolvedValue(mockUser);

            await updateUser(req, res);

            expect(mockUser.update).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: 'Profile updated successfully'
            }));
        });
    });

    describe('changePassword', () => {
        test('should successfully change password', async () => {
            req.user = { id: 1 };
            req.body = {
                currentPassword: 'oldpass',
                newPassword: 'newpass'
            };

            const mockUser = {
                id: 1,
                password: 'hashedOldPass',
                update: jest.fn()
            };

            User.findByPk.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);
            bcrypt.hash.mockResolvedValue('hashedNewPass');

            await changePassword(req, res);

            expect(mockUser.update).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({
                message: 'Password updated successfully'
            });
        });
    });
});
