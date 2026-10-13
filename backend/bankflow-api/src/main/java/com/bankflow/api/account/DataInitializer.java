package com.bankflow.api.account;

import java.math.BigDecimal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeAccounts(AccountRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                repository.save(new Account(
                    "Ahmed Hassan",
                    "BF10000001",
                    new BigDecimal("15000.00"),
                    "EGP"
                ));

                repository.save(new Account(
                    "Mona Ali",
                    "BF10000002",
                    new BigDecimal("8500.00"),
                    "EGP"
                ));
            }
        };
    }
}
