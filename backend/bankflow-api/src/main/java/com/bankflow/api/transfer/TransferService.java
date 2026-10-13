package com.bankflow.api.transfer;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bankflow.api.account.Account;
import com.bankflow.api.account.AccountRepository;

@Service
public class TransferService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;

    public TransferService(
            AccountRepository accountRepository,
            TransactionRepository transactionRepository) {
        this.accountRepository = accountRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional
    public BankTransaction transfer(TransferRequest request) {
        if (request.fromAccountNumber().equals(request.toAccountNumber())) {
            throw new IllegalArgumentException(
                "Source and destination accounts must be different");
        }

        BigDecimal amount = request.amount();

        if (amount == null
                || amount.compareTo(BigDecimal.ZERO) <= 0
                || amount.scale() > 2) {
            throw new IllegalArgumentException(
                "Amount must be positive and have at most two decimal places");
        }

        Account source = accountRepository
            .findByAccountNumber(request.fromAccountNumber())
            .orElseThrow(() -> new IllegalArgumentException(
                "Source account not found"));

        Account destination = accountRepository
            .findByAccountNumber(request.toAccountNumber())
            .orElseThrow(() -> new IllegalArgumentException(
                "Destination account not found"));

        if (!source.getCurrency().equals(destination.getCurrency())) {
            throw new IllegalArgumentException(
                "Accounts must use the same currency");
        }

        Long firstId = Math.min(source.getId(), destination.getId());
        Long secondId = Math.max(source.getId(), destination.getId());

        Account first = accountRepository.findByIdForUpdate(firstId)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        Account second = accountRepository.findByIdForUpdate(secondId)
            .orElseThrow(() -> new IllegalArgumentException("Account not found"));

        source = source.getId().equals(first.getId()) ? first : second;
        destination = destination.getId().equals(first.getId()) ? first : second;

        if (source.getBalance().compareTo(amount) < 0) {
            throw new IllegalArgumentException("Insufficient funds");
        }

        source.setBalance(source.getBalance().subtract(amount));
        destination.setBalance(destination.getBalance().add(amount));

        BankTransaction transaction = new BankTransaction(
            source, destination, amount, source.getCurrency());

        return transactionRepository.save(transaction);
    }
}
