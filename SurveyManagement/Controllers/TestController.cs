using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SurveyManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurveyManagement.Controllers
{
    [Route("api/Test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly EmployeeSurveyDbContext _context;

        public TestController(EmployeeSurveyDbContext context)
        {
            _context = context;
        }

        // GET: api/Test
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Test>>> GetTests()
        {
            return await _context.Tests.ToListAsync();
        }

        // GET: api/Test/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Test>> GetTest(int id)
        {
            var test = await _context.Tests
                .Include(t => t.Questions)
                .FirstOrDefaultAsync(t => t.TestId == id);

            if (test == null)
            {
                return NotFound();
            }

            return test;
        }

        // POST: api/Test
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Test>> CreateTest(TestDto testDto)
        {
            try
            {
                var test = new Test
                {
                    Title = testDto.Title,
                    Description = testDto.Description,
                    TimeLimit = testDto.TimeLimit,
                    PassScore = testDto.PassScore
                };

                _context.Tests.Add(test);
                await _context.SaveChangesAsync();
                
                return CreatedAtAction(nameof(GetTest), new { id = test.TestId }, test);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating test: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi tạo test: " + ex.Message });
            }
        }

        // PUT: api/Test/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateTest(int id, TestDto testDto)
        {
            try
            {
                var test = await _context.Tests.FindAsync(id);
                if (test == null)
                {
                    return NotFound();
                }

                test.Title = testDto.Title;
                test.Description = testDto.Description;
                test.TimeLimit = testDto.TimeLimit;
                test.PassScore = testDto.PassScore;

                _context.Entry(test).State = EntityState.Modified;
                await _context.SaveChangesAsync();
                
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating test: {ex.Message}");
                return StatusCode(500, new { message = "Lỗi khi cập nhật test: " + ex.Message });
            }
        }

        // DELETE: api/Test/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTest(int id)
        {
            var test = await _context.Tests.FindAsync(id);
            if (test == null)
            {
                return NotFound();
            }

            // Kiểm tra xem có câu hỏi nào thuộc test này không
            var hasQuestions = await _context.Questions.AnyAsync(q => q.TestId == id);
            if (hasQuestions)
            {
                return BadRequest(new { message = "Không thể xóa test vì có câu hỏi thuộc test này. Vui lòng xóa tất cả câu hỏi trước." });
            }

            _context.Tests.Remove(test);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TestExists(int id)
        {
            return _context.Tests.Any(e => e.TestId == id);
        }
    }

    // DTO cho Test
    public class TestDto
    {
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int? TimeLimit { get; set; }
        public int? PassScore { get; set; }
    }
}
