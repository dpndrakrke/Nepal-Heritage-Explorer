# Nepal Heritage Explorer - Essential Test Suite (10 Tests)

## 🧪 Overview

This essential test suite validates the core functionality of the Nepal Heritage Explorer application with 10 critical tests covering authentication, heritage site management, user features, admin features, and performance.

## 📋 10 Essential Tests

### 1. Server Health Check
- Validates server is running and healthy
- Tests basic connectivity

### 2. User Registration
- Tests user registration functionality
- Validates user data creation

### 3. Admin Registration
- Tests admin user registration
- Validates admin role assignment

### 4. User Login
- Tests user authentication
- Validates token generation

### 5. Heritage Sites Retrieval
- Tests public heritage site access
- Validates data structure

### 6. Heritage Categories
- Tests category retrieval
- Validates category data

### 7. User Profile
- Tests profile retrieval with token
- Validates authentication

### 8. Admin Dashboard
- Tests admin dashboard access
- Validates admin privileges

### 9. Error Handling
- Tests invalid login handling
- Validates error responses

### 10. Performance Test
- Tests response time
- Validates performance metrics

## 🚀 How to Run

### Prerequisites
1. Make sure your backend server is running on `http://localhost:5000`
2. Make sure your database is connected and running
3. Install test dependencies

### Installation
```bash
# Install test dependencies
npm install axios chai mocha

# Or copy the package.json and run:
npm install
```

### Running Tests

#### Run All 10 Tests
```bash
npm test
```

#### Run Quick Tests (Tests 1-5)
```bash
npm run test:quick
```

#### Run Authentication Tests (Tests 2-4)
```bash
npm run test:auth
```

#### Run Heritage Tests (Tests 5-6)
```bash
npm run test:heritage
```

#### Run Admin Test (Test 8)
```bash
npm run test:admin
```

#### Run Performance Test (Test 10)
```bash
npm run test:performance
```

#### Run with Mocha directly
```bash
# Run all tests
mocha supertest.js --timeout 30000

# Run with verbose output
mocha supertest.js --timeout 30000 --reporter spec

# Run specific test
mocha supertest.js --grep "Test 1" --timeout 30000
```

## 📊 Expected Output

When tests run successfully, you should see:

```
🚀 Starting Nepal Heritage Explorer Essential Test Suite
============================================================
✅ Test 1: Server is running and healthy
✅ Test 2: User registration successful
✅ Test 3: Admin registration successful
✅ Test 4: User login successful
✅ Test 5: Heritage sites retrieval successful
✅ Test 6: Categories retrieval successful
✅ Test 7: Profile retrieval successful
✅ Test 8: Admin dashboard stats retrieval successful
✅ Test 9: Invalid login error handling successful
✅ Test 10: Response time: 150ms
============================================================
🎉 Nepal Heritage Explorer Essential Test Suite Completed!
============================================================
📊 Test Summary:
✅ Test 1: Server Health Check
✅ Test 2: User Registration
✅ Test 3: Admin Registration
✅ Test 4: User Login
✅ Test 5: Heritage Sites Retrieval
✅ Test 6: Heritage Categories
✅ Test 7: User Profile
✅ Test 8: Admin Dashboard
✅ Test 9: Error Handling
✅ Test 10: Performance Test
============================================================
🚀 All 10 essential tests completed!
```

## 🔧 Configuration

### Test Data
The test suite uses predefined test data:
- **Test User**: test@example.com / password123
- **Test Admin**: admin@example.com / admin123

### Environment Variables
Make sure your backend server is running on the default port (5000). If using a different port, update the `BASE_URL` in `supertest.js`.

## 🐛 Troubleshooting

### Common Issues

1. **Server not running**
   ```
   ❌ Test 1: Server is not running. Please start the server first.
   ```
   Solution: Start your backend server with `npm start`

2. **Database connection issues**
   ```
   Error: connect ECONNREFUSED
   ```
   Solution: Check your database connection and ensure MySQL is running

3. **Authentication failures**
   ```
   Error: 401 Unauthorized
   ```
   Solution: Check JWT secret configuration in backend

4. **Admin role issues**
   ```
   ❌ Test 8: Admin dashboard failed - role issue
   ```
   Solution: This is expected if admin role is not properly set in database

### Debug Mode
Run tests with verbose output:
```bash
mocha supertest.js --timeout 30000 --reporter spec --verbose
```

## 📈 Performance Benchmarks

The test suite includes performance validation:
- **Response Time**: Should be under 2000ms
- **Error Handling**: Validates proper error responses
- **Authentication**: Tests token-based security

## 🎯 Test Coverage

This essential test suite covers:
- ✅ Server health and connectivity
- ✅ User authentication (registration/login)
- ✅ Admin authentication and privileges
- ✅ Heritage site data retrieval
- ✅ User profile management
- ✅ Error handling and validation
- ✅ Performance metrics

## 📝 Notes

- Tests are numbered 1-10 for easy identification
- Each test is independent and can run individually
- Tests include proper error handling and validation
- Admin role issues are documented as expected behavior
- Performance test validates response time under 2 seconds

---

**Total Test Cases: 10**
**Estimated Runtime: 30-60 seconds**
**Coverage: Core application functionality** 