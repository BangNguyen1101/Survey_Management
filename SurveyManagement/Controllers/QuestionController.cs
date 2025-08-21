using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SurveyManagement.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SurveyManagement.Controllers
{
    [Route("api/Question")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly EmployeeSurveyDbContext _context;

        public QuestionController(EmployeeSurveyDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // GET: api/Question
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Question>>> GetQuestions()
        {
            return await _context.Questions
                .Include(q => q.Answers)
                .ToListAsync();
        }

        // GET: api/Question/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> GetQuestion(int id)
        {
            var question = await _context.Questions
                .Include(q => q.Answers)
                .FirstOrDefaultAsync(q => q.QuestionId == id);

            if (question == null)
            {
                return NotFound();
            }

            return question;
        }

        // POST: api/Question
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Question>> CreateQuestion(QuestionDto questionDto)
        {
            try
            {
                // Log dữ liệu nhận được
                Console.WriteLine($"Received data: {System.Text.Json.JsonSerializer.Serialize(questionDto)}");
                
                var question = new Question
                {
                    Content = questionDto.Content,
                    Type = questionDto.Type ?? string.Empty,
                    Skill = questionDto.Skill ?? string.Empty,
                    Difficulty = questionDto.Difficulty ?? string.Empty,
                    TestId = questionDto.TestId
                };

                _context.Questions.Add(question);
                await _context.SaveChangesAsync();

                // Thêm các đáp án nếu có
                if (questionDto.Answers != null && questionDto.Answers.Any())
                {
                    foreach (var answerDto in questionDto.Answers)
                    {
                        var answer = new Answer
                        {
                            QuestionId = question.QuestionId,
                            Content = answerDto.Content,
                            IsCorrect = answerDto.IsCorrect ?? false
                        };

                        _context.Answers.Add(answer);
                    }

                    await _context.SaveChangesAsync();
                }
                
                return CreatedAtAction(nameof(GetQuestion), new { id = question.QuestionId }, question);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating question: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Lỗi khi tạo câu hỏi: " + ex.Message });
            }
        }

        // PUT: api/Question/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateQuestion(int id, QuestionDto questionDto)
        {
            try
            {
                // Log dữ liệu nhận được
                Console.WriteLine($"Received update data: {System.Text.Json.JsonSerializer.Serialize(questionDto)}");
                
                var question = await _context.Questions.FindAsync(id);
                if (question == null)
                {
                    return NotFound();
                }

                question.Content = questionDto.Content;
                question.Type = questionDto.Type ?? string.Empty;
                question.Skill = questionDto.Skill ?? string.Empty;
                question.Difficulty = questionDto.Difficulty ?? string.Empty;
                question.TestId = questionDto.TestId;

                _context.Entry(question).State = EntityState.Modified;

                // Xóa các đáp án cũ
                var existingAnswers = await _context.Answers.Where(a => a.QuestionId == id).ToListAsync();
                _context.Answers.RemoveRange(existingAnswers);

                // Thêm các đáp án mới
                if (questionDto.Answers != null && questionDto.Answers.Any())
                {
                    foreach (var answerDto in questionDto.Answers)
                    {
                        var answer = new Answer
                        {
                            QuestionId = question.QuestionId,
                            Content = answerDto.Content,
                            IsCorrect = answerDto.IsCorrect ?? false
                        };

                        _context.Answers.Add(answer);
                    }
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!QuestionExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                
                return NoContent();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating question: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, new { message = "Lỗi khi cập nhật câu hỏi: " + ex.Message });
            }
        }

        // DELETE: api/Question/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
            {
                return NotFound();
            }

            // Xóa các đáp án liên quan
            var answers = await _context.Answers.Where(a => a.QuestionId == id).ToListAsync();
            _context.Answers.RemoveRange(answers);

            _context.Questions.Remove(question);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuestionExists(int id)
        {
            return _context.Questions.Any(e => e.QuestionId == id);
        }

        // POST: api/Question/import
        [HttpPost("import")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ImportQuestions(IFormFile file)
        {
            if (file == null || file.Length <= 0)
            {
                return BadRequest("Không có file được tải lên");
            }

            // Kiểm tra định dạng file
            var fileExtension = Path.GetExtension(file.FileName);
            if (fileExtension != ".xlsx" && fileExtension != ".xls")
            {
                return BadRequest("Chỉ hỗ trợ file Excel (.xlsx hoặc .xls)");
            }

            try
            {
                // Lưu file tạm thời
                var fileName = Guid.NewGuid().ToString() + fileExtension;
                var filePath = Path.Combine(_environment.ContentRootPath, "Uploads", fileName);

                // Đảm bảo thư mục Uploads tồn tại
                Directory.CreateDirectory(Path.Combine(_environment.ContentRootPath, "Uploads"));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // TODO: Đọc file Excel và import dữ liệu
                // Đây là phần giả lập, bạn cần thêm thư viện đọc Excel như EPPlus hoặc NPOI
                // và triển khai logic đọc file Excel thực tế

                // Xóa file tạm sau khi xử lý
                System.IO.File.Delete(filePath);

                return Ok(new { message = "Import thành công" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi import: " + ex.Message });
            }
        }
    }

    // DTO cho Question và Answer
    public class QuestionDto
    {
        public string Content { get; set; } = null!;
        public string? Type { get; set; }
        public string? Skill { get; set; }
        public string? Difficulty { get; set; }
        public int TestId { get; set; }
        public List<AnswerDto>? Answers { get; set; }
    }

    public class AnswerDto
    {
        public string Content { get; set; } = null!;
        public bool? IsCorrect { get; set; }
    }
}