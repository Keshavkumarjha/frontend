import axiosClient from './axiosClient'

// ── Employees ────────────────────────────────
export const employeeApi = {
  list:   (params) => axiosClient.get('/v1/employees/', { params }),
  get:    (id)     => axiosClient.get(`/v1/employees/${id}/`),
  create: (data)   => axiosClient.post('/v1/employees/', data),
  update: (id, d)  => axiosClient.patch(`/v1/employees/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/employees/${id}/`),
}

// ── Departments ───────────────────────────────
export const departmentApi = {
  list:   (params) => axiosClient.get('/v1/departments/', { params }),
  get:    (id)     => axiosClient.get(`/v1/departments/${id}/`),
  create: (data)   => axiosClient.post('/v1/departments/', data),
  update: (id, d)  => axiosClient.patch(`/v1/departments/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/departments/${id}/`),
}

// ── Roles ──────────────────────────────────────
export const roleApi = {
  list:   (params) => axiosClient.get('/v1/roles/', { params }),
  create: (data)   => axiosClient.post('/v1/roles/', data),
  update: (id, d)  => axiosClient.patch(`/v1/roles/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/roles/${id}/`),
}

// ── Attendance ────────────────────────────────
export const attendanceApi = {
  list:   (params) => axiosClient.get('/v1/attendance/', { params }),
  get:    (id)     => axiosClient.get(`/v1/attendance/${id}/`),
  create: (data)   => axiosClient.post('/v1/attendance/', data),
  update: (id, d)  => axiosClient.patch(`/v1/attendance/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/attendance/${id}/`),
}

// ── Leave Requests ────────────────────────────
export const leaveApi = {
  list:    (params) => axiosClient.get('/v1/leaves/', { params }),
  get:     (id)     => axiosClient.get(`/v1/leaves/${id}/`),
  create:  (data)   => axiosClient.post('/v1/leaves/', data),
  update:  (id, d)  => axiosClient.patch(`/v1/leaves/${id}/`, d),
  remove:  (id)     => axiosClient.delete(`/v1/leaves/${id}/`),
  // Dedicated approve action (triggers notification + audit log via LeaveApprovalService)
  approve: (id)     => axiosClient.post(`/v1/leaves/${id}/approve/`),
  // Reject uses PATCH since no dedicated reject action exists in backend
  reject:  (id)     => axiosClient.patch(`/v1/leaves/${id}/`, { status: 'rejected' }),
}

// ── Payslips ──────────────────────────────────
export const payrollApi = {
  list:   (params) => axiosClient.get('/v1/payslips/', { params }),
  get:    (id)     => axiosClient.get(`/v1/payslips/${id}/`),
  create: (data)   => axiosClient.post('/v1/payslips/', data),
  update: (id, d)  => axiosClient.patch(`/v1/payslips/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/payslips/${id}/`),
}

// ── Recruitment ───────────────────────────────
export const jobOpeningApi = {
  list:   (params) => axiosClient.get('/v1/job-openings/', { params }),
  create: (data)   => axiosClient.post('/v1/job-openings/', data),
  update: (id, d)  => axiosClient.patch(`/v1/job-openings/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/job-openings/${id}/`),
}
export const candidateApi = {
  list:   (params) => axiosClient.get('/v1/candidates/', { params }),
  create: (data)   => axiosClient.post('/v1/candidates/', data),
  update: (id, d)  => axiosClient.patch(`/v1/candidates/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/candidates/${id}/`),
}
export const applicationApi = {
  list:   (params) => axiosClient.get('/v1/applications/', { params }),
  create: (data)   => axiosClient.post('/v1/applications/', data),
  update: (id, d)  => axiosClient.patch(`/v1/applications/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/applications/${id}/`),
}

// ── Performance ───────────────────────────────
export const performanceApi = {
  list:   (params) => axiosClient.get('/v1/reviews/', { params }),
  create: (data)   => axiosClient.post('/v1/reviews/', data),
  update: (id, d)  => axiosClient.patch(`/v1/reviews/${id}/`, d),
  remove: (id)     => axiosClient.delete(`/v1/reviews/${id}/`),
}

// ── Audit / Activity ──────────────────────────
export const activityApi = {
  list: (params) => axiosClient.get('/v1/activity-logs/', { params }),
}

// ── Notifications ─────────────────────────────
export const notificationApi = {
  list:   (params) => axiosClient.get('/v1/notifications/', { params }),
  markRead: (id)   => axiosClient.patch(`/v1/notifications/${id}/`, { is_read: true }),
}

// ── Users ─────────────────────────────────────
export const userApi = {
  list:   (params) => axiosClient.get('/users/', { params }),
  get:    (id)     => axiosClient.get(`/users/${id}/`),
  me:     ()       => axiosClient.get('/users/me/'),
  update: (id, d)  => axiosClient.patch(`/users/${id}/`, d),
}
