package com.julian.razif.perkakas;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JWTUtil {

  private final Key key = Keys.hmacShaKeyFor(
    "secretforjwttokenthatthekeysizemustbegreaterthanorequaltothehashoutputsize".getBytes()
  );

  public String generateToken(String username) {
    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date((new Date()).getTime() + 1000 * 60 * 60 * 24))
      .signWith(key)
      .compact();
  }

  public String extractUsername(String token) {
    return Jwts.parserBuilder()
      .setSigningKey(key)
      .build()
      .parseClaimsJws(token)
      .getBody()
      .getSubject();
  }

}
