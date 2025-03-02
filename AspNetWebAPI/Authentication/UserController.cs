using AspNetCoreAPI.Authentication;
using AspNetCoreAPI.Authentication.dto;
using AspNetCoreAPI.Models;
using AspNetCoreAPI.Registration.dto;
using AutoMapper;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Text;

namespace AspNetCoreAPI.Registration
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly JwtHandler _jwtHandler;
        private readonly EmailService _emailService;
        IConfiguration _config;

        public UserController(UserManager<ApplicationUser> userManager, JwtHandler jwtHandler, IConfiguration config,EmailService emailService)
        {
            _userManager = userManager;
            _jwtHandler = jwtHandler;
            _emailService = emailService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] UserRegistrationDto userRegistrationDto)
        {
            if (userRegistrationDto == null || !ModelState.IsValid)
                return BadRequest();

             var user = new ApplicationUser { UserName = userRegistrationDto.Email,  Email = userRegistrationDto.Email };


            var result = await _userManager.CreateAsync(user, userRegistrationDto.Password);
            
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);

                return BadRequest(new UserRegistrationResponseDto { Errors = errors });
            }

            try
            {
                if(await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Account Created", message = "Your account has been created, please confirm your email" }));
                }
                return BadRequest("failed to send email. Please contact admin");
            }
            
            catch(Exception)
            {
                return BadRequest("failed to send email. Please contact admin");
            }

            
        }

        [HttpPut("confirmEmail")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDTO confirm)
        {
            var user = await _userManager.FindByEmailAsync(confirm.Email);
                if (user == null) return Unauthorized("This email adress has not been registered yet");

            if (user.EmailConfirmed == true) return BadRequest("your email was confirmed before. Please login to your account");

            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(confirm.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if(result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "email confirmed", message = "your email address is confirmed. You can login now" }));
                    
                }
                return BadRequest("Invalid token. Please try again");
            }
            catch (Exception)
            {
                return BadRequest("Invalid token. Please try again");
            }
        }
         
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userLoginDto)
        {
            var user = await _userManager.FindByNameAsync(userLoginDto.Email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, userLoginDto.Password))
                return Unauthorized(new UserLoginResponseDto { ErrorMessage = "Invalid Authentication" });
            
           
                var signingCredentials = _jwtHandler.GetSigningCredentials();
                var claims = _jwtHandler.GetClaims(user);
                var tokenOptions = _jwtHandler.GenerateTokenOptions(signingCredentials, claims);
                var token = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

                return Ok(new UserLoginResponseDto { IsAuthSuccessful = true, Token = token });
            

            //else return Unauthorized(new UserLoginResponseDto { ErrorMessage = "Invalid Authentication" });

        }
        [HttpPost("resendEmailConfirmationLink/{email}")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid email");
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null) return Unauthorized("this email address has not been registered yet");
            if (user.EmailConfirmed == true) return BadRequest("Your email address was confirmed before. Please login into your account");

            try
            {
                if(await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "Confirmation link sent", message = "please confirm your email address" }));
                }
                return BadRequest("Failed to send email. Please contact admin");
            }
            catch (Exception)
            {
                return BadRequest("Failed to send email. Please contact admin");
            }
        }
        private async Task<bool> SendConfirmEmailAsync(ApplicationUser user) 
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var url = $"{_config["JWTSettings:validAudience"]}/{_config["Email:ConfirmEmailPath"]}?token={token}&email={user.Email}";
            var body = $"<p>hello {user.UserName} </p>" + "<p>Please confirm your email addres by clicking in the following link.</p>"
                + $"<p><a href=\"{url}\">Click here</a></p>" +
                "<pThank you,</p>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "Confirm your email",body);
            return await _emailService.SendEmailAsync(emailSend);
        }
    }
}
