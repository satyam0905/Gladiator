using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthenticationController(IAuthService authService)
        {
            this.authService = authService;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            var (status, result) = await authService.Login(model);

            if (status == 0)
                return BadRequest(new { Message = result });

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register(User model)
        {
            var (status, result) = await authService.Registration(model, model.UserRole);

            if (status == 0)
                return BadRequest(new { Message = result });

            return Ok(new { Status = "Success", Message = result });
        }
    }
}
