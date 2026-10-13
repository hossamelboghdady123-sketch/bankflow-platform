package com.bankflow.api.transfer;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TransactionRepository
        extends JpaRepository<BankTransaction, Long> {

    @Query("""
        SELECT t
        FROM BankTransaction t
        JOIN FETCH t.fromAccount
        JOIN FETCH t.toAccount
        ORDER BY t.createdAt DESC
        """)
    List<BankTransaction> findAllByOrderByCreatedAtDesc();
}
