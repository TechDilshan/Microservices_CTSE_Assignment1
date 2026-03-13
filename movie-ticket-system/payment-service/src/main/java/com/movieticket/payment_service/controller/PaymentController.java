package com.movieticket.payment_service.controller;

import com.movieticket.payment_service.model.Payment;
import com.movieticket.payment_service.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @Operation(summary = "Create a new payment for a booking")
    @PostMapping
    public Payment createPayment(@RequestBody Payment payment) {
        return service.createPayment(payment);
    }

    @Operation(summary = "Get all payments")
    @GetMapping
    public List<Payment> getPayments() {
        return service.getAllPayments();
    }

    @Operation(summary = "Get payment by payment ID")
    @GetMapping("/{id}")
    public Payment getPayment(@PathVariable String id) {
        return service.getPayment(id);
    }

    @Operation(summary = "Get payments by booking ID")
    @GetMapping("/booking/{bookingId}")
    public List<Payment> getBookingPayments(@PathVariable String bookingId) {
        return service.getPaymentByBooking(bookingId);
    }

    @Operation(summary = "Update payment status")
    @PutMapping("/{id}/status")
    public Payment updateStatus(@PathVariable String id,
            @RequestParam String status) {
        return service.updateStatus(id, status);
    }

    @Operation(summary = "Delete or cancel a payment")
    @DeleteMapping("/{id}")
    public void deletePayment(@PathVariable String id) {
        service.deletePayment(id);
    }
}