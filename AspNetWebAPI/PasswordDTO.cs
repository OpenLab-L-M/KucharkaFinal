﻿namespace AspNetCoreAPI
{
    public class PasswordDTO
    {
        public string? OldPassword { get; set; }
        public string? NewPassword { get; set; }
        public string? Confirm { get; set; }
    }
}
