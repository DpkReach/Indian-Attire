export class EmployeeModel {
    // Get all employees
    static async getAll() {
      const query = `
        SELECT e.*, u.first_name, u.last_name, u.email, u.phone
        FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE e.is_active = true
        ORDER BY e.created_at DESC
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  
    // Get employee by ID
    static async getById(id: number) {
      const query = `
        SELECT e.*, u.first_name, u.last_name, u.email, u.phone
        FROM employees e
        JOIN users u ON e.user_id = u.id
        WHERE e.id = $1 AND e.is_active = true
      `;
      
      const result = await db.query(query, [id]);
      return result.rows[0];
    }
  
    // Clock in employee
    static async clockIn(employeeId: number) {
      const query = `
        INSERT INTO time_entries (employee_id, clock_in_time)
        VALUES ($1, CURRENT_TIMESTAMP)
        RETURNING *
      `;
      
      const result = await db.query(query, [employeeId]);
      return result.rows[0];
    }
  
    // Clock out employee
    static async clockOut(employeeId: number, notes?: string) {
      const query = `
        UPDATE time_entries 
        SET clock_out_time = CURRENT_TIMESTAMP,
            total_hours = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - clock_in_time)) / 3600,
            notes = $2
        WHERE employee_id = $1 AND clock_out_time IS NULL
        RETURNING *
      `;
      
      const result = await db.query(query, [employeeId, notes]);
      return result.rows[0];
    }
  
    // Get time entries for employee
    static async getTimeEntries(employeeId: number, startDate: Date, endDate: Date) {
      const query = `
        SELECT * FROM time_entries
        WHERE employee_id = $1 
        AND clock_in_time BETWEEN $2 AND $3
        ORDER BY clock_in_time DESC
      `;
      
      const result = await db.query(query, [employeeId, startDate, endDate]);
      return result.rows;
    }
  
    // Get current clocked in employees
    static async getCurrentlyWorking() {
      const query = `
        SELECT e.*, u.first_name, u.last_name, te.clock_in_time
        FROM employees e
        JOIN users u ON e.user_id = u.id
        JOIN time_entries te ON e.id = te.employee_id
        WHERE e.is_active = true 
        AND te.clock_out_time IS NULL
        ORDER BY te.clock_in_time ASC
      `;
      
      const result = await db.query(query);
      return result.rows;
    }
  }