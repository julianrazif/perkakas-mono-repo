package com.julian.razif.perkakas;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfiguration {

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http, JWTFilter jwtFilter) {
    return http
      .csrf(AbstractHttpConfigurer::disable)
      .httpBasic(AbstractHttpConfigurer::disable)
      .formLogin(AbstractHttpConfigurer::disable)
      .logout(AbstractHttpConfigurer::disable)
      .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
      .authorizeHttpRequests(authorize -> authorize
        .requestMatchers("/auth/**").permitAll()
        .anyRequest()
        .authenticated()
      )
      .build();
  }

}
