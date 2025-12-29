package com.julian.razif.perkakas;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final JWTUtil jwtUtil;

  public AuthController(JWTUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
  }

  @CrossOrigin(value = "*", allowedHeaders = "*")
  @PostMapping("/login")
  public Map<String, String> login(@RequestParam String username) {
    return Map.of("token", jwtUtil.generateToken(username));
  }

}
