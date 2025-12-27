package com.kallpa.ssoma.hazmat;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.kallpa.ssoma.hazmat", "com.kallpa.ssoma.shared"})
public class SsomaHazmatServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(SsomaHazmatServiceApplication.class, args);
	}

}
