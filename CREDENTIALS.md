# Test Credentials for RBAC Testing

Use these credentials to test different role-based access controls in the application:

## 🔐 Test Accounts

### Root Admin
- **Email:** `rootadmin@test.com`
- **Password:** `rootadmin123`
- **Access:** Full system access, tenant management, all administrative features

### Organization Admin
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Tenant:** `test-org`
- **Access:** User management, exam creation, all features within their organization

### Teacher
- **Email:** `teacher@test.com`
- **Password:** `teacher123`
- **Tenant:** `test-org`
- **Access:** Create and manage exams, add questions, evaluate student submissions

### Student
- **Email:** `student@test.com`
- **Password:** `student123`
- **Tenant:** `test-org`
- **Access:** Take exams, view results and feedback

---

## 📋 Role-Based Features

### Root Admin Can:
- ✅ Manage all tenants across the system
- ✅ View system-wide analytics
- ✅ Access all organizations

### Admin Can:
- ✅ Manage users in their organization
- ✅ Create and manage exams
- ✅ View all results and analytics
- ✅ Configure organization settings

### Teacher Can:
- ✅ Create and edit exams
- ✅ Add/edit/delete questions
- ✅ Evaluate student submissions
- ✅ Publish results
- ✅ View student performance

### Student Can:
- ✅ View available exams
- ✅ Start and complete exam attempts
- ✅ Submit answers
- ✅ View published results
- ✅ Read feedback and evaluations

---

## 🧪 Testing RBAC

1. **Login with each account** to verify role-based dashboard views
2. **Check navigation** - each role should see different menu items
3. **Test permissions** - try accessing restricted routes for each role
4. **Verify redirects** - roles should redirect to appropriate pages after login

---

## 📝 Notes

- All test accounts use the same tenant: `test-org`
- Passwords are simple for testing purposes only
- In production, enforce strong password policies
- These credentials should be seeded in your backend database for testing
