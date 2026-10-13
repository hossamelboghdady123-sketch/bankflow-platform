package com.bankflow.api.transfer;

import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/transfers")
public class TransferController {

    private final TransferService transferService;
    private final TransactionRepository transactionRepository;

    public TransferController(
            TransferService transferService,
            TransactionRepository transactionRepository) {
        this.transferService = transferService;
        this.transactionRepository = transactionRepository;
    }

    @PostMapping
    public Map<String, Object> createTransfer(
            @Valid @RequestBody TransferRequest request) {
        try {
            BankTransaction transaction = transferService.transfer(request);
            return Map.of(
                "message", "Transfer completed successfully",
                "transactionId", transaction.getId()
            );
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping
    public List<Map<String, Object>> getTransactions() {
        return transactionRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(transaction -> Map.<String, Object>of(
                "id", transaction.getId(),
                "fromAccountNumber", transaction.getFromAccountNumber(),
                "toAccountNumber", transaction.getToAccountNumber(),
                "amount", transaction.getAmount(),
                "currency", transaction.getCurrency(),
                "createdAt", transaction.getCreatedAt()
            ))
            .toList();
    }
}
