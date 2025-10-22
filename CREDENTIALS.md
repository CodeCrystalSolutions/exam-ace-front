# Test Credentials for RBAC Testing

Use these credentials to test different role-based access controls in the application:

## 🔐 Test Accounts

### Root Admin (Platform Owner)
- **Email:** `rootadmin@test.com`
- **Password:** `password123`
- **Organization:** Acme Academy
- **Access:** Full system access, manages all tenants and all users across the entire platform

### Organization Admin - Acme Academy
- **Email:** `admin@acme.com`
- **Password:** `password123`
- **Organization:** Acme Academy
- **Access:** Manages teachers and students within Acme Academy only

### Teacher - Acme Academy
- **Email:** `teacher@acme.com`
- **Password:** `password123`
- **Organization:** Acme Academy
- **Access:** Create and manage exams, evaluate student submissions within Acme Academy

### Student - Acme Academy
- **Email:** `student@acme.com`
- **Password:** `password123`
- **Organization:** Acme Academy
- **Access:** Take exams and view results within Acme Academy

### Organization Admin - Tech University
- **Email:** `admin@tech.com`
- **Password:** `password123`
- **Organization:** Tech University
- **Access:** Manages teachers and students within Tech University only

### Teacher - Tech University
- **Email:** `teacher@tech.com`
- **Password:** `password123`
- **Organization:** Tech University
- **Access:** Create and manage exams, evaluate student submissions within Tech University

### Student - Tech University
- **Email:** `student@tech.com`
- **Password:** `password123`
- **Organization:** Tech University
- **Access:** Take exams and view results within Tech University

---

## 📋 Role-Based Features

### Root Admin Can:
- ✅ Manage all tenants (organizations/schools) across the system
- ✅ Create, edit, and delete tenants
- ✅ View all users across all tenants
- ✅ Create users with any role (including other root admins)
- ✅ Full access to all features across all organizations

### Admin Can:
- ✅ View and manage teachers and students in their organization only
- ✅ Create teachers and students within their organization
- ✅ Manage exams within their organization
- ✅ View results and analytics for their organization
- ❌ Cannot see or manage users from other organizations
- ❌ Cannot manage tenants
- ❌ Cannot create root admin users

### Teacher Can:
- ✅ Create and edit exams within their organization
- ✅ Add/edit/delete questions
- ✅ Evaluate student submissions
- ✅ Publish results
- ✅ View student performance
- ❌ Cannot manage users
- ❌ Cannot manage organization settings

### Student Can:
- ✅ View available exams in their organization
- ✅ Start and complete exam attempts
- ✅ Submit answers
- ✅ View published results
- ✅ Read feedback and evaluations
- ❌ Cannot create or manage exams
- ❌ Cannot view other students' results

---

## 🧪 Testing RBAC

1. **Root Admin Testing:** Login as `rootadmin@test.com` to see all tenants and users across all organizations
2. **Admin Testing:** Login as `admin@acme.com` or `admin@tech.com` to see only users in their respective organizations
3. **Teacher Testing:** Login as `teacher@acme.com` or `teacher@tech.com` to manage exams within their organization
4. **Student Testing:** Login as `student@acme.com` or `student@tech.com` to take exams within their organization
5. **Check navigation** - each role should see different menu items based on their permissions
6. **Test permissions** - try accessing restricted routes for each role (should redirect appropriately)

---

## 📝 Notes

- Two test organizations: **Acme Academy** and **Tech University**
- Each organization has isolated data - admins can only manage users in their own organization
- Root admin has access to everything across all organizations
- All passwords are `password123` for testing purposes only
- In production, enforce strong password policies and proper authentication
- These credentials are seeded in the mock API (`src/api/mockServer.ts`)
- When using real backend, ensure proper RLS policies enforce these access controls
