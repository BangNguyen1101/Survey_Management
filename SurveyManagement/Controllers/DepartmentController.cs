using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SurveyManagement.Models;

namespace SurveyManagement.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly EmployeeSurveyDbContext _context;

        public DepartmentController(EmployeeSurveyDbContext context)
        {
            _context = context;
        }

        // GET: api/Department
        [HttpGet]
        [AllowAnonymous] // Cho phép truy cập không cần auth để load dropdown
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            try
            {
                var departments = await _context.Departments
                    .OrderBy(d => d.DepartmentName)
                    .ToListAsync();
                
                return Ok(departments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải danh sách phòng ban: " + ex.Message });
            }
        }

        // GET: api/Department/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);

                if (department == null)
                {
                    return NotFound(new { message = "Không tìm thấy phòng ban" });
                }

                return Ok(department);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tải thông tin phòng ban: " + ex.Message });
            }
        }

        // POST: api/Department
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Department>> CreateDepartment([FromBody] Department department)
        {
            try
            {
                if (department == null)
                {
                    return BadRequest(new { message = "Dữ liệu phòng ban không được để trống" });
                }

                // Kiểm tra tên phòng ban đã tồn tại
                var existingDept = await _context.Departments
                    .FirstOrDefaultAsync(d => d.DepartmentName.ToLower() == department.DepartmentName.ToLower());
                
                if (existingDept != null)
                {
                    return BadRequest(new { message = "Tên phòng ban đã tồn tại" });
                }

                _context.Departments.Add(department);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetDepartment), new { id = department.DepartmentId }, department);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi tạo phòng ban: " + ex.Message });
            }
        }

        // PUT: api/Department/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {
            try
            {
                if (id != department.DepartmentId)
                {
                    return BadRequest(new { message = "ID không khớp" });
                }

                var existingDept = await _context.Departments.FindAsync(id);
                if (existingDept == null)
                {
                    return NotFound(new { message = "Không tìm thấy phòng ban" });
                }

                // Kiểm tra tên phòng ban đã tồn tại (trừ phòng ban hiện tại)
                var duplicateName = await _context.Departments
                    .FirstOrDefaultAsync(d => d.DepartmentId != id && 
                                           d.DepartmentName.ToLower() == department.DepartmentName.ToLower());
                
                if (duplicateName != null)
                {
                    return BadRequest(new { message = "Tên phòng ban đã tồn tại" });
                }

                existingDept.DepartmentName = department.DepartmentName;
                
                _context.Entry(existingDept).State = EntityState.Modified;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi cập nhật phòng ban: " + ex.Message });
            }
        }

        // DELETE: api/Department/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            try
            {
                var department = await _context.Departments.FindAsync(id);
                if (department == null)
                {
                    return NotFound(new { message = "Không tìm thấy phòng ban" });
                }

                // Kiểm tra xem có user nào đang sử dụng phòng ban này không
                var usersInDept = await _context.Users
                    .AnyAsync(u => u.DepartmentId == id);
                
                if (usersInDept)
                {
                    return BadRequest(new { message = "Không thể xóa phòng ban đang có nhân viên" });
                }

                _context.Departments.Remove(department);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Xóa phòng ban thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi xóa phòng ban: " + ex.Message });
            }
        }
    }
}

